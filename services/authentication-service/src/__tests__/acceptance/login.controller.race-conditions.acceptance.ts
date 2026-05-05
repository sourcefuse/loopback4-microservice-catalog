// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';

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
import {TestingApplication} from '../fixtures/application';
import {setupApplication} from './test-helper';

describe('Authentication microservice - Race condition protection', () => {
  let app: TestingApplication;
  let client: Client;
  let userRepo: UserRepository;
  let userTenantRepo: UserTenantRepository;
  let authClientRepository: AuthClientRepository;
  let userPermissionRepository: UserLevelPermissionRepository;
  let refreshTokenRepository: RefreshTokenRepository;
  let userCredentialsRepository: UserCredentialsRepository;
  let roleRepository: RoleRepository;
  const useragent = 'test';
  const deviceId = 'test';
  const deviceIdName = 'device_id';
  const useragentName = 'user-agent';

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    client = createRestAppClient(app);
  });

  after(async () => app.stop());

  before(givenUserRepository);
  before(givenUserTenantRepository);
  before(givenAuthClientRepository);
  before(givenUserPermissionRepository);
  before(givenRefreshTokenRepository);
  before(givenRoleRepository);
  before(givenUserCredentialsRepository);
  before(setMockData);
  before(async () => {
    process.env.JWT_PRIVATE_KEY_PASSPHRASE = 'jwt_private_key_passphrase';
    await client.post('/connect/generate-keys').send().expect(204);
  });
  after(deleteMockData);
  afterEach(() => {
    delete process.env.JWT_ISSUER;
    delete process.env.ENCRYPTION_KEY;
  });

  it('should handle concurrent auth code exchange requests to prevent race conditions', async () => {
    const reqData = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id: 'web',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_secret: 'test',
      username: 'test_user_race',
      password: 'test123#@',
    };
    process.env.JWT_ISSUER = 'test';
    process.env.ENCRYPTION_KEY = '0123456789ABCDEF0123456789ABCDEF';

    // Get auth code
    const reqForCode = await client
      .post(`/auth/login`)
      .send(reqData)
      .expect(200);
    const authCode = reqForCode.body.code;

    // Launch 3 concurrent requests to use of same auth code
    const numConcurrentRequests = 3;
    const promises = Array.from({length: numConcurrentRequests}, async () => {
      return client
        .post(`/auth/token`)
        .set(deviceIdName, deviceId)
        .set(useragentName, useragent)
        .send({clientId: 'web', code: authCode});
    });

    const responses = await Promise.all(promises);

    // Only one should succeed (return true)
    const successCount = responses.filter(r => r.status === 200).length;
    expect(successCount).to.equal(1);

    // All others should fail (return false)
    const failureCount = responses.filter(r => r.status === 401).length;
    expect(failureCount).to.equal(numConcurrentRequests - 1);
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
        tenantId: '200',
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
        tenantId: '200',
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
    process.env.USER_TEMP_PASSWORD = 'test123#@';
    await userRepo.create({
      id: '1',
      firstName: 'Test',
      lastName: 'User',
      username: 'test_user_race',
      dob: '1996-11-05',
      authClientIds: `{1}`,
      email: 'raceuser@gmail.com',
    });
    await userTenantRepo.create({
      userId: '1',
      tenantId: '200',
      roleId: '2',
    });
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
  }
});
