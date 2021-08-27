import {
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  expect,
} from '@loopback/testlab';
import {UserCredentialsRepository, UserRepository} from '../../../repositories';
import sinon from 'sinon';
import {KeycloakVerifyProvider} from '../../../modules/auth/providers/keycloak-verify.provider';
import {KeyCloakSignUpFn} from '../../../providers';
import {IAuthUser, KeycloakProfile} from 'loopback4-authentication';
import {
  User,
  UserCredentials,
  UserCredentialsWithRelations,
  UserWithRelations,
} from '../../../models';

describe('Keycloak Verify Provider', () => {
  let userRepo: StubbedInstanceWithSinonAccessor<UserRepository>;
  let userCredentialRepo: StubbedInstanceWithSinonAccessor<UserCredentialsRepository>;
  let keycloakVerifyProvider: KeycloakVerifyProvider;

  const signupProvider: KeyCloakSignUpFn = async (profile: KeycloakProfile) => {
    return null;
  };
  const preVerifyProvider = async (
    accessToken: string,
    refreshToken: string,
    profile: KeycloakProfile,
    user: IAuthUser | null,
  ) => {
    return user;
  };
  const postVerifyProvider = async (
    profile: KeycloakProfile,
    user: IAuthUser | null,
  ) => {
    return user;
  };

  const accessToken = 'test_access_token';
  const refreshToken = 'test_refresh_token';
  const profile = {
    email: 'test@gmail.com',
    keycloakId: '1',
  };

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  describe('keycloak oauth2 verify provider', () => {
    it('checks if provider returns a function', async () => {
      const result = keycloakVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('return error promise for no user', async () => {
      const func = keycloakVerifyProvider.value();
      const result = func(accessToken, refreshToken, profile);
      expect(result).to.be.Promise();
    });

    it('return error promise if there is no user cred', async () => {
      const user = new User({
        id: '1',
        firstName: 'test',
        lastName: 'test',
        username: 'test_user',
        email: 'xyz@gmail.com',
        authClientIds: '{1}',
        dob: new Date(),
      });
      const findOne = userRepo.stubs.findOne;
      findOne.resolves(user as UserWithRelations);
      const func = keycloakVerifyProvider.value();
      const result = func(accessToken, refreshToken, profile);
      expect(result).to.be.Promise();
      sinon.assert.calledOnce(findOne);
    });

    it('return user after post verification', async () => {
      const user = new User({
        id: '1',
        firstName: 'test',
        lastName: 'test',
        username: 'test_user',
        email: 'xyz@gmail.com',
        authClientIds: '{1}',
        dob: new Date(),
      });
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
      const result = func(accessToken, refreshToken, profile);
      expect(result).to.be.Promise();
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
