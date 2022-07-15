// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  createStubInstance,
  expect,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {IAuthUser, Keycloak} from 'loopback4-authentication';
import sinon from 'sinon';

import {
  User,
  UserCredentials,
  UserCredentialsWithRelations,
  UserWithRelations,
} from '../../../models';
import {KeycloakVerifyProvider} from '../../../modules/auth/providers/keycloak-verify.provider';
import {KeyCloakSignUpFn} from '../../../providers';
import {UserCredentialsRepository, UserRepository} from '../../../repositories';

describe('Keycloak Verify Provider', () => {
  let userRepo: StubbedInstanceWithSinonAccessor<UserRepository>;
  let userCredentialRepo: StubbedInstanceWithSinonAccessor<UserCredentialsRepository>;
  let keycloakVerifyProvider: KeycloakVerifyProvider;

  const signupProvider: KeyCloakSignUpFn = async (prof: Keycloak.Profile) =>
    null;
  const preVerifyProvider = async (
    accToken: string,
    refToken: string,
    prof: Keycloak.Profile,
    usr: IAuthUser | null,
  ) => usr;
  const postVerifyProvider = async (
    prof: Keycloak.Profile,
    usr: IAuthUser | null,
  ) => usr;

  const accessToken = 'test_access_token';
  const refreshToken = 'test_refresh_token';
  const profile = {
    email: 'test@gmail.com',
    keycloakId: '1',
  };

  const user = new User({
    id: '1',
    firstName: 'test',
    lastName: 'test',
    username: 'test_user',
    email: 'xyz@gmail.com',
    authClientIds: '{1}',
    dob: new Date(),
  });

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  describe('keycloak oauth2 verify provider', () => {
    it('checks if provider returns a function', async () => {
      const result = keycloakVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('return error promise for no user', async () => {
      const func = keycloakVerifyProvider.value();
      const result = await func(accessToken, refreshToken, profile).catch(
        err => err.message,
      );
      expect(result).to.be.eql('Invalid Credentials');
    });

    it('return error promise if there is no user cred', async () => {
      const findOne = userRepo.stubs.findOne;
      findOne.resolves(user as UserWithRelations);
      const func = keycloakVerifyProvider.value();
      const result = await func(accessToken, refreshToken, profile).catch(
        err => err.message,
      );
      expect(result).to.be.eql('Invalid Credentials');
      sinon.assert.calledOnce(findOne);
    });

    it('return user after post verification', async () => {
      const userCred = new UserCredentials({
        id: '1',
        userId: '1',
        authProvider: 'keycloak',
        authId: '1',
      });
      const findOne = userRepo.stubs.findOne;
      findOne.resolves(user as UserWithRelations);
      const findTwo = userCredentialRepo.stubs.findOne;
      findTwo.resolves(userCred as UserCredentialsWithRelations);
      const func = keycloakVerifyProvider.value();
      const result = await func(accessToken, refreshToken, profile);
      expect(result).to.have.properties(
        'id',
        'firstName',
        'lastName',
        'username',
        'email',
      );
      expect(result?.username).to.be.eql('test_user');
      sinon.assert.calledOnce(findOne);
    });
  });

  function setUp() {
    userRepo = createStubInstance(UserRepository);
    userCredentialRepo = createStubInstance(UserCredentialsRepository);
    keycloakVerifyProvider = new KeycloakVerifyProvider(
      userRepo,
      userCredentialRepo,
      signupProvider,
      preVerifyProvider,
      postVerifyProvider,
    );
  }
});
