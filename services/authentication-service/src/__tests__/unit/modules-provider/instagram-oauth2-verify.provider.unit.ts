import {
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  expect,
} from '@loopback/testlab';
import {UserCredentialsRepository, UserRepository} from '../../../repositories';
import sinon from 'sinon';
import {InstagramOauth2VerifyProvider} from '../../../modules/auth/providers/instagram-oauth2-verify.provider';
import {InstagramSignUpFn} from '../../../providers';
import * as InstagramStrategy from 'passport-instagram';
import {
  User,
  UserCredentials,
  UserCredentialsWithRelations,
  UserWithRelations,
} from '../../../models';
import {IAuthUser} from 'loopback4-authentication';

describe('Instagram Verify Provider', () => {
  let userRepo: StubbedInstanceWithSinonAccessor<UserRepository>;
  let userCredentialRepo: StubbedInstanceWithSinonAccessor<UserCredentialsRepository>;
  let instagramVerifyProvider: InstagramOauth2VerifyProvider;

  const signupProvider: InstagramSignUpFn = async (
    profile: InstagramStrategy.Profile,
  ) => {
    return null;
  };
  const preVerifyProvider = async (
    accessToken: string,
    refreshToken: string,
    profile: InstagramStrategy.Profile,
    user: IAuthUser | null,
  ) => {
    return user;
  };
  const postVerifyProvider = async (
    profile: InstagramStrategy.Profile,
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

  describe('instagram oauth2 verify provider', () => {
    it('checks if provider returns a function', async () => {
      const result = instagramVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('return error promise for no user', async () => {
      const func = instagramVerifyProvider.value();
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
      const func = instagramVerifyProvider.value();
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
        authProvider: 'instagram',
        authId: '1',
      });
      const findOne = userRepo.stubs.findOne;
      findOne.resolves(user as UserWithRelations);
      const findTwo = userCredentialRepo.stubs.findOne;
      findTwo.resolves(userCred as UserCredentialsWithRelations);
      const func = instagramVerifyProvider.value();
      const result = func(accessToken, refreshToken, profile);
      expect(result).to.be.Promise();
      sinon.assert.calledOnce(findOne);
    });
  });

  function setUp() {
    userRepo = createStubInstance(UserRepository);
    userCredentialRepo = createStubInstance(UserCredentialsRepository);
    instagramVerifyProvider = new InstagramOauth2VerifyProvider(
      userRepo,
      userCredentialRepo,
      signupProvider,
      preVerifyProvider,
      postVerifyProvider,
    );
  }
});
