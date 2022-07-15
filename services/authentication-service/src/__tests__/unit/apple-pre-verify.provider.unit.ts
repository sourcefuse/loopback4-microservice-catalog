// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {ApplePreVerifyProvider} from '../../providers';

describe('Apple Oauth Pre Verify Service', () => {
  let applePreVerifyProvider: ApplePreVerifyProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  const accessToken = 'test_access_token';
  const refreshToken = 'test_refresh_token';
  const profile = {};
  const user = null;

  describe('Pre Verify Service', () => {
    it('checks if provider returns a function', async () => {
      const result = applePreVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider function returns a promise and it returns the user', async () => {
      const func = applePreVerifyProvider.value();
      const result = await func(accessToken, refreshToken, profile, user);
      expect(result).to.be.eql(user);
    });
  });

  function setUp() {
    applePreVerifyProvider = new ApplePreVerifyProvider();
  }
});
