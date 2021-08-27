import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {AppleOauth2SignupProvider} from '../../providers';

describe('Apple Oauth Signup Service', () => {
  let appleOauth2SignupProvider: AppleOauth2SignupProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  const profile = {};

  describe('Signup Service', () => {
    it('checks if provider returns a function', async () => {
      const result = appleOauth2SignupProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider function returns a promise', async () => {
      const func = appleOauth2SignupProvider.value();
      const result = func(profile);
      expect(result).to.be.Promise();
    });
  });

  function setUp() {
    appleOauth2SignupProvider = new AppleOauth2SignupProvider();
  }
});
