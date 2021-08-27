import {
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  expect,
} from '@loopback/testlab';
import {RevokedTokenRepository} from '../../../repositories';
import sinon from 'sinon';
import {BearerTokenVerifyProvider} from '../../../modules/auth/providers/bearer-token-verify.provider';

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
      const result = func(token);
      expect(result).to.be.Promise();
    });
  });

  function log() {}

  function info() {}

  function warn() {}

  function error() {}

  function debug() {}

  function setUp() {
    revokedTokenRepo = createStubInstance(RevokedTokenRepository);
    bearerTokenVerifyProvider = new BearerTokenVerifyProvider(
      revokedTokenRepo,
      logger,
    );
  }
});
