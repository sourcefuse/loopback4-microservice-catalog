import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {SamlPreVerifyProvider} from '../../providers';

describe('Saml Pre Verify Service', () => {
  let samlPreVerifyProvider: SamlPreVerifyProvider;

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

  describe('Pre Verify Service', () => {
    it('checks if provider returns a function', async () => {
      const result = samlPreVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider function returns a promise which is eql to user', async () => {
      const func = samlPreVerifyProvider.value();
      const result = await func(profile, user);
      expect(result).to.be.eql(user);
    });
  });

  function setUp() {
    samlPreVerifyProvider = new SamlPreVerifyProvider();
  }
});
