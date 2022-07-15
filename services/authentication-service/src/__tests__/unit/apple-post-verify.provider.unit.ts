// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {ApplePostVerifyProvider} from '../../providers';

describe('Apple Oauth Post Verify Service', () => {
  let applePostVerifyProvider: ApplePostVerifyProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  const profile = {};
  const user = null;

  describe('Post Verify Service', () => {
    it('checks if provider returns a function', async () => {
      const result = applePostVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider function returns a promise and returns the user value', async () => {
      const func = applePostVerifyProvider.value();
      const result = await func(profile, user);
      expect(result).to.be.eql(user);
    });
  });

  function setUp() {
    applePostVerifyProvider = new ApplePostVerifyProvider();
  }
});
