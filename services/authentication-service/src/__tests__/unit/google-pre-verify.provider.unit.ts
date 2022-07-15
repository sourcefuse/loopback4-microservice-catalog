// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {GooglePreVerifyProvider} from '../../providers';

describe('Google Oauth Pre Verify Service', () => {
  let googlePreVerifyProvider: GooglePreVerifyProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  const accessToken = 'test_access_token';
  const refreshToken = 'test_refresh_token';
  const profile = {
    id: 'test_id',
    displayName: 'test_display_name',
    profileUrl: 'test_profiel_url',
    _raw: 'test_raw',
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
      const result = googlePreVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider function returns a promise which is eql to user', async () => {
      const func = googlePreVerifyProvider.value();
      const result = await func(accessToken, refreshToken, profile, user);
      expect(result).to.be.eql(user);
    });
  });

  function setUp() {
    googlePreVerifyProvider = new GooglePreVerifyProvider();
  }
});
