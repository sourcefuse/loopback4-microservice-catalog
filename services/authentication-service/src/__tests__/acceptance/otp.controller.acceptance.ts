'use strict';
import {Client, expect} from '@loopback/testlab';
import {RoleTypes} from '@sourceloop/core';
import {
  AuthClientRepository,
  RoleRepository,
  UserCredentialsRepository,
  UserLevelPermissionRepository,
  UserRepository,
  UserTenantRepository,
} from '../../repositories';
import {TestingApplication} from '../fixtures/application';
import {setupApplication} from './test-helper';

describe('OTP Controller', () => {
  let app: TestingApplication;
  let client: Client;
  let userRepo: UserRepository;
  let userTenantRepo: UserTenantRepository;
  let authClientRepository: AuthClientRepository;
  let userPermissionRepository: UserLevelPermissionRepository;
  let userCredentialsRepository: UserCredentialsRepository;
  let roleRepository: RoleRepository;
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });
  after(async () => app.stop());
  before(givenUserRepository);
  before(givenUserTenantRepository);
  before(givenAuthClientRepository);
  before(givenUserPermissionRepository);
  before(givenRoleRepository);
  before(givenUserCredentialsRepository);
  before(setMockData);
  after(deleteMockData);
  afterEach(() => {
    delete process.env.JWT_ISSUER;
    delete process.env.JWT_SECRET;
  });
  it('should have property isGenerated', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
      password: 'temp123!@',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    const reqForCode = await client
      .post(`/auth/login`)
      .send(reqData)
      .expect(200);
    const response = await client
      .get(`/auth/check-qr-code`)
      .set('code', reqForCode.body.code)
      .set('clientId', 'web');
    expect(response.body).to.have.property('isGenerated');
  });

  it('should have property qrCode', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
      password: 'temp123!@',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    const reqForCode = await client
      .post(`/auth/login`)
      .send(reqData)
      .expect(200);
    const response = await client.post(`/auth/create-qr-code`).send({
      clientId: 'web',
      code: reqForCode.body.code,
    });
    expect(response.body).to.have.property('qrCode');
  });

  async function givenUserRepository() {
    userRepo = await app.getRepository(UserRepository);
  }
  async function givenUserTenantRepository() {
    userTenantRepo = await app.getRepository(UserTenantRepository);
  }
  async function givenRoleRepository() {
    roleRepository = await app.getRepository(RoleRepository);
  }
  async function givenAuthClientRepository() {
    authClientRepository = await app.getRepository(AuthClientRepository);
  }
  async function givenUserPermissionRepository() {
    userPermissionRepository = await app.getRepository(
      UserLevelPermissionRepository,
    );
  }
  async function givenUserCredentialsRepository() {
    userCredentialsRepository = await app.getRepository(
      UserCredentialsRepository,
    );
  }
  async function deleteMockData() {
    await userCredentialsRepository.deleteAllHard();
    await userPermissionRepository.deleteAllHard();
    await userRepo.deleteAllHard();
    await authClientRepository.deleteAllHard();
    await roleRepository.deleteAllHard();
  }
  async function setMockData() {
    await roleRepository.createAll([
      {
        id: '1',
        name: 'admin',
        roleType: RoleTypes.Admin,
        permissions: [],
      },
      {
        id: '2',
        name: 'others',
        roleType: RoleTypes.Others,
        permissions: [],
      },
    ]);
    process.env.USER_TEMP_PASSWORD = 'temp123!@';
    await userRepo.create({
      id: '1',
      firstName: 'Test',
      lastName: 'User',
      username: 'test_user',
      dob: '1996-11-05',
      authClientIds: `{1}`,
      email: 'xyz@gmail.com',
    });
    await userRepo.createAll([
      {
        id: '2',
        firstName: 'Test',
        lastName: 'Teacher',
        username: 'test_teacher',
        dob: '1996-11-05',
        email: 'test_teacher@test.com',
        authClientIds: `{1}`,
      },
    ]);
    await userTenantRepo.createAll([
      {
        userId: '1',
        tenantId: '200',
        roleId: '2',
      },
      {
        userId: '2',
        tenantId: '200',
        roleId: '2',
      },
    ]);
    await authClientRepository.create({
      id: 1,
      clientId: 'web',
      clientSecret: 'test',
      redirectUrl: 'http://localhost:4200/login/success',
      accessTokenExpiration: 900,
      refreshTokenExpiration: 86400,
      authCodeExpiration: 180,
      secret: 'poiuytrewq',
    });
    await authClientRepository.create({
      id: 2,
      clientId: 'mobile',
      clientSecret: 'test',
      redirectUrl: 'http://localhost:4200/login/success',
      accessTokenExpiration: 900,
      refreshTokenExpiration: 86400,
      authCodeExpiration: 180,
      secret: 'poiuytrewq',
    });

    await userCredentialsRepository.create({
      id: '2',
      userId: '2',
      authProvider: 'keycloak',
      secretKey: 'qwerty',
    });
  }
});
