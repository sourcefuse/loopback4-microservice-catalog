// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {juggler} from '@loopback/repository';
import {expect, sinon} from '@loopback/testlab';
import {generateKeyPairSync} from 'crypto';
import * as jwt from 'jsonwebtoken';
import {FacadesBearerAsymmetricTokenVerifyProvider} from '../../components/bearer-verifier/providers/facades-bearer-asym-token-verify.provider';
import {FacadesBearerTokenVerifyProvider} from '../../components/bearer-verifier/providers/facades-bearer-token-verify.provider';
import {
  RevokedTokenRepository,
  UserTokensValidAfterRepository,
} from '../../repositories';

describe('Facades bearer verifiers with tokensValidAfter', () => {
  const SECRET = 'test-secret';
  const ISSUER = 'test-issuer';
  const nowSec = Math.floor(Date.now() / 1000);
  const {publicKey, privateKey} = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {type: 'spki', format: 'pem'},
    privateKeyEncoding: {type: 'pkcs8', format: 'pem'},
  });
  const logger = {error: sinon.stub()};
  const revokedTokenRepo = {
    get: sinon.stub().resolves(undefined),
  } as unknown as RevokedTokenRepository;
  const publicKeysRepo = {
    get: sinon.stub().resolves({publicKey}),
  };
  const originalEnv = {...process.env};
  let markers: UserTokensValidAfterRepository;

  const symmetricToken = (iat: number) =>
    jwt.sign({id: 'u1', iat}, SECRET, {issuer: ISSUER, algorithm: 'HS256'});
  const asymmetricToken = (iat: number) =>
    jwt.sign({id: 'u1', iat}, privateKey, {
      issuer: ISSUER,
      algorithm: 'RS256',
      keyid: 'k1',
    });

  const symmetric = () =>
    new FacadesBearerTokenVerifyProvider(
      revokedTokenRepo,
      logger as never,
      undefined,
      markers,
    ).value();
  const asymmetric = () =>
    new FacadesBearerAsymmetricTokenVerifyProvider(
      revokedTokenRepo,
      publicKeysRepo as never,
      logger as never,
      undefined,
      markers,
    ).value();

  before(() => {
    process.env.JWT_SECRET = SECRET;
    process.env.JWT_ISSUER = ISSUER;
  });
  after(() => {
    process.env = originalEnv;
  });
  beforeEach(async () => {
    markers = new UserTokensValidAfterRepository(
      new juggler.DataSource({connector: 'kv-memory'}),
    );
  });

  [
    {name: 'symmetric', verifier: symmetric, sign: symmetricToken},
    {name: 'asymmetric', verifier: asymmetric, sign: asymmetricToken},
  ].forEach(({name, verifier, sign}) => {
    describe(name, () => {
      it('rejects a token issued before the marker with TokenRevoked', async () => {
        await markers.revoke('u1', 3600 * 1000);
        const err = await verifier()(sign(nowSec - 600)).catch(e => e);
        expect(err.statusCode).to.eql(401);
        expect(err.message).to.eql('TokenRevoked');
      });

      it('accepts a token when no marker exists', async () => {
        const user = await verifier()(sign(nowSec - 600));
        expect(user?.id).to.eql('u1');
      });

      it('accepts a token issued after the marker', async () => {
        await markers.revoke('u1', 3600 * 1000);
        const user = await verifier()(sign(nowSec + 60));
        expect(user?.id).to.eql('u1');
      });
    });
  });
});
