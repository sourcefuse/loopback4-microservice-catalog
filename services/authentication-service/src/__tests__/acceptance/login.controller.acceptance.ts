// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';
import {Client, createRestAppClient, expect} from '@loopback/testlab';
import {AuthenticateErrorKeys, AuthProvider, RoleTypes} from '@sourceloop/core';
import {AuthErrorKeys} from 'loopback4-authentication';
import {
  AuthClientRepository,
  RefreshTokenRepository,
  RoleRepository,
  UserCredentialsRepository,
  UserLevelPermissionRepository,
  UserRepository,
  UserTenantRepository,
} from '../../repositories';
import {TestingApplication} from '../fixtures/application';
import {TestHelperKey} from '../fixtures/keys';
import {TestHelperService} from '../fixtures/services';
import {setupApplication} from './test-helper';

describe('Authentication microservice', () => {
  let app: TestingApplication;
  let client: Client;
  let helper: TestHelperService;
  let userRepo: UserRepository;
  let userTenantRepo: UserTenantRepository;
  let authClientRepository: AuthClientRepository;
  let userPermissionRepository: UserLevelPermissionRepository;
  let refreshTokenRepository: RefreshTokenRepository;
  let userCredentialsRepository: UserCredentialsRepository;
  let roleRepository: RoleRepository;
  const useragent = 'test';
  const deviceId = 'test';
  const useragentName = 'user-agent';
  const deviceIdName = 'device_id';
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });
  after(async () => app.stop());
  before(givenUserRepository);
  before(givenUserTenantRepository);
  before(givenAuthClientRepository);
  before(givenUserPermissionRepository);
  before(givenRefreshTokenRepository);
  before(givenRoleRepository);
  before(givenUserCredentialsRepository);
  before(async () => {
    client = createRestAppClient(app);
    helper = await app.get(TestHelperKey);
  });
  before(setMockData);
  after(deleteMockData);
  afterEach(() => {
    delete process.env.JWT_ISSUER;
    delete process.env.JWT_SECRET;
    helper.reset();
  });
  it('should give status 422 for login request with no client credentials', async () => {
    const reqData = {};
    const response = await client.post(`/auth/login`).send(reqData).expect(422);
    expect(response).to.have.property('error');
  });
  it('should give status 422 for login request with no user credentials', async () => {
    const reqData = {
      clientId: 'web',
      clientSecret: 'blah',
    };
    const response = await client.post(`/auth/login`).send(reqData).expect(422);
    expect(response).to.have.property('error');
  });
  it('should give status 401 for login request with wrong client credentials', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web1', // eslint-disable-next-line
      client_secret: 'blah1',
      username: 'someuser',
      password: 'somepassword',
    };
    const response = await client.post(`/auth/login`).send(reqData).expect(401);
    expect(response).to.have.property('error');
  });
  it('should give status 401 for login request with wrong user credentials', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'someuser',
      password: 'somepassword',
    };
    const response = await client.post(`/auth/login`).send(reqData).expect(401);
    expect(response).to.have.property('error');
  });
  it('should give status 401 for login request with user credentials not belonging to client', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'mobile', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
      password: 'temp123!@',
    };
    const response = await client.post(`/auth/login`).send(reqData).expect(401);
    expect(response).to.have.property('error');
    expect(response.body.error.message).to.be.equal(
      AuthErrorKeys.ClientInvalid,
    );
  });
  it('should give status 200 for login request', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
      password: 'temp123!@',
    };
    process.env.JWT_ISSUER = 'test';
    await client.post(`/auth/login`).send(reqData).expect(200);
  });

  it('should return code in response', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
      password: 'temp123!@',
    };
    process.env.JWT_ISSUER = 'test';
    const reqForCode = await client
      .post(`/auth/login`)
      .send(reqData)
      .expect(200);
    expect(reqForCode.body).to.have.property('code');
  });

  it('should return refresh token, access token, expires in response', async () => {
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
      .post(`/auth/token`)
      .set(deviceIdName, deviceId)
      .set(useragentName, useragent)
      .send({
        clientId: 'web',
        code: reqForCode.body.code,
      });
    expect(response.body).to.have.properties([
      'accessToken',
      'refreshToken',
      'expires',
    ]);
  });

  it('should return refresh token and access token for token refresh request', async () => {
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
    const reqForToken = await client
      .post(`/auth/token`)
      .set(deviceIdName, deviceId)
      .set(useragentName, useragent)
      .send({
        clientId: 'web',
        code: reqForCode.body.code,
      });
    const response = await client
      .post(`/auth/token-refresh`)
      .send({refreshToken: reqForToken.body.refreshToken})
      .set('Authorization', `Bearer ${reqForToken.body.accessToken}`);
    expect(response.body).to.have.properties(['accessToken', 'refreshToken']);
  });

  it('should throw error when login for external user', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_teacher',
      password: 'temp123!@',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    const reqForCode = await client
      .post(`/auth/login`)
      .send(reqData)
      .expect(401);

    expect(reqForCode.body.error.message.message).to.equal(
      AuthErrorKeys.InvalidCredentials,
    );
  });

  it('should change password successfully for internal user', async () => {
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
    const reqForToken = await client.post(`/auth/token`).send({
      clientId: 'web',
      code: reqForCode.body.code,
    });
    await client
      .patch(`/auth/change-password`)
      .set('Authorization', `Bearer ${reqForToken.body.accessToken}`)
      .send({
        username: 'test_user',
        password: 'new_test_password',
        refreshToken: reqForToken.body.refreshToken,
      })
      .expect(200);
  });

  it('should return refresh token and access token for token refresh request with new password', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
      password: 'new_test_password',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    const reqForCode = await client
      .post(`/auth/login`)
      .send(reqData)
      .expect(200);
    const reqForToken = await client
      .post(`/auth/token`)
      .set(deviceIdName, deviceId)
      .set(useragentName, useragent)
      .send({
        clientId: 'web',
        code: reqForCode.body.code,
      });
    const response = await client
      .post(`/auth/token-refresh`)
      .send({refreshToken: reqForToken.body.refreshToken})
      .set('Authorization', `Bearer ${reqForToken.body.accessToken}`);
    expect(response.body).to.have.properties(['accessToken', 'refreshToken']);
  });

  it('should revert to previous password successfully for internal user', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
      password: 'new_test_password',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    const reqForCode = await client
      .post(`/auth/login`)
      .send(reqData)
      .expect(200);
    const reqForToken = await client.post(`/auth/token`).send({
      clientId: 'web',
      code: reqForCode.body.code,
    });
    await client
      .patch(`/auth/change-password`)
      .set('Authorization', `Bearer ${reqForToken.body.accessToken}`)
      .send({
        username: 'test_user',
        password: 'temp123!@',
        refreshToken: reqForToken.body.refreshToken,
      })
      .expect(200);
  });

  it('should return 401 for token refresh request when Authentication token invalid', async () => {
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
    const reqForToken = await client
      .post(`/auth/token`)
      .set(deviceIdName, deviceId)
      .set(useragentName, useragent)
      .send({
        clientId: 'web',
        code: reqForCode.body.code,
      });
    await client
      .post(`/auth/token-refresh`)
      .send({refreshToken: reqForToken.body.refreshToken})
      .set('Authorization', 'Bearer abc')
      .expect(401);
  });
  it('should return 401 for token refresh request when Authentication token missing', async () => {
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
    const reqForToken = await client
      .post(`/auth/token`)
      .set(deviceIdName, deviceId)
      .set(useragentName, useragent)
      .send({
        clientId: 'web',
        code: reqForCode.body.code,
      });
    await client
      .post(`/auth/token-refresh`)
      .send({refreshToken: reqForToken.body.refreshToken})
      .expect(401);
  });
  it('should throw error if user does not belong to client id in forgot password request', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web1', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    const response = await client
      .post(`/auth/forget-password`)
      .send(reqData)
      .expect(401);
    expect(response.body.error.message.message).to.be.equal(
      AuthErrorKeys.ClientInvalid,
    );
  });

  it('should send forgot password request successfully', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    await client.post(`/auth/forget-password`).send(reqData).expect(204);
    const token = helper.get('TOKEN');
    expect(token).to.be.String();
    expect(token).to.not.be.equal('');
  });

  it('should throw error on forgot password request for external user', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_teacher',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    const response = await client
      .post(`/auth/forget-password`)
      .send(reqData)
      .expect(400);
    expect(response.body.error.message).to.be.equal(
      AuthenticateErrorKeys.PasswordCannotBeChanged,
    );
  });

  it('should return empty response even if the user does not exist', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'testuser',
    };
    const response = await client
      .post(`/auth/forget-password`)
      .send(reqData)
      .expect(204);
    expect(response.body).to.be.empty();
  });
  it('should verify reset password token successfully', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    await client.post(`/auth/forget-password`).send(reqData).expect(204);
    const token = helper.get('TOKEN');
    expect(token).to.be.String();
    expect(token).to.not.be.equal('');
    await client
      .get(`/auth/verify-reset-password-link?token=${token}`)
      .send()
      .expect(200);
  });
  it('should give token missing error when no token passed in verify reset password', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    await client.post(`/auth/forget-password`).send(reqData).expect(204);
    const responseToken = await client
      .get(`/auth/verify-reset-password-link`)
      .send()
      .expect(400);
    expect(responseToken.body).to.have.properties('error');
  });
  it('should return error for token missing when no token passed in reset password', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    await client.post(`/auth/forget-password`).send(reqData).expect(204);
    const request = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      password: 'test123',
    };
    await client.patch(`/auth/reset-password`).send(request).expect(422);
  });
  it('should return error for password missing when new password not sent in reset password', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    await client.post(`/auth/forget-password`).send(reqData).expect(204);
    const token = helper.get('TOKEN');
    const request = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      token,
    };
    await client.patch(`/auth/reset-password`).send(request).expect(422);
  });
  it('should throw error when reset password to previous password', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    await client.post(`/auth/forget-password`).send(reqData).expect(204);
    const token = helper.get('TOKEN');
    const request = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      token,
      password: 'temp123!@',
    };
    await client.patch(`/auth/reset-password`).send(request).expect(401);
  });

  it('should reset password successfully', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    await client.post(`/auth/forget-password`).send(reqData).expect(204);
    const token = helper.get('TOKEN');
    const request = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      token,
      password: 'test123#@',
    };
    await client.patch(`/auth/reset-password`).send(request).expect(204);
  });

  it('should return true on logout', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
      password: 'test123#@',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    const reqForCode = await client
      .post(`/auth/login`)
      .send(reqData)
      .expect(200);
    const reqForToken = await client
      .post(`/auth/token`)
      .set(deviceIdName, deviceId)
      .set(useragentName, useragent)
      .send({
        clientId: 'web',
        code: reqForCode.body.code,
      })
      .expect(200);
    await client
      .post(`/logout`)
      .set('Authorization', `Bearer ${reqForToken.body.accessToken}`)
      .send({
        refreshToken: reqForToken.body.refreshToken,
      })
      .expect(200);
  });
  it('should return error for wrong token on logout', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
      password: 'test123#@',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    const reqForCode = await client
      .post(`/auth/login`)
      .send(reqData)
      .expect(200);
    const reqForToken = await client
      .post(`/auth/token`)
      .set(deviceIdName, deviceId)
      .set(useragentName, useragent)
      .send({
        clientId: 'web',
        code: reqForCode.body.code,
      })
      .expect(200);
    await client
      .post(`/logout`)
      .set('Authorization', `Bearer ${reqForToken.body.accessToken}`)
      .send({
        refreshToken: 'aaaa',
      })
      .expect(401);
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
  async function givenRefreshTokenRepository() {
    refreshTokenRepository = await app.getRepository(RefreshTokenRepository);
  }
  async function deleteMockData() {
    await userCredentialsRepository.deleteAllHard();
    await userPermissionRepository.deleteAllHard();
    await userRepo.deleteAllHard();
    await authClientRepository.deleteAllHard();
    await refreshTokenRepository.deleteAll();
    await roleRepository.deleteAllHard();
  }
  async function setMockData() {
    await roleRepository.createAll([
      {
        id: '1',
        name: 'admin',
        roleType: RoleTypes.Admin,
        permissions: [
          'canLoginToIPS',
          'ViewOwnUser',
          'ViewAnyUser',
          'ViewTenantUser',
          'CreateAnyUser',
          'CreateTenantUser',
          'UpdateOwnUser',
          'UpdateTenantUser',
          'UpdateAnyUser',
          'DeleteTenantUser',
          'DeleteAnyUser',
          'ViewTenant',
          'CreateTenant',
          'UpdateTenant',
          'DeleteTenant',
          'ViewRole',
          'CreateRole',
          'UpdateRole',
          'DeleteRole',
          'ViewAudit',
          'CreateAudit',
          'UpdateAudit',
          'DeleteAudit',
        ],
      },
      {
        id: '2',
        name: 'others',
        roleType: RoleTypes.Others,
        permissions: [
          'ViewOwnUser',
          'ViewTenantUser',
          'CreateTenantUser',
          'UpdateOwnUser',
          'UpdateTenantUser',
          'DeleteTenantUser',
          'ViewTenant',
          'ViewRole',
        ],
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
      authProvider: AuthProvider.KEYCLOAK,
    });
  }
});
