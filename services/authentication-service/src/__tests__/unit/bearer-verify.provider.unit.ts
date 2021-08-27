import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {SignupBearerVerifyProvider} from '../../providers';

describe('Bearer Verify Signup Service', () => {
  let bearerVerifyProvider: SignupBearerVerifyProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  const logger = {
    log,
    info,
    warn,
    error,
    debug,
  };

  const token = 'test_token';

  describe('Bearer Verify Service', () => {
    it('checks if provider returns a function', async () => {
      const result = bearerVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider function returns a promise', async () => {
      const func = bearerVerifyProvider.value();
      const result = func(token);
      expect(result).to.be.Promise();
    });
  });

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

  function setUp() {
    bearerVerifyProvider = new SignupBearerVerifyProvider(logger);
  }
});
