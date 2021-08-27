import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {OauthCodeReaderProvider} from '../../providers';

describe('Code Reader Service', () => {
  let oauthCodeReaderProvider: OauthCodeReaderProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  const token = 'test_token';

  describe('Code Reader Service', () => {
    it('checks if provider returns a function', async () => {
      const result = oauthCodeReaderProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider function returns a promise', async () => {
      const func = oauthCodeReaderProvider.value();
      const result = func(token);
      expect(result).to.be.Promise();
    });
  });

  function setUp() {
    oauthCodeReaderProvider = new OauthCodeReaderProvider();
  }
});
