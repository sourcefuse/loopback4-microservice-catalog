// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {juggler} from '@loopback/repository';
import {expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import sinon from 'sinon';
import {UserTokensValidAfterRepository} from '@sourceloop/core';
import {AuthClient, RefreshToken} from '../../models';
import {AuthRefreshTokenRequest} from '../../modules/auth/models';
import {LoginController} from '../../modules/auth/controllers/login.controller';
import {
  AuthClientRepository,
  RefreshTokenRepository,
  RevokedTokenRepository,
  UserCredentialsRepository,
} from '../../repositories';
import {IdpLoginService, UserTokenRevocationService} from '../../services';

describe('UserTokenRevocationService', () => {
  let authClientRepo: sinon.SinonStubbedInstance<AuthClientRepository>;
  let markers: UserTokensValidAfterRepository;
  let set: sinon.SinonSpy;
  let service: UserTokenRevocationService;
  const logger = {info: sinon.stub()};

  beforeEach(() => {
    authClientRepo = sinon.createStubInstance(AuthClientRepository);
    markers = new UserTokensValidAfterRepository(
      new juggler.DataSource({connector: 'kv-memory'}),
    );
    set = sinon.spy(markers, 'set');
    service = new UserTokenRevocationService(
      authClientRepo,
      markers,
      logger as never,
    );
  });

  afterEach(() => sinon.restore());

  it('stores a tenant marker with the longest token lifetime as ttl', async () => {
    authClientRepo.find.resolves([
      new AuthClient({
        accessTokenExpiration: 900,
        refreshTokenExpiration: 3600,
      }),
      new AuthClient({
        accessTokenExpiration: 7200,
        refreshTokenExpiration: 1800,
      }),
    ]);

    await service.revokeUserTokens('u1', {tenantId: 't1'});

    sinon.assert.calledOnceWithExactly(
      set,
      'tokensValidAfter:u1:t1',
      sinon.match.object,
      {ttl: 7200000},
    );
  });

  it('stores a user-wide marker when no tenant is given', async () => {
    authClientRepo.find.resolves([
      new AuthClient({
        accessTokenExpiration: 900,
        refreshTokenExpiration: 3600,
      }),
    ]);

    await service.revokeUserTokens('u1');

    sinon.assert.calledOnceWithExactly(
      set,
      'tokensValidAfter:u1',
      sinon.match.object,
      {ttl: 3600000},
    );
  });

  it('writes nothing when there are no auth clients', async () => {
    authClientRepo.find.resolves([]);

    await service.revokeUserTokens('u1');

    sinon.assert.notCalled(set);
  });
});

describe('LoginController token refresh after user revocation', () => {
  const nowSec = Math.floor(Date.now() / 1000);
  const accessToken = (iat: number) => jwt.sign({id: 'u1', iat}, 'secret');
  let markers: UserTokensValidAfterRepository;
  let refreshTokenRepo: sinon.SinonStubbedInstance<RefreshTokenRepository>;
  let authClientRepo: sinon.SinonStubbedInstance<AuthClientRepository>;
  let idpLoginService: sinon.SinonStubbedInstance<IdpLoginService>;
  let controller: LoginController;

  const storeRefreshToken = (iat: number) =>
    refreshTokenRepo.get.resolves(
      new RefreshToken({
        userId: 'u1',
        clientId: 'c1',
        accessToken: accessToken(iat),
        pubnubToken: 'pubnub',
      }),
    );

  beforeEach(() => {
    markers = new UserTokensValidAfterRepository(
      new juggler.DataSource({connector: 'kv-memory'}),
    );
    refreshTokenRepo = sinon.createStubInstance(RefreshTokenRepository);
    authClientRepo = sinon.createStubInstance(AuthClientRepository);
    idpLoginService = sinon.createStubInstance(IdpLoginService);
    authClientRepo.findOne.resolves(new AuthClient({clientId: 'c1'}));
    const userCredsRepo = sinon.createStubInstance(UserCredentialsRepository);
    userCredsRepo.findOne.resolves(null);
    controller = new LoginController(
      undefined,
      undefined,
      authClientRepo,
      undefined as never,
      undefined as never,
      undefined as never,
      undefined as never,
      undefined as never,
      undefined as never,
      refreshTokenRepo,
      sinon.createStubInstance(RevokedTokenRepository),
      undefined as never,
      userCredsRepo,
      {info: sinon.stub()} as never,
      undefined as never,
      idpLoginService,
      undefined as never,
      async () => true,
      markers,
    );
  });

  it('rejects a refresh token issued before the revocation and deletes it', async () => {
    storeRefreshToken(nowSec - 600);
    await markers.revoke('u1', 3600 * 1000);

    const err = await controller
      .exchangeToken(
        new AuthRefreshTokenRequest({refreshToken: 'r'}),
        undefined,
        'Bearer x',
      )
      .catch(e => e);

    expect(err.statusCode).to.eql(401);
    expect(err.message).to.eql('TokenRevoked');
    sinon.assert.calledWith(refreshTokenRepo.delete, 'r');
    sinon.assert.calledWith(refreshTokenRepo.delete, 'pubnub');
  });

  it('skips the revocation check when the marker repository is absent', async () => {
    controller.userTokensValidAfterRepo = undefined;
    const token = accessToken(nowSec - 600);
    refreshTokenRepo.get.resolves(
      new RefreshToken({userId: 'u1', clientId: 'c1', accessToken: token}),
    );
    idpLoginService.createJWT.resolves({accessToken: 'new'} as never);
    await markers.revoke('u1', 3600 * 1000);

    const res = await controller.exchangeToken(
      new AuthRefreshTokenRequest({refreshToken: 'r'}),
      undefined,
      `Bearer ${token}`,
    );

    expect(res).to.containEql({accessToken: 'new'});
  });

  it('refreshes a token issued after the revocation', async () => {
    const token = accessToken(nowSec + 60);
    refreshTokenRepo.get.resolves(
      new RefreshToken({userId: 'u1', clientId: 'c1', accessToken: token}),
    );
    idpLoginService.createJWT.resolves({accessToken: 'new'} as never);
    await markers.revoke('u1', 3600 * 1000);

    const res = await controller.exchangeToken(
      new AuthRefreshTokenRequest({refreshToken: 'r'}),
      undefined,
      `Bearer ${token}`,
    );

    expect(res).to.containEql({accessToken: 'new'});
  });
});
