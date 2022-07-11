// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {InstagramPostVerifyProvider} from '../../providers';

describe('Instagram Oauth Post Verify Service', () => {
  let instagramPostVerifyProvider: InstagramPostVerifyProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  const profile = {
    id: 'test_id',
    displayName: 'test_display_name',
    username: 'test_user_name',
    name: {
      familyName: 'test_family_name',
      givenName: 'test_given_name',
    },
    _raw: 'test_raw',
    _json: 'test_json',
    provider: 'test_provider',
  };
  const user = null;

  describe('Post Verify Service', () => {
    it('checks if provider returns a function', async () => {
      const result = instagramPostVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider function returns a promise which is eql to user', async () => {
      const func = instagramPostVerifyProvider.value();
      const result = await func(profile, user);
      expect(result).to.be.eql(user);
    });
  });

  function setUp() {
    instagramPostVerifyProvider = new InstagramPostVerifyProvider();
  }
});
