import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {ApplePreVerifyProvider} from '../../providers';

describe('Apple Oauth Pre Verify Service', () => {
  let applePreVerifyProvider: ApplePreVerifyProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  const accessToken = 'test_access_token';
  const refreshToken = 'test_refresh_token';
  const profile = {};
  const user = null;

  describe('Pre Verify Service', () => {
    it('checks if provider returns a function', async () => {
      const result = applePreVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider function returns a promise', async () => {
      const func = applePreVerifyProvider.value();
      const result = func(accessToken, refreshToken, profile, user);
      expect(result).to.be.Promise();
    });
  });

  function setUp() {
    applePreVerifyProvider = new ApplePreVerifyProvider();
  }
});
