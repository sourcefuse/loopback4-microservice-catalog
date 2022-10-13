// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
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

    it('checks if provider function returns a promise and returns the token value', async () => {
      const func = codeWriterProvider.value();
      const result = await func(token);
      expect(result).to.be.eql(token);
    });
  });

  function setUp() {
    codeWriterProvider = new CodeWriterProvider();
  }
});
