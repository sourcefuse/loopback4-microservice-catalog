import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {GoogleOauth2SignupProvider} from '../../providers';

describe('Google Oauth Signup Service', () => {
  let googleOauth2SignupProvider: GoogleOauth2SignupProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  const profile = {
    id: 'test_id',
    displayName: 'test_display_name',
    profileUrl: 'test_profile_url',
    _raw: 'test_raw',
    _json: 'test_json',
    provider: 'test_provider',
  };

  describe('Signup Service', () => {
    it('checks if provider returns a function', async () => {
      const result = googleOauth2SignupProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider function returns a promise', async () => {
      const func = googleOauth2SignupProvider.value();
      const result = func(profile);
      expect(result).to.be.Promise();
    });
  });

  function setUp() {
    googleOauth2SignupProvider = new GoogleOauth2SignupProvider();
  }
});
