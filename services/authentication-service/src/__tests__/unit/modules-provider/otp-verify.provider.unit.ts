// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  expect,
} from '@loopback/testlab';
import {UserRepository, OtpCacheRepository} from '../../../repositories';
import sinon from 'sinon';
import {OtpVerifyProvider} from '../../../modules/auth/providers/otp-verify.provider';
import {AuthClient, OtpCache, User, UserWithRelations} from '../../../models';
import {OtpService} from '../../../services';
import {OtpResponse} from '../../../modules/auth';
import {HttpErrors} from '@loopback/rest';
import {AuthErrorKeys} from 'loopback4-authentication';

describe('OTP Verify Provider', () => {
  let userRepo: StubbedInstanceWithSinonAccessor<UserRepository>;
  let otpRepo: StubbedInstanceWithSinonAccessor<OtpCacheRepository>;
  let otpVerifyProvider: OtpVerifyProvider;
  let otpService: OtpService;
  const client = new AuthClient({
    id: 1,
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    secret: 'dummy',
    accessTokenExpiration: 1800,
    refreshTokenExpiration: 1800,
    authCodeExpiration: 1800,
  });
  const logger = {
    log,
    info,
    warn,
    error,
    debug,
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

  describe('otp verify provider', () => {
    it('checks if provider returns a function', async () => {
      const result = otpVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider throws error if OTP is incorrect', async () => {
      const username = 'test_user';
      const otp = '000000';
      const findOne = userRepo.stubs.findOne;
      findOne.resolves(user as UserWithRelations);

      const otpCache = {
        otpSecret: 'i6im0gc96j0mn00c',
      };
      const otpCacheGet = otpRepo.stubs.get;
      otpCacheGet.resolves(otpCache as OtpCache);

      const func = otpVerifyProvider.value();
      try {
        await func(username, otp);
      } catch (err) {
        expect(err).to.be.instanceOf(HttpErrors.HttpError);
        expect(err.message).to.be.equal(AuthErrorKeys.OtpInvalid);
      }
    });

    it('checks if provider throws error if OTP secret is not found in cache', async () => {
      const username = 'test_user';
      const otp = '000000';
      const findOne = userRepo.stubs.findOne;
      findOne.resolves(user as UserWithRelations);

      const otpCacheGet = otpRepo.stubs.get;
      otpCacheGet.resolves(undefined);

      const func = otpVerifyProvider.value();
      try {
        await func(username, otp);
      } catch (err) {
        expect(err).to.be.instanceOf(HttpErrors.HttpError);
        expect(err.message).to.be.equal(AuthErrorKeys.OtpExpired);
      }
    });

    it('checks if provider throws error if username is incorrect', async () => {
      const username = 'test_user';
      const otp = '000000';
      const findOne = userRepo.stubs.findOne;
      findOne.resolves(null);

      const func = otpVerifyProvider.value();
      try {
        await func(username, otp);
      } catch (err) {
        expect(err).to.be.instanceOf(HttpErrors.HttpError);
        expect(err.message).to.be.equal(AuthErrorKeys.InvalidCredentials);
      }
    });
  });

  function log() {
    // This is intentional
  }

  function info() {
    // This is intentional
  }

  function warn() {
    // This is intentional
  }

  function error() {
    // This is intentional
  }

  function debug() {
    // This is intentional
  }

  function otpSenderFn(): Promise<OtpResponse> {
    return {} as Promise<OtpResponse>;
  }

  function setUp() {
    userRepo = createStubInstance(UserRepository);
    otpRepo = createStubInstance(OtpCacheRepository);
    otpService = new OtpService(otpRepo, userRepo, logger, otpSenderFn);
    otpVerifyProvider = new OtpVerifyProvider(
      userRepo,
      otpRepo,
      logger,
      client,
      otpService,
    );
  }
});
