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

interface USER {
  id: string | undefined;
  userTenantId: string | undefined;
  username: string;
  tenantId: string | undefined;
  password: string;
  permissions: PermissionKey[];
}

describe('UserTenantPrefs Controller', function () {
  /* eslint-disable @typescript-eslint/no-invalid-this */
  this.timeout(10000);
  let app: UserTenantServiceApplication;
  let userTenantRepo: UserTenantRepository;
  let roleRepo: RoleRepository;
  let tenantRepo: TenantRepository;
  let userRepo: UserRepository;
  const basePath = '/user-tenant-prefs';
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
      PermissionKey.UpdateUserTenantPreference,
      PermissionKey.ViewUserTenantPreference,
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
    const response = await client.get(basePath).expect(401);
    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed ', async () => {
    await client
      .get(basePath)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 422 when request body is invalid', async () => {
    const userTenantPrefs = {};
    await client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(userTenantPrefs)
      .expect(422);
  });

  it('gives status 204 when a new userTenantPref is created', async () => {
    await client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(data)
      .expect(204);
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
        PermissionKey.UpdateUserTenantPreference,
        PermissionKey.ViewUserTenantPreference,
      ],
    };
    if (testUser.userTenantId) {
      data.userTenantId = testUser.userTenantId;
    }
    setCurrentUser();
  }

  function setCurrentUser() {
    app.bind(AuthenticationBindings.CURRENT_USER).to(testUser);
    token = jwt.sign(testUser, 'kdskssdkdfs', {
      expiresIn: 180000,
      issuer: 'sf',
    });
  }
});
