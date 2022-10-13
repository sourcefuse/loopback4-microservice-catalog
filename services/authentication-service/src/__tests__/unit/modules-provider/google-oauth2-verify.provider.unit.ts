// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  expect,
} from '@loopback/testlab';
import {UserCredentialsRepository, UserRepository} from '../../../repositories';
import sinon from 'sinon';
import {GoogleOauth2VerifyProvider} from '../../../modules/auth/providers/google-oauth2-verify.provider';
import {GoogleSignUpFn} from '../../../providers';
import * as GoogleStrategy from 'passport-google-oauth20';
import {
  User,
  UserCredentials,
  UserCredentialsWithRelations,
  UserWithRelations,
} from '../../../models';
import {IAuthUser} from 'loopback4-authentication';

describe('Google Verify Provider', () => {
  let userRepo: StubbedInstanceWithSinonAccessor<UserRepository>;
  let userCredentialRepo: StubbedInstanceWithSinonAccessor<UserCredentialsRepository>;
  let googleVerifyProvider: GoogleOauth2VerifyProvider;

  const signupProvider: GoogleSignUpFn = async (prof: GoogleStrategy.Profile) =>
    null;
  const preVerifyProvider = async (
    accToken: string,
    refToken: string,
    prof: GoogleStrategy.Profile,
    usr: IAuthUser | null,
  ) => usr;
  const postVerifyProvider = async (
    prof: GoogleStrategy.Profile,
    usr: IAuthUser | null,
  ) => usr;

  const accessToken = 'test_access_token';
  const refreshToken = 'test_refresh_token';
  const profile = {
    id: '1',
    _json: {
      email: 'xyz@gmail.com',
    },
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

  describe('google oauth2 verify provider', () => {
    it('checks if provider returns a function', async () => {
      const result = googleVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('return error promise for no user', async () => {
      const func = googleVerifyProvider.value();
      const result = await func(accessToken, refreshToken, profile).catch(
        err => err.message,
      );
      expect(result).to.be.eql('Invalid Credentials');
    });

    it('return error promise if there is no user cred', async () => {
      const findOne = userRepo.stubs.findOne;
      findOne.resolves(user as UserWithRelations);
      const func = googleVerifyProvider.value();
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
        authProvider: 'google',
        authId: '1',
      });
      const findOne = userRepo.stubs.findOne;
      findOne.resolves(user as UserWithRelations);
      const findTwo = userCredentialRepo.stubs.findOne;
      findTwo.resolves(userCred as UserCredentialsWithRelations);
      const func = googleVerifyProvider.value();
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
    googleVerifyProvider = new GoogleOauth2VerifyProvider(
      userRepo,
      userCredentialRepo,
      signupProvider,
      preVerifyProvider,
      postVerifyProvider,
    );
  }
});
