import {
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  expect,
} from '@loopback/testlab';
import {
  UserRepository,
  UserCredentialsRepository,
  OtpCacheRepository,
} from '../../../repositories';
import sinon from 'sinon';
import {GoogleAuthenticatorVerifyProvider} from '../../../modules/auth/providers/google-authenticator-verify.provider';
import {
  User,
  UserCredentialsWithRelations,
  UserWithRelations,
} from '../../../models';

describe('Google Authenticator Verify Provider', () => {
  let userRepo: StubbedInstanceWithSinonAccessor<UserRepository>;
  let userCredsRepo: StubbedInstanceWithSinonAccessor<UserCredentialsRepository>;
  let otpRepo: StubbedInstanceWithSinonAccessor<OtpCacheRepository>;
  let googleAuthenticatorVerifyProvider: GoogleAuthenticatorVerifyProvider;
  const logger = {
    log,
    info,
    warn,
    error,
    debug,
  };

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  describe('google authenticator verify provider', () => {
    it('checks if provider returns a function', async () => {
      const result = googleAuthenticatorVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider throws error if OTP is incorrect', async () => {
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
      const otp = '000000';
      const findOne = userRepo.stubs.findOne;
      findOne.resolves(user as UserWithRelations);

      const userCreds = {
        secretKey: 'i6im0gc96j0mn00c',
      };
      const credsFindOne = userCredsRepo.stubs.findOne;
      credsFindOne.resolves(userCreds as UserCredentialsWithRelations);

      const func = googleAuthenticatorVerifyProvider.value();
      const result = await func(username, otp).catch(err => err.message);
      expect(result).to.be.eql('Otp Token Incorrect or Expired');
    });

    it('checks if provider throws error if username is incorrect', async () => {
      const username = 'test_user';
      const otp = '000000';
      const findOne = userRepo.stubs.findOne;
      findOne.resolves(null);

      const func = googleAuthenticatorVerifyProvider.value();
      const result = await func(username, otp).catch(err => err.message);
      expect(result).to.be.eql('Invalid Credentials');
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

  function setUp() {
    userRepo = createStubInstance(UserRepository);
    userCredsRepo = createStubInstance(UserCredentialsRepository);
    otpRepo = createStubInstance(OtpCacheRepository);
    googleAuthenticatorVerifyProvider = new GoogleAuthenticatorVerifyProvider(
      userRepo,
      userCredsRepo,
      otpRepo,
      logger,
    );
  }
});
