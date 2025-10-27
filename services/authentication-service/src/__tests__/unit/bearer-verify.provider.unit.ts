// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {JwtKeysRepository} from '@sourceloop/core';
import sinon from 'sinon';
import {SignupBearerVerifyProvider} from '../../providers';
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
describe('Bearer Verify Signup Service', () => {
  let bearerVerifyProvider: SignupBearerVerifyProvider;
  let jwtKeysRepo: JwtKeysRepository;

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

    it('chexk if provider funtion throws error for token expiration', async () => {
      const func = bearerVerifyProvider.value();
      const result = await func(token).catch(err => err.message);
      expect(result).to.be.eql('TokenExpired');
    });
  });

  function setUp() {
    jwtKeysRepo = sinon.createStubInstance(JwtKeysRepository); // Mock the repository
    bearerVerifyProvider = new SignupBearerVerifyProvider(jwtKeysRepo, logger);
  }
});
