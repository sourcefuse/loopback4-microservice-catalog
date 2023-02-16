import {
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  expect,
} from '@loopback/testlab';
import {UserCredentialsRepository, UserRepository} from '../../../repositories';
import sinon from 'sinon';
import {SamlVerifyProvider} from '../../../modules/auth/providers/saml-verify.provider';
import {SamlSignUpFn} from '../../../providers';
import * as SamlStrategy from '@node-saml/passport-saml';
import {
  User,
  UserCredentials,
  UserCredentialsWithRelations,
  UserWithRelations,
} from '../../../models';
import {IAuthUser} from 'loopback4-authentication';

describe('Saml Verify Provider', () => {
  let userRepo: StubbedInstanceWithSinonAccessor<UserRepository>;
  let userCredentialRepo: StubbedInstanceWithSinonAccessor<UserCredentialsRepository>;
  let samlVerifyProvider: SamlVerifyProvider;

  const signupProvider: SamlSignUpFn = async (prof: SamlStrategy.Profile) =>
    null;
  const preVerifyProvider = async (
    prof: SamlStrategy.Profile,
    usr: IAuthUser | null,
  ) => usr;
  const postVerifyProvider = async (
    prof: SamlStrategy.Profile,
    usr: IAuthUser | null,
  ) => usr;

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

  describe('saml verify provider', () => {
    it('checks if provider returns a function', async () => {
      const result = samlVerifyProvider.value();
      expect(result).to.be.Function();
    });

    it('return error promise for no user', async () => {
      const func = samlVerifyProvider.value();
      const result = await func(profile).catch(err => err.message);
      expect(result).to.be.eql('Invalid Credentials');
    });

    it('return error promise if there is no user cred', async () => {
      const findOne = userRepo.stubs.findOne;
      findOne.resolves(user as UserWithRelations);
      const func = samlVerifyProvider.value();
      const result = await func(profile).catch(err => err.message);
      expect(result).to.be.eql('Invalid Credentials');
      sinon.assert.calledOnce(findOne);
    });

    it('return user after post verification', async () => {
      const userCred = new UserCredentials({
        id: '1',
        userId: '1',
        authProvider: 'saml',
        authId: '1',
      });
      const findOne = userRepo.stubs.findOne;
      findOne.resolves(user as UserWithRelations);
      const findTwo = userCredentialRepo.stubs.findOne;
      findTwo.resolves(userCred as UserCredentialsWithRelations);
      const func = samlVerifyProvider.value();
      const result = await func(profile);
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
    samlVerifyProvider = new SamlVerifyProvider(
      userRepo,
      userCredentialRepo,
      signupProvider,
      preVerifyProvider,
      postVerifyProvider,
    );
  }
});
