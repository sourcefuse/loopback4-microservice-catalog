import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {SamlPostVerifyProvider} from '../../providers';

describe('Saml Post Verify Service', () => {
  let samlPostVerifyProvider: SamlPostVerifyProvider;

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
  const user = null;

  describe('Post Verify Service', () => {
    it('checks if provider returns a function', async () => {
      const result = samlPostVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider function returns a promise which returns the user', async () => {
      const func = samlPostVerifyProvider.value();
      const result = await func(profile, user);
      expect(result).to.be.eql(user);
    });
  });

  function setUp() {
    samlPostVerifyProvider = new SamlPostVerifyProvider();
  }
});
