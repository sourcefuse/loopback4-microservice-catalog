import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {FacebookPostVerifyProvider} from '../../providers';

describe('Facebook Oauth Post Verify Service', () => {
  let facebookPostVerifyProvider: FacebookPostVerifyProvider;

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
  const user = null;

  describe('Post Verify Service', () => {
    it('checks if provider returns a function', async () => {
      const result = facebookPostVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider function returns a promise', async () => {
      const func = facebookPostVerifyProvider.value();
      const result = func(profile, user);
      expect(result).to.be.Promise();
    });
  });

  function setUp() {
    facebookPostVerifyProvider = new FacebookPostVerifyProvider();
  }
});
