import {AnyObject} from '@loopback/repository';
import {Client, expect} from '@loopback/testlab';
import {STATUS_CODE} from '@sourceloop/core';
import {createHmac} from 'crypto';
import {AuthenticationBindings} from 'loopback4-authentication';
import path from 'path';
import {UserTenantServiceApplication} from '../../application';
import {
  AuthClientRepository,
  RoleRepository,
  UserCredentialsRepository,
  UserRepository,
  UserTenantRepository,
} from '../../repositories';
import {setupApplication} from './test-helper';

describe('UserCallbackController', () => {
  let app: UserTenantServiceApplication;
  let client: Client;
  let userRepo: UserRepository;
  let userTenantRepo: UserTenantRepository;
  let authClientRepo: AuthClientRepository;
  let userCredentialsRepository: UserCredentialsRepository;
  let roleRepository: RoleRepository;
  const basePath = '/user-callback';
  const timestampKey = 'x-timestamp';
  const signatureKey = 'x-signature';
  const testUser = {
    id: 'test',
    username: 'test',
    userTenantId: 'test',
    tenantType: 'master',
  };
  const mockPayload = {
    email: 'test@test.com',
    phone: '4123123123',
    tenantName: 'Test Tenant',
    tenantKey: 'testtenant',
    firstName: 'Test',
    lastName: 'User',
    middleName: 'NA',
    cognitoAuthId: '1234',
    authClient: {
      clientId: 'webapp-test',
      clientSecret: 'secret-test-tenant',
      redirectUrl: '/test/url',
      secret: 'asddda',
      accessTokenExpiration: 0,
      refreshTokenExpiration: 0,
      authCodeExpiration: 0,
    },
    address: {
      address: 'India',
      country: 'India',
    },
  };

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    userRepo = await app.getRepository(UserRepository);
    userTenantRepo = await app.getRepository(UserTenantRepository);
    authClientRepo = await app.getRepository(AuthClientRepository);
    roleRepository = await app.getRepository(RoleRepository);
    userCredentialsRepository = await app.getRepository(
      UserCredentialsRepository,
    );
  });

  before(setCurrentUser);

  after(async () => {
    await app.stop();
  });

  beforeEach(async () => {
    await userRepo.deleteAllHard();
    await userTenantRepo.deleteAllHard();
    await authClientRepo.deleteAll();
    await roleRepository.deleteAllHard();
  });

  it('should throw STATUS_CODE if invoked without token and timestamp', async () => {
    await client
      .post(basePath)
      .send(mockPayload)
      .expect(STATUS_CODE.UNAUTHORISED);
  });

  it('should throw STATUS_CODE if invoked without token', async () => {
    await client
      .post(basePath)
      .set(timestampKey, String(Date.now()))
      .send(mockPayload)
      .expect(STATUS_CODE.UNAUTHORISED);
  });

  it('should throw STATUS_CODE if invoked with invalid token', async () => {
    const {signature, timestamp} = setupSignatureAndTimestamp({});
    await client
      .post(basePath)
      .set(signatureKey, signature)
      .set(timestampKey, timestamp)
      .send(mockPayload)
      .expect(STATUS_CODE.UNAUTHORISED);
  });

  it('should create a tenant, auth client, role and user with userTenant if invoked with valid token', async () => {
    const {signature, timestamp} = setupSignatureAndTimestamp();
    await client
      .post(basePath)
      .set(signatureKey, signature)
      .set(timestampKey, timestamp)
      .send(mockPayload)
      .expect(STATUS_CODE.NO_CONTENT);

    const user = await userRepo.findOne({
      where: {
        email: mockPayload.email,
      },
    });

    const userCredential = await userCredentialsRepository.findOne({
      where: {
        userId: user?.id,
      },
    });

    const userTenant = await userTenantRepo.findOne({
      where: {
        userId: user?.id,
      },
    });
    const authClient = await authClientRepo.findOne({
      where: {
        clientId: mockPayload.authClient?.clientId,
      },
    });
    const role = await roleRepository.findOne({
      where: {
        name: process.env.FIRST_USER_ROLE,
      },
    });
    expect(user).to.not.be.null();
    expect(userTenant).to.not.be.null();
    expect(authClient).to.not.be.null();
    expect(role).to.not.be.null();
    expect(userCredential).to.not.be.null();
  });

  function setupSignatureAndTimestamp(payload: AnyObject = mockPayload) {
    const timestamp = String(Date.now());
    // sonarignore:start
    const signature = createHmac('sha256', process.env.USER_CALLBACK_SECRET!)
      .update(`${JSON.stringify(payload)}${timestamp}`)
      .digest('hex');
    return {
      timestamp,
      signature,
    };
    // sonarignore:end
  }

  function setCurrentUser() {
    app.bind(AuthenticationBindings.CURRENT_USER).to(testUser);
    process.env.JWT_PRIVATE_KEY = path.resolve(
      __dirname,
      '../../../src/__tests__/unit/utils/privateKey.txt',
    );
  }
});
