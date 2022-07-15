// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
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

    it('checks if provider function returns a promise that returns the token', async () => {
      const func = oauthCodeReaderProvider.value();
      const result = await func(token);
      expect(result).to.be.eql(token);
    });
  });

  function setUp() {
    oauthCodeReaderProvider = new OauthCodeReaderProvider();
  }
});
