// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {KeyCloakSignupProvider} from '../../providers';

describe('Keycloak Oauth Signup Service', () => {
  let keycloakOauth2SignupProvider: KeyCloakSignupProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  const profile = {
    keycloakId: 'test_id',
    firstName: 'test_first_name',
    lastName: 'test_last_name',
    username: 'test_user_name',
    fullName: 'test_full_name',
    email: 'test_email',
    avatar: 'test_avatar',
    realm: 'test_realm',
    _raw: 'test_raw',
    _json: 'test_json',
    provider: 'test_provider',
  };

  describe('Signup Service', () => {
    it('checks if provider returns a function', async () => {
      const result = keycloakOauth2SignupProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider function returns a promise and throws not implemented', async () => {
      const func = keycloakOauth2SignupProvider.value();
      const result = await func(profile).catch(err => err.message);
      expect(result).to.be.eql('KeyCloakSignupProvider not implemented');
    });
  });

  function setUp() {
    keycloakOauth2SignupProvider = new KeyCloakSignupProvider();
  }
});
