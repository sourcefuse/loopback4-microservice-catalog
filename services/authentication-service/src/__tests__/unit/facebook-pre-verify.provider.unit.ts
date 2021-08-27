import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {FacebookPreVerifyProvider} from '../../providers';

describe('Facebook Oauth Pre Verify Service', () => {
  let facebookPreVerifyProvider: FacebookPreVerifyProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  const accessToken = 'test_access_token';
  const refreshToken = 'test_refresh_token';
  const profile = {
    id: 'test_id',
    displayName: 'test_display_name',
    birthday: 'test_date',
    _raw: 'test_raw',
    _json: 'test_json',
    provider: 'test_provider',
  };
  const user = null;

  describe('Pre Verify Service', () => {
    it('checks if provider returns a function', async () => {
      const result = facebookPreVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider function returns a promise', async () => {
      const func = facebookPreVerifyProvider.value();
      const result = func(accessToken, refreshToken, profile, user);
      expect(result).to.be.Promise();
    });
  });

  function setUp() {
    facebookPreVerifyProvider = new FacebookPreVerifyProvider();
  }
});
