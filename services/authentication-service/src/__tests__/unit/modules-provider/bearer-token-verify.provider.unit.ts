// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  expect,
} from '@loopback/testlab';
import {juggler} from '@loopback/repository';
import {UserTokensValidAfterRepository} from '@sourceloop/core';
import {RevokedTokenRepository} from '../../../repositories';
import sinon from 'sinon';
import {BearerTokenVerifyProvider} from '../../../modules/auth/providers/bearer-token-verify.provider';
import {JWTSymmetricVerifierProvider} from '../../..';
import {AuthUser} from '../../../modules/auth';
function log() {
  // This is intentional
}

function info() {
  // This is intentional
}

function warn() {
  // This is intentional
}

function error() {
  // This is intentional
}

function debug() {
  // This is intentional
}
describe('Bearer Token Verify Provider', () => {
  let revokedTokenRepo: StubbedInstanceWithSinonAccessor<RevokedTokenRepository>;
  let bearerTokenVerifyProvider: BearerTokenVerifyProvider;

  const logger = {
    log,
    info,
    warn,
    error,
    debug,
  };

  const token = 'test_token';

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  describe('Bearer Token Verifier', () => {
    it('checks if provider returns a function', async () => {
      const result = bearerTokenVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('return token expiry for expired token', async () => {
      const func = bearerTokenVerifyProvider.value();
      const result = await func(token).catch(err => err.message);
      expect(result).to.be.eql('TokenExpired');
    });
  });

  describe('Revoked user tokens', () => {
    const nowSec = Math.floor(Date.now() / 1000);
    let markers: UserTokensValidAfterRepository;

    const verifierFor = (iat: number) =>
      new BearerTokenVerifyProvider(
        revokedTokenRepo,
        logger,
        () => Promise.resolve(Object.assign(new AuthUser({id: 'u1'}), {iat})),
        markers,
      ).value();

    beforeEach(() => {
      markers = new UserTokensValidAfterRepository(
        new juggler.DataSource({connector: 'kv-memory'}),
      );
    });

    it('rejects a token issued before the user revocation with TokenRevoked', async () => {
      await markers.revoke('u1', 3600 * 1000);
      const err = await verifierFor(nowSec - 600)(token).catch(e => e);
      expect(err.statusCode).to.eql(401);
      expect(err.message).to.eql('TokenRevoked');
    });

    it('accepts a token issued after the user revocation', async () => {
      await markers.revoke('u1', 3600 * 1000);
      const user = await verifierFor(nowSec + 60)(token);
      expect(user?.id).to.eql('u1');
    });

    it('accepts a token when the user was never revoked', async () => {
      const user = await verifierFor(nowSec - 600)(token);
      expect(user?.id).to.eql('u1');
    });
  });

  function setUp() {
    revokedTokenRepo = createStubInstance(RevokedTokenRepository);
    bearerTokenVerifyProvider = new BearerTokenVerifyProvider(
      revokedTokenRepo,
      logger,
      new JWTSymmetricVerifierProvider<AuthUser>().value(),
    );
  }
});
