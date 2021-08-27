import {
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  expect,
} from '@loopback/testlab';
import {UserCredentialsRepository, UserRepository} from '../../../repositories';
import sinon from 'sinon';
import {AppleOauth2VerifyProvider} from '../../../modules/auth/providers/apple-oauth2-verify.provider';
import {AppleSignUpFn} from '../../../providers';
import * as AppleStrategy from 'passport-apple';
import {
  User,
  UserCredentials,
  UserCredentialsWithRelations,
  UserWithRelations,
} from '../../../models';
import {IAuthUser} from 'loopback4-authentication';

describe('Apple Verify Provider', () => {
  let userRepo: StubbedInstanceWithSinonAccessor<UserRepository>;
  let userCredentialRepo: StubbedInstanceWithSinonAccessor<UserCredentialsRepository>;
  let appleVerifyProvider: AppleOauth2VerifyProvider;

  const signupProvider: AppleSignUpFn = async (
    profile: AppleStrategy.Profile,
  ) => {
    return null;
  };
  const preVerifyProvider = async (
    accessToken: string,
    refreshToken: string,
    profile: AppleStrategy.Profile,
    user: IAuthUser | null,
  ) => {
    return user;
  };
  const postVerifyProvider = async (
    profile: AppleStrategy.Profile,
    user: IAuthUser | null,
  ) => {
    return user;
  };

  const accessToken = 'test_access_token';
  const refreshToken = 'test_refresh_token';
  const profile = {
    id: '1',
    _json: {
      email: 'xyz@gmail.com',
    },
  };

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  describe('apple oauth2 verify provider', () => {
    it('checks if provider returns a function', async () => {
      const result = appleVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('return error promise for no user', async () => {
      const func = appleVerifyProvider.value();
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
      const func = appleVerifyProvider.value();
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
        authProvider: 'apple',
        authId: '1',
      });
      const findOne = userRepo.stubs.findOne;
      findOne.resolves(user as UserWithRelations);
      const findTwo = userCredentialRepo.stubs.findOne;
      findTwo.resolves(userCred as UserCredentialsWithRelations);
      const func = appleVerifyProvider.value();
      const result = func(accessToken, refreshToken, profile);
      expect(result).to.be.Promise();
      sinon.assert.calledOnce(findOne);
    });
  });

  function setUp() {
    userRepo = createStubInstance(UserRepository);
    userCredentialRepo = createStubInstance(UserCredentialsRepository);
    appleVerifyProvider = new AppleOauth2VerifyProvider(
      userRepo,
      userCredentialRepo,
      signupProvider,
      preVerifyProvider,
      postVerifyProvider,
    );
  }
});
