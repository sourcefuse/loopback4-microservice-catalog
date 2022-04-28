import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {FacebookOauth2SignupProvider} from '../../providers';

describe('Facebook Oauth Signup Service', () => {
  let facebookOauth2SignupProvider: FacebookOauth2SignupProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  const profile = {
    id: 'test_id',
    displayName: 'test_display_name',
    birthday: 'test_date',
    _raw: 'test_raw',
    _json: 'test_json',
    provider: 'test_provider',
  };

  describe('Signup Service', () => {
    it('checks if provider returns a function', async () => {
      const result = facebookOauth2SignupProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider function returns a promise and throws not implemented', async () => {
      const func = facebookOauth2SignupProvider.value();
      const result = await func(profile).catch(err => err.message);
      expect(result).to.be.eql('FacebookOauth2SignupProvider not implemented');
    });
  });

  function setUp() {
    facebookOauth2SignupProvider = new FacebookOauth2SignupProvider();
  }
});
