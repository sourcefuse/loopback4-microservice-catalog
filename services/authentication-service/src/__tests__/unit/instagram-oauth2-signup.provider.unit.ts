import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {InstagramOauth2SignupProvider} from '../../providers';

describe('Instagram Oauth Signup Service', () => {
  let instagramOauth2SignupProvider: InstagramOauth2SignupProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  const profile = {
    id: 'test_id',
    displayName: 'test_display_name',
    username: 'test_user_name',
    name: {
      familyName: 'test_family_name',
      givenName: 'test_given_name',
    },
    _raw: 'test_raw',
    _json: 'test_json',
    provider: 'test_provider',
  };

  describe('Signup Service', () => {
    it('checks if provider returns a function', async () => {
      const result = instagramOauth2SignupProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider function returns a promise', async () => {
      const func = instagramOauth2SignupProvider.value();
      const result = func(profile);
      expect(result).to.be.Promise();
    });
  });

  function setUp() {
    instagramOauth2SignupProvider = new InstagramOauth2SignupProvider();
  }
});
