import {Client, createRestAppClient, expect} from '@loopback/testlab';
import {RoleTypes} from '@sourceloop/core';
import {
  AuthClientRepository,
  RefreshTokenRepository,
  RoleRepository,
  UserCredentialsRepository,
  UserLevelPermissionRepository,
  UserRepository,
  UserTenantRepository,
} from '../../repositories';
import {setupApplication} from './test-helper';
import {TestingApplication} from '../fixtures/application';

describe('Authentication microservice', () => {
  let app: TestingApplication;
  let client: Client;
  let userRepo: UserRepository;
  let userTenantRepo: UserTenantRepository;
  let authClientRepository: AuthClientRepository;
  let userPermissionRepository: UserLevelPermissionRepository;
  let refreshTokenRepository: RefreshTokenRepository;
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
  before(givenRefreshTokenRepository);
  before(givenRoleRepository);
  before(givenUserCredentialsRepository);
  before(() => {
    client = createRestAppClient(app);
  });
  before(setMockData);
  after(deleteMockData);
  afterEach(() => {
    delete process.env.JWT_ISSUER;
    delete process.env.JWT_SECRET;
  });
  it('gives status 422 for login request with no client credentials', async () => {
    const reqData = {};
    const response = await client.post(`/auth/login`).send(reqData).expect(422);
    expect(response).to.have.property('error');
  });
  it('gives status 422 for login request with no user credentials', async () => {
    const reqData = {
      clientId: 'web',
      clientSecret: 'blah',
    };
    const response = await client.post(`/auth/login`).send(reqData).expect(422);
    expect(response).to.have.property('error');
  });
  it('gives status 401 for login request with wrong client credentials', async () => {
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
  it('gives status 401 for login request with wrong user credentials', async () => {
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
  it('gives status 200 for login request', async () => {
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
      .set('device_id', 'test')
      .set('user-agent', 'test')
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
  it('should return 401 for incorrect moment creation', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
      password: 'temp123!@',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    await client
      .post(`/auth/login-token`)
      .set('device_id', 'test')
      .set('user-agent', 'test')
      .send(reqData)
      .expect(401);
  });
  it('should change password successfully', async () => {
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
  it('should return refresh token and access token for token refresh request', async () => {
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
      .set('device_id', 'test')
      .set('user-agent', 'test')
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
      .set('device_id', 'test')
      .set('user-agent', 'test')
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
      .set('device_id', 'test')
      .set('user-agent', 'test')
      .send({
        clientId: 'web',
        code: reqForCode.body.code,
      });
    await client
      .post(`/auth/token-refresh`)
      .send({refreshToken: reqForToken.body.refreshToken})
      .expect(401);
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
    const response = await client
      .post(`/auth/forget-password`)
      .send(reqData)
      .expect(200);
    console.log(response.body);
    expect(response.body).to.have.properties(['code']);
  });
  it('should return error user does not exist', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'testuser',
    };
    const response = await client
      .post(`/auth/forget-password`)
      .send(reqData)
      .expect(404);
    expect(response.body).to.have.properties('error');
  });
  it('should verify token successfully', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    const response = await client
      .post(`/auth/forget-password`)
      .send(reqData)
      .expect(200);
    const responseToken = await client
      .get(`/auth/verify-reset-password-link?token=${response.body.code}`)
      .send()
      .expect(200);
    expect(responseToken.body).to.have.properties('success');
  });
  it('should give token missing error', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    await client.post(`/auth/forget-password`).send(reqData).expect(200);
    const responseToken = await client
      .get(`/auth/verify-reset-password-link`)
      .send()
      .expect(400);
    expect(responseToken.body).to.have.properties('error');
  });
  it('return error for token missing', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    await client.post(`/auth/forget-password`).send(reqData).expect(200);
    const request = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      password: 'test123',
    };
    await client.patch(`/auth/reset-password`).send(request).expect(422);
  });
  it('return error for password missing', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    const response = await client
      .post(`/auth/forget-password`)
      .send(reqData)
      .expect(200);
    const request = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      token: response.body.code,
    };
    await client.patch(`/auth/reset-password`).send(request).expect(422);
  });
  it('should reset password', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    const response = await client
      .post(`/auth/forget-password`)
      .send(reqData)
      .expect(200);
    const request = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      token: response.body.code,
      password: 'test123',
    };
    await client.patch(`/auth/reset-password`).send(request).expect(204);
  });
  it('should return true on logout', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
      password: 'test123',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    const reqForCode = await client
      .post(`/auth/login`)
      .send(reqData)
      .expect(200);
    const reqForToken = await client
      .post(`/auth/token`)
      .set('device_id', 'test')
      .set('user-agent', 'test')
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
      password: 'test123',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    const reqForCode = await client
      .post(`/auth/login`)
      .send(reqData)
      .expect(200);
    const reqForToken = await client
      .post(`/auth/token`)
      .set('device_id', 'test')
      .set('user-agent', 'test')
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
  it('should return true on keycloak logout', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
      password: 'test123',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    const reqForCode = await client
      .post(`/auth/login`)
      .send(reqData)
      .expect(200);
    const reqForToken = await client
      .post(`/auth/token`)
      .set('device_id', 'test')
      .set('user-agent', 'test')
      .send({
        clientId: 'web',
        code: reqForCode.body.code,
      })
      .expect(200);
    await client
      .post(`/keycloak/logout`)
      .set('Authorization', `Bearer ${reqForToken.body.accessToken}`)
      .send({
        refreshToken: reqForToken.body.refreshToken,
      })
      .expect(200);
  });
  it('should return error for wrong token on keycloak logout', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web', // eslint-disable-next-line
      client_secret: 'test',
      username: 'test_user',
      password: 'test123',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    const reqForCode = await client
      .post(`/auth/login`)
      .send(reqData)
      .expect(200);
    const reqForToken = await client
      .post(`/auth/token`)
      .set('device_id', 'test')
      .set('user-agent', 'test')
      .send({
        clientId: 'web',
        code: reqForCode.body.code,
      })
      .expect(200);
    await client
      .post(`/keycloak/logout`)
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
    await userRepo.createAll([
      {
        id: '1',
        firstName: 'Test',
        lastName: 'User',
        username: 'test_user',
        dob: '1996-11-05',
        authClientIds: `{1}`,
        email: 'xyz@gmail.com',
      },
      {
        id: '2',
        firstName: 'Test',
        lastName: 'Teacher',
        username: 'test_teacher',
        dob: '1996-11-05',
        authClientIds: `{1}`,
      },
    ]);
    await userTenantRepo.create(
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
    );
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
    await userCredentialsRepository.create({
      id: '1',
      userId: '1',
      authProvider: 'test_auth',
      password: 'temp123!@',
    });
  }
});
