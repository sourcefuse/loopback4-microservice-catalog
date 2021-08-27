import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {CodeWriterProvider} from '../../providers';

describe('Code Writer Service', () => {
  let codeWriterProvider: CodeWriterProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  const token = 'test_token';

  describe('Code Writer Service', () => {
    it('checks if provider returns a function', async () => {
      const result = codeWriterProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider function returns a promise', async () => {
      const func = codeWriterProvider.value();
      const result = func(token);
      expect(result).to.be.Promise();
    });
  });

  function setUp() {
    codeWriterProvider = new CodeWriterProvider();
  }
});
