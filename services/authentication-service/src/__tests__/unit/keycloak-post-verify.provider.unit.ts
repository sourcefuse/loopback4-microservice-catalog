// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {KeyCloakPostVerifyProvider} from '../../providers';

describe('Keycloak Post Verify Service', () => {
  let keycloakPostVerifyProvider: KeyCloakPostVerifyProvider;

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
  const user = null;

  describe('Post Verify Service', () => {
    it('checks if provider returns a function', async () => {
      const result = keycloakPostVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider function returns a promise which is eql to user', async () => {
      const func = keycloakPostVerifyProvider.value();
      const result = await func(profile, user);
      expect(result).to.be.eql(user);
    });
  });

  function setUp() {
    keycloakPostVerifyProvider = new KeyCloakPostVerifyProvider();
  }
});
