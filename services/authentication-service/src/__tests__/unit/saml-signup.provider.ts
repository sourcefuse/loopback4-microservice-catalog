import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {SamlSignupProvider} from '../../providers';

describe('Saml Signup Service', () => {
  let samlSignupProvider: SamlSignupProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  const profile = {
    id: 'test_id',
    displayName: 'test_display_name',
    profileUrl: 'test_profile_url',
    _raw: 'test_raw',
    issuer: '',
    nameID: '',
    nameIDFormat: '',
    _json: {
      iss: 'test',
      aud: 'test',
      sub: 'test',
      iat: 1353601026,
      exp: 1353601026,
    },
    provider: 'test_provider',
  };

  describe('Signup Service', () => {
    it('checks if provider returns a function', async () => {
      const result = samlSignupProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider function returns a promise and throws not implemented', async () => {
      const func = samlSignupProvider.value();
      const result = await func(profile).catch(err => err.message);
      expect(result).to.be.eql('SamlSignupProvider not implemented');
    });
  });

  function setUp() {
    samlSignupProvider = new SamlSignupProvider();
  }
});
