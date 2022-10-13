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
import {FacebookOauth2VerifyProvider} from '../../../modules/auth/providers/facebook-oauth-verify.provider';
import {FacebookSignUpFn} from '../../../providers';
import * as FacebookStrategy from 'passport-facebook';
import {
  User,
  UserCredentials,
  UserCredentialsWithRelations,
  UserWithRelations,
} from '../../../models';
import {IAuthUser} from 'loopback4-authentication';

describe('Facebook Verify Provider', () => {
  let userRepo: StubbedInstanceWithSinonAccessor<UserRepository>;
  let userCredentialRepo: StubbedInstanceWithSinonAccessor<UserCredentialsRepository>;
  let facebookVerifyProvider: FacebookOauth2VerifyProvider;

  const signupProvider: FacebookSignUpFn = async (
    prof: FacebookStrategy.Profile,
  ) => null;
  const preVerifyProvider = async (
    accToken: string,
    refToken: string,
    prof: FacebookStrategy.Profile,
    usr: IAuthUser | null,
  ) => usr;
  const postVerifyProvider = async (
    prof: FacebookStrategy.Profile,
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

  describe('facebook oauth2 verify provider', () => {
    it('checks if provider returns a function', async () => {
      const result = facebookVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('return error promise for no user', async () => {
      const func = facebookVerifyProvider.value();
      const result = await func(accessToken, refreshToken, profile).catch(
        err => err.message,
      );
      expect(result).to.be.eql('Invalid Credentials');
    });

    it('return error promise if there is no user cred', async () => {
      const findOne = userRepo.stubs.findOne;
      findOne.resolves(user as UserWithRelations);
      const func = facebookVerifyProvider.value();
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
        authProvider: 'facebook',
        authId: '1',
      });
      const findOne = userRepo.stubs.findOne;
      findOne.resolves(user as UserWithRelations);
      const findTwo = userCredentialRepo.stubs.findOne;
      findTwo.resolves(userCred as UserCredentialsWithRelations);
      const func = facebookVerifyProvider.value();
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
    facebookVerifyProvider = new FacebookOauth2VerifyProvider(
      userRepo,
      userCredentialRepo,
      signupProvider,
      preVerifyProvider,
      postVerifyProvider,
    );
  }
});
