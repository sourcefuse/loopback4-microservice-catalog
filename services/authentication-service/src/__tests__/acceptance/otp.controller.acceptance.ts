// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';
import {Client, expect} from '@loopback/testlab';
import {RoleTypes} from '@sourceloop/core';
import {AuthErrorKeys} from 'loopback4-authentication';
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
  it('should give status 401 for get qrCode request without client_id', async () => {
    const response = await client
      .get(`/auth/check-qr-code`)
      .set('code', 'test_code')
      .expect(401);
    expect(response).to.have.property('error');
    expect(response.body.error.message).to.be.equal(
      AuthErrorKeys.ClientInvalid,
    );
  });
  it('should give status 401 for get qrCode request without code', async () => {
    const response = await client
      .get(`/auth/check-qr-code`)
      .set('clientId', 'web')
      .expect(401);
    expect(response).to.have.property('error');
    expect(response.body.error.message).to.be.equal(AuthErrorKeys.TokenInvalid);
  });
  it('should give status 401 for get qrCode request with wrong client_id', async () => {
    const response = await client
      .get(`/auth/check-qr-code`)
      .set('code', 'test_code')
      .set('clientId', 'wrong_id')
      .expect(401);
    expect(response).to.have.property('error');
    expect(response.body.error.message).to.be.equal(
      AuthErrorKeys.ClientInvalid,
    );
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

  it('should give status 401 for post qrCode request with wrong clientId', async () => {
    const response = await client
      .post(`/auth/create-qr-code`)
      .send({
        clientId: 'wrong client id',
        code: 'test_code',
      })
      .expect(401);
    expect(response).to.have.property('error');
    expect(response.body.error.message).to.be.equal(
      AuthErrorKeys.ClientInvalid,
    );
  });
  it('should give status 401 for post qrCode request with incorrect code', async () => {
    const response = await client
      .post(`/auth/create-qr-code`)
      .send({
        clientId: 'web',
        code: 'incorrect_code',
      })
      .expect(401);
    expect(response).to.have.property('error');
    expect(response.body.error.message).to.be.equal(
      AuthErrorKeys.InvalidCredentials,
    );
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

  it('should give status 204 for send-otp request with incorrect code', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      key: 'test_user',
    };
    await client.post(`/auth/send-otp`).send(reqData).expect(204);
  });

  it('should give status 401 when otp is incorrect', async () => {
    const reqData = {
      key: 'test_user',
      otp: '000000',
    };
    const response = await client
      .post(`/auth/verify-otp`)
      .send(reqData)
      .expect(401);
    expect(response).to.have.property('error');
    expect(response.body.error.message.message).to.be.equal(
      AuthErrorKeys.OtpInvalid,
    );
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
