// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  expect,
} from '@loopback/testlab';
import {
  UserTenantRepository,
  UserRepository,
  OtpRepository,
  AuthClientRepository,
} from '../../../repositories';
import sinon from 'sinon';
import {ResourceOwnerVerifyProvider} from '../../../modules/auth/providers/resource-owner-verify.provider';
import {
  AuthClient,
  Otp,
  User,
  UserTenant,
  UserTenantWithRelations,
  UserWithRelations,
} from '../../../models';
import {UserStatus} from '@sourceloop/core';
import {HttpErrors} from '@loopback/rest';

describe('Resource Owner Verify Provider', () => {
  let userRepo: StubbedInstanceWithSinonAccessor<UserRepository>;
  let userTenantRepo: StubbedInstanceWithSinonAccessor<UserTenantRepository>;
  let otpRepo: StubbedInstanceWithSinonAccessor<OtpRepository>;
  let authClientRepo: StubbedInstanceWithSinonAccessor<AuthClientRepository>;
  let resourceOwnerVerifyProvider: ResourceOwnerVerifyProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  describe('resource owner verify provider', () => {
    it('checks if provider returns a function', async () => {
      const result = resourceOwnerVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('return user and client if both are present', async () => {
      const user = new User({
        id: '1',
        firstName: 'test',
        lastName: 'test',
        username: 'testuser',
        email: 'xyz@gmail.com',
        authClientIds: '{1}',
        defaultTenantId: '1',
        dob: new Date(),
      });
      const userTenant = new UserTenant({
        id: '1',
        userId: '1',
        tenantId: '1',
        status: UserStatus.ACTIVE,
        roleId: '1',
      });
      const authClient = new AuthClient({
        id: 1,
        clientId: 'web',
        clientSecret: 'test',
        secret: 'test',
        accessTokenExpiration: 1800,
        refreshTokenExpiration: 1800,
        authCodeExpiration: 1800,
      });
      const username = 'testuser';
      const password = 'test123!@';
      const clientId = 'web';
      const clientSecret = 'test';
      const findOne = userRepo.stubs.verifyPassword;
      findOne.resolves(user as UserWithRelations);
      const findThree = userTenantRepo.stubs.findOne;
      findThree.resolves(userTenant as UserTenantWithRelations);
      const findFour = authClientRepo.stubs.findOne;
      findFour.resolves(authClient);
      const func = resourceOwnerVerifyProvider.value();
      const result = await func(clientId, clientSecret, username, password);
      expect(result).to.have.properties('client', 'user');
    });

    it('return user and client if verification for password is not done', async () => {
      const user = new User({
        id: '1',
        firstName: 'test',
        lastName: 'test',
        username: 'testuser',
        email: 'xyz@gmail.com',
        authClientIds: '{1}',
        defaultTenantId: '1',
        dob: new Date(),
      });
      const userTenant = new UserTenant({
        id: '1',
        userId: '1',
        tenantId: '1',
        status: UserStatus.ACTIVE,
        roleId: '1',
      });
      const authClient = new AuthClient({
        id: 1,
        clientId: 'web',
        clientSecret: 'test',
        secret: 'test',
        accessTokenExpiration: 1800,
        refreshTokenExpiration: 1800,
        authCodeExpiration: 1800,
      });
      const otpCreds = new Otp({
        username: 'test_user',
        otp: 'test123!@',
      });
      const err = new HttpErrors[400]();
      const username = 'testuser';
      const password = 'test123!@';
      const clientId = 'web';
      const clientSecret = 'test';
      const findFive = userRepo.stubs.verifyPassword;
      findFive.throws(err);
      const findOne = userRepo.stubs.findOne;
      findOne.resolves(user as UserWithRelations);
      const findTwo = otpRepo.stubs.get;
      findTwo.resolves(otpCreds);
      const findThree = userTenantRepo.stubs.findOne;
      findThree.resolves(userTenant as UserTenantWithRelations);
      const findFour = authClientRepo.stubs.findOne;
      findFour.resolves(authClient);
      const func = resourceOwnerVerifyProvider.value();
      const result = await func(clientId, clientSecret, username, password);
      expect(result).to.have.properties('client', 'user');
    });
  });

  function setUp() {
    userRepo = createStubInstance(UserRepository);
    userTenantRepo = createStubInstance(UserTenantRepository);
    otpRepo = createStubInstance(OtpRepository);
    authClientRepo = createStubInstance(AuthClientRepository);
    resourceOwnerVerifyProvider = new ResourceOwnerVerifyProvider(
      userRepo,
      userTenantRepo,
      authClientRepo,
      otpRepo,
    );
  }
});
