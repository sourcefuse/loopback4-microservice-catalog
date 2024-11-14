// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject} from '@loopback/repository';
import {Client, expect} from '@loopback/testlab';
import {JwtKeysRepository} from '@sourceloop/core';
import {generateKeyPairSync} from 'crypto';
import * as jwt from 'jsonwebtoken';
import {AuthenticationBindings} from 'loopback4-authentication';
import {nanoid} from 'nanoid';
import * as jose from 'node-jose';
import {UserTenantServiceApplication} from '../../application';
import {PermissionKey} from '../../enums';
import {UserTenantServiceKey} from '../../keys';
import {Group, Role, Tenant, User, UserTenant} from '../../models';
import {
  GroupRepository,
  RoleRepository,
  TenantRepository,
  UserRepository,
  UserTenantRepository,
} from '../../repositories';
import {UserGroupService} from '../../services';
import {setupApplication} from './test-helper';

describe('Group Controller', function (this: Mocha.Suite) {
  this.timeout(100000);
  let app: UserTenantServiceApplication;
  let groupRepo: GroupRepository;
  let userTenantRepo: UserTenantRepository;
  let roleRepo: RoleRepository;
  let tenantRepo: TenantRepository;
  let userRepo: UserRepository;
  let jwtKeyRepo: JwtKeysRepository;
  let client: Client;
  let token: string;
  const tenantName = 'sample_tenant';
  const pass = 'test_password';
  let id = '9640864d-a84a-e6b4-f20e-918ff280cdaa';
  const basePath = '/tenants';
  let testUser = {
    id: id,
    userTenantId: id,
    username: 'test_user',
    tenantId: id,
    password: pass,
    permissions: [
      PermissionKey.ViewGroupList,
      PermissionKey.UpdateGroup,
      PermissionKey.DeleteGroup,
      PermissionKey.CreateGroup,
    ],
  };
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });
  after(async () => {
    await jwtKeyRepo.deleteAll();
    await app.stop();
  });

  before(givenRepositories);
  before(setJwtKeysMockData);
  before(setCurrentUser);
  before(setupMockData);

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(`${basePath}/${id}/groups`).expect(401);
    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed', async () => {
    await client
      .get(`${basePath}/${id}/groups`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 422 when request body is invalid', async () => {
    const group = {
      name: 12,
    };
    await client
      .post(`${basePath}/${id}/groups`)
      .set('authorization', `Bearer ${token}`)
      .send(group)
      .expect(422);
  });

  it('gives status 200 when a new group is created', async () => {
    const group = {
      name: 'test_group',
    };
    await client
      .post(`${basePath}/${id}/groups`)
      .set('authorization', `Bearer ${token}`)
      .send(group)
      .expect(200);
  });

  it('gives status 204 when a group is deleted ', async () => {
    const group = await groupRepo.create(
      new Group({
        name: 'test_group',
      }),
    );
    await client
      .del(`${`${basePath}/${id}/groups`}/${group.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('gives status 200 when a task is updated ', async () => {
    const group = await groupRepo.create(
      new Group({
        name: 'test_admin',
      }),
    );
    await client
      .patch(`${basePath}/${id}/groups`)
      .set('authorization', `Bearer ${token}`)
      .send({name: 'new_admin'})
      .query({id: group.id})
      .expect(200);
  });

  it('gives status 403 when user doesnt have the required permissions', async () => {
    const newTestUserId = '9640864d-a84a-e6b4-f20e-918ff280cdbb';
    const newTestUser = {
      id: newTestUserId,
      userTenantId: newTestUserId,
      username: 'test_user',
      tenantId: newTestUserId,
      password: pass,
      permissions: [],
    };
    const newToken = await generateToken(newTestUser);
    app.bind(AuthenticationBindings.CURRENT_USER).to(newTestUser);
    await client
      .post(`${basePath}/${id}/groups`)
      .send(
        new Group({
          name: 'test_group',
        }),
      )
      .set('authorization', `Bearer ${newToken}`)
      .expect(403);
  });

  async function givenRepositories() {
    groupRepo = await app.getRepository(GroupRepository);
    userTenantRepo = await app.getRepository(UserTenantRepository);
    userRepo = await app.getRepository(UserRepository);
    roleRepo = await app.getRepository(RoleRepository);
    tenantRepo = await app.getRepository(TenantRepository);
    jwtKeyRepo = await app.getRepository(JwtKeysRepository);
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

    const user = await userRepo.create(
      new User({
        firstName: 'tenant_pref_user',
        username: 'tenant_pref_test_user',
        email: 'abc@xyz',
        defaultTenantId: tenant.id,
      }),
    );

    const newRole = new Role();
    newRole.name = 'test_admin';
    newRole.roleType = 0;
    newRole.tenantId = tenant.id ?? '';
    testUser.tenantId = tenant.id ?? '';
    const role = await roleRepo.create(newRole);
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
      username: user.username,
      tenantId: tenant.id ?? '',
      password: pass,
      permissions: [
        PermissionKey.ViewGroupList,
        PermissionKey.UpdateGroup,
        PermissionKey.DeleteGroup,
        PermissionKey.CreateGroup,
      ],
    };
    await setCurrentUser();
  }
  async function setJwtKeysMockData() {
    process.env.JWT_PRIVATE_KEY_PASSPHRASE = 'jwt_private_key_passphrase';
    const {publicKey, privateKey} = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: process.env.JWT_PRIVATE_KEY_PASSPHRASE,
      },
    });

    // Create the JWKS object
    const keyStore = jose.JWK.createKeyStore();
    const key = await keyStore.add(publicKey, 'pem');
    await jwtKeyRepo.create({
      keyId: key.kid, // Unique identifier for the key
      publicKey: publicKey,
      privateKey: privateKey,
    });
  }

  async function setCurrentUser() {
    app.bind(AuthenticationBindings.CURRENT_USER).to(testUser);
    app.bind(UserTenantServiceKey.UserGroupService).toClass(UserGroupService);
    token = await generateToken(testUser);
  }

  async function generateToken(userData: AnyObject): Promise<string> {
    const keys = await jwtKeyRepo.find();
    return jwt.sign(
      userData,
      {
        key: keys[0].privateKey,
        passphrase: process.env.JWT_PRIVATE_KEY_PASSPHRASE,
      },
      {
        algorithm: 'RS256',
        issuer: process.env.JWT_ISSUER,
        keyid: keys[0].keyId,
      },
    );
  }
});
