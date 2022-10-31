// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {PermissionKey} from '../../enums';
import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {AuthenticationBindings} from 'loopback4-authentication';
import {nanoid} from 'nanoid';
import {UserTenantServiceApplication} from '../application';
import {Role, Tenant, User, UserTenant} from '../../models';
import {
  RoleRepository,
  TenantRepository,
  UserRepository,
  UserTenantRepository,
} from '../../repositories';
import {setupApplication} from './test-helper';
import {UserOperationsService} from '../../services';

interface USER {
  id: string | undefined;
  userTenantId: string | undefined;
  username: string;
  tenantId: string | undefined;
  password: string;
  permissions: PermissionKey[];
}

describe('UserTenant Controller', function () {
  /* eslint-disable @typescript-eslint/no-invalid-this */
  this.timeout(10000);
  let app: UserTenantServiceApplication;
  let userTenantRepo: UserTenantRepository;
  let roleRepo: RoleRepository;
  let tenantRepo: TenantRepository;
  let userRepo: UserRepository;
  const basePath = '/user-tenants';
  let client: Client;
  let token: string;
  const pass = 'test_password';
  const tenantName = 'sample_tenant';
  let testUser: USER = {
    id: undefined,
    userTenantId: undefined,
    username: '',
    tenantId: undefined,
    password: pass,
    permissions: [
      PermissionKey.ViewAnyUser,
      PermissionKey.ViewOwnUser,
      PermissionKey.ViewTenantUser,
      PermissionKey.ViewTenantUserRestricted,
    ],
  };

  const data = {
    userTenantId: '',
    configValue: {value: 'sample value'},
    configKey: 'last-accessd-url',
  };

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });
  before(givenRepositories);
  before(setCurrentUser);
  before(setupMockData);

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(`${basePath}/3`).expect(401);
    expect(response).to.have.property('error');
  });

  it('gives status 404 when entity not found ', async () => {
    await client
      .get(`${basePath}/${testUser.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(404);
  });

  async function givenRepositories() {
    userTenantRepo = await app.getRepository(UserTenantRepository);
    userRepo = await app.getRepository(UserRepository);
    roleRepo = await app.getRepository(RoleRepository);
    tenantRepo = await app.getRepository(TenantRepository);
  }

  async function setupMockData() {
    const user = await userRepo.create(
      new User({
        firstName: 'tenant_pref_user',
        username: 'tenant_pref_test_user',
        email: 'abc@xyz',
      }),
    );

    const role = await roleRepo.create(
      new Role({
        name: 'test_admin',
        roleType: 0 as unknown as undefined,
      }),
    );

    const key = nanoid(10);
    const tenant = await tenantRepo.create(
      new Tenant({
        name: tenantName,
        key: key,
        status: 1,
      }),
    );
    const userTenant = await userTenantRepo.create(
      new UserTenant({
        userId: user.id,
        tenantId: tenant.id,
        roleId: role.id,
      }),
    );

    testUser = {
      id: user.id,
      userTenantId: userTenant.id,
      username: user.username,
      tenantId: tenant.id,
      password: pass,
      permissions: [
        PermissionKey.ViewAnyUser,
        PermissionKey.ViewOwnUser,
        PermissionKey.ViewTenantUser,
        PermissionKey.ViewTenantUserRestricted,
      ],
    };
    if (testUser.userTenantId) {
      data.userTenantId = testUser.userTenantId;
    }
    setCurrentUser();
  }

  function setCurrentUser() {
    app.bind(AuthenticationBindings.CURRENT_USER).to(testUser);
    app.bind('services.UserOperationsService').toClass(UserOperationsService);
    token = jwt.sign(testUser, 'kdskssdkdfs', {
      expiresIn: 180000,
      issuer: 'sf',
    });
  }
});
