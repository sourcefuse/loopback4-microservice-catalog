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
} from '../../../repositories';
import sinon from 'sinon';
import {LocalPasswordVerifyProvider} from '../../../modules/auth/providers/local-password-verify.provider';
import {
  Otp,
  User,
  UserTenant,
  UserTenantWithRelations,
  UserWithRelations,
} from '../../../models';
import {HttpErrors} from '@loopback/rest';
import {UserStatus} from '@sourceloop/core';

describe('Local Password Verify Provider', () => {
  let userRepo: StubbedInstanceWithSinonAccessor<UserRepository>;
  let userTenantRepo: StubbedInstanceWithSinonAccessor<UserTenantRepository>;
  let otpRepo: StubbedInstanceWithSinonAccessor<OtpRepository>;
  let localPasswordVerifyProvider: LocalPasswordVerifyProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  describe('local password verify provider', () => {
    it('checks if provider returns a function', async () => {
      const result = localPasswordVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('return user if user is present', async () => {
      const user = new User({
        id: '1',
        firstName: 'test',
        lastName: 'test',
        username: 'test_user',
        email: 'xyz@gmail.com',
        authClientIds: '{1}',
        dob: new Date(),
      });
      const username = 'test_user';
      const password = 'test123!@';
      const findOne = userRepo.stubs.verifyPassword;
      findOne.resolves(user as UserWithRelations);
      const func = localPasswordVerifyProvider.value();
      const result = await func(username, password);
      expect(result).to.have.properties(
        'id',
        'firstName',
        'lastName',
        'username',
        'email',
      );
      expect(result?.username).to.be.eql('test_user');
    });

    it('returns user if verify password is not working', async () => {
      const user = new User({
        id: '1',
        firstName: 'test',
        lastName: 'test',
        username: 'test_user',
        email: 'xyz@gmail.com',
        authClientIds: '{1}',
        dob: new Date(),
      });
      const otpCreds = new Otp({
        username: 'test_user',
        otp: 'test123!@',
      });
      const userTenant = new UserTenant({
        id: '1',
        userId: '1',
        tenantId: '1',
        status: UserStatus.ACTIVE,
        roleId: '1',
      });
      const err = new HttpErrors[400]();
      const username = 'test';
      const password = 'test123!@';
      const findOne = userRepo.stubs.verifyPassword;
      findOne.throws(err);
      const findTwo = otpRepo.stubs.get;
      findTwo.resolves(otpCreds);
      const findThree = userRepo.stubs.findOne;
      findThree.resolves(user as UserWithRelations);
      const findFour = userTenantRepo.stubs.findOne;
      findFour.resolves(userTenant as UserTenantWithRelations);
      const func = localPasswordVerifyProvider.value();
      const result = await func(username, password);
      expect(result).to.have.properties(
        'id',
        'firstName',
        'lastName',
        'username',
        'email',
      );
      expect(result?.username).to.be.eql('test_user');
    });
  });

  function setUp() {
    userRepo = createStubInstance(UserRepository);
    userTenantRepo = createStubInstance(UserTenantRepository);
    otpRepo = createStubInstance(OtpRepository);
    localPasswordVerifyProvider = new LocalPasswordVerifyProvider(
      userRepo,
      userTenantRepo,
      otpRepo,
    );
  }
});
