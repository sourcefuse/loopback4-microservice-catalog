// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import {AuthenticationBindings} from 'loopback4-authentication';
import {nanoid} from 'nanoid';
import path from 'path';
import {UserTenantServiceApplication} from '../../application';
import {PermissionKey} from '../../enums';
import {Role, Tenant, User, UserTenant} from '../../models';
import {
  RoleRepository,
  TenantRepository,
  UserRepository,
  UserTenantRepository,
} from '../../repositories';
import {UserOperationsService} from '../../services';
import {issuer, setupApplication} from './test-helper';

describe('TenantUser Controller', function (this: Mocha.Suite) {
  this.timeout(100000);
  let app: UserTenantServiceApplication;
  let id = '9640864d-a84a-e6b4-f20e-918ff280cdaa';
  let userTenantRepo: UserTenantRepository;
  let roleRepo: RoleRepository;
  let tenantRepo: TenantRepository;
  let userRepo: UserRepository;
  const basePath = '/tenants';
  let client: Client;
  const tenantName = 'sample_tenant';
  let token: string;
  const pass = 'test_password';
  let testUser = {
    id: id,
    userTenantId: id,
    username: 'test_user',
    tenantId: id,
    password: pass,
    roleId: id,
    authClientIds: [2],
    permissions: [
      PermissionKey.ViewTenantUser,
      PermissionKey.CreateTenantUser,
      PermissionKey.UpdateTenantUser,
      PermissionKey.DeleteTenantUser,
    ],
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
    const response = await client.get(`${basePath}/${id}/users`).expect(401);
    expect(response).to.have.property('error');
  });

  it('give status 403 when user try to change its own role', async () => {
    const userTenant = await userTenantRepo.create({
      userId: id,
      roleId: '1',
      tenantId: id,
    });
    testUser.userTenantId = userTenant.id ?? '';
    setCurrentUser();
    const userDataToUpdate = {
      roleId: '2',
    };
    await client
      .patch(`${basePath}/${id}/users/${userTenant.userId}`)
      .set('authorization', `Bearer ${token}`)
      .send(userDataToUpdate)
      .expect(403);
  });

  it('gives status 200 when token is passed ', async () => {
    await client
      .get(`${basePath}/${id}/users`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('when userdetails is not present and token is passed gives 404', async () => {
    await client
      .get(`${basePath}/${id}/users/${id}`)
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
    const key = nanoid(10);
    const tenant = await tenantRepo.create(
      new Tenant({
        name: tenantName,
        key: key,
        status: 1,
      }),
    );
    id = tenant.id ?? '';

    const newRole = new Role();
    newRole.name = 'test_admin';
    newRole.roleType = 0;
    newRole.tenantId = tenant.id ?? '';
    testUser.tenantId = tenant.id ?? '';
    const role = await roleRepo.create(newRole);

    const user = await userRepo.create(
      new User({
        firstName: 'tenant_pref_user',
        username: 'tenant_pref_test_user',
        email: 'abc@xyz',
        defaultTenantId: tenant.id,
        authClientIds: '{2}',
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
      userTenantId: userTenant.id ?? '',
      username: issuer,
      tenantId: tenant.id ?? '',
      password: pass,
      roleId: role.id ?? '',
      authClientIds: [2],
      permissions: [
        PermissionKey.ViewTenantUser,
        PermissionKey.CreateTenantUser,
        PermissionKey.UpdateTenantUser,
        PermissionKey.DeleteTenantUser,
      ],
    };
    setCurrentUser();
  }

  function setCurrentUser() {
    app.bind(AuthenticationBindings.CURRENT_USER).to(testUser);
    app.bind('services.UserOperationsService').toClass(UserOperationsService);
    process.env.JWT_PRIVATE_KEY = path.resolve(
      __dirname,
      '../../../src/__tests__/unit/utils/privateKey.txt',
    );
    const privateKey = fs.readFileSync(process.env.JWT_PRIVATE_KEY ?? '');
    token = jwt.sign(testUser, privateKey, {
      expiresIn: 180000,
      issuer: issuer,
      algorithm: 'RS256',
    });
  }
});
