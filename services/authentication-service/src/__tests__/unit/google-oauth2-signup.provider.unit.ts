// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import * as GoogleStrategy from 'passport-google-oauth20';
import sinon from 'sinon';
import {GoogleOauth2SignupProvider} from '../../providers';

describe('Google Oauth Signup Service', () => {
  let googleOauth2SignupProvider: GoogleOauth2SignupProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  const profile: GoogleStrategy.Profile = {
    id: 'test_id',
    displayName: 'test_display_name',
    profileUrl: 'test_profile_url',
    _raw: 'test_raw',
    _json: {
      iss: 'test',
      aud: 'test',
      sub: 'test',
      iat: 1353601026,
      exp: 1353601026,
    },
    provider: 'google',
  };

  describe('Signup Service', () => {
    it('checks if provider returns a function', async () => {
      const result = googleOauth2SignupProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider function returns a promise and throws not implemented', async () => {
      const func = googleOauth2SignupProvider.value();
      const result = await func(profile).catch(err => err.message);
      expect(result).to.be.eql('GoogleOauth2SignupProvider not implemented');
    });
  });

  function setUp() {
    googleOauth2SignupProvider = new GoogleOauth2SignupProvider();
  }
});
