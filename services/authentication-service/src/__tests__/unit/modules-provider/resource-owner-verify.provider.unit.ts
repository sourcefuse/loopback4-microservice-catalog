// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {HttpErrors} from '@loopback/rest';
import {
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  expect,
} from '@loopback/testlab';
import {UserStatus} from '@sourceloop/core';
import sinon from 'sinon';
import {
  AuthClient,
  Otp,
  UserTenant,
  UserTenantWithRelations,
} from '../../../models';
import {UserView} from '../../../models/user-view.model';
import {ResourceOwnerVerifyProvider} from '../../../modules/auth/providers/resource-owner-verify.provider';
import {
  AuthClientRepository,
  OtpRepository,
  UserTenantRepository,
} from '../../../repositories';
import {UserViewRepository} from '../../../repositories/user-view.repository';
import {UserViewService} from '../../../services';

describe('Resource Owner Verify Provider', () => {
  let userTenantRepo: StubbedInstanceWithSinonAccessor<UserTenantRepository>;
  let otpRepo: StubbedInstanceWithSinonAccessor<OtpRepository>;
  let authClientRepo: StubbedInstanceWithSinonAccessor<AuthClientRepository>;
  let userViewRepo: StubbedInstanceWithSinonAccessor<UserViewRepository>;
  let userViewService: StubbedInstanceWithSinonAccessor<UserViewService>;
  let resourceOwnerVerifyProvider: ResourceOwnerVerifyProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  describe('resource owner verify provider', () => {
    it('checks if provider returns a function', async () => {
      const result = resourceOwnerVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('return user and client if both are present', async () => {
      const user = new UserView({
        id: '1',
        firstName: 'test',
        lastName: 'test',
        username: 'testuser',
        email: 'xyz@gmail.com',
        authClientIds: '{1}',
        defaultTenantId: '1',
        dob: new Date(),
        tenantId: '1',
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
      const findOne = userViewService.stubs.verifyPassword;
      findOne.resolves(user);
      const findThree = userTenantRepo.stubs.findOne;
      findThree.resolves(userTenant as UserTenantWithRelations);
      const findFour = authClientRepo.stubs.findOne;
      findFour.resolves(authClient);
      const func = resourceOwnerVerifyProvider.value();
      const result = await func(clientId, clientSecret, username, password);
      expect(result).to.have.properties('client', 'user');
    });

    it('return user and client if verification for password is not done', async () => {
      const user = new UserView({
        id: '1',
        firstName: 'test',
        lastName: 'test',
        username: 'testuser',
        email: 'xyz@gmail.com',
        authClientIds: '{1}',
        defaultTenantId: '1',
        dob: new Date(),
        tenantId: '1',
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
      const findFive = userViewService.stubs.verifyPassword;
      findFive.throws(err);
      const findOne = userViewRepo.stubs.findOne;
      findOne.resolves(user);
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
    userTenantRepo = createStubInstance(UserTenantRepository);
    otpRepo = createStubInstance(OtpRepository);
    authClientRepo = createStubInstance(AuthClientRepository);
    userViewRepo = createStubInstance(UserViewRepository);
    userViewService = createStubInstance(UserViewService);
    resourceOwnerVerifyProvider = new ResourceOwnerVerifyProvider(
      userViewRepo,
      userViewService,
      userTenantRepo,
      authClientRepo,
      otpRepo,
    );
  }
});
