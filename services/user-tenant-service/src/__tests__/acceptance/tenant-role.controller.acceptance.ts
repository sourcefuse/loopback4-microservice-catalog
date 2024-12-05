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
import * as jose from 'node-jose';
import {UserTenantServiceApplication} from '../../application';
import {PermissionKey} from '../../enums';
import {UserTenantServiceKey} from '../../keys';
import {Role, UserTenant} from '../../models';
import {RoleRepository, UserTenantRepository} from '../../repositories';
import {TenantOperationsService} from '../../services';
import {setupApplication} from './test-helper';

describe('Role Controller', function (this: Mocha.Suite) {
  this.timeout(10000);
  let app: UserTenantServiceApplication;
  let roleRepo: RoleRepository;
  let userTenantRepo: UserTenantRepository;
  let jwtKeyRepo: JwtKeysRepository;
  const basePath = '/tenants';
  let client: Client;
  let token: string;
  const pass = 'test_password';
  const id = '9640864d-a84a-e6b4-f20e-918ff280cdaa';
  const testUser = {
    id: id,
    userTenantId: id,
    username: 'test_user',
    tenantId: id,
    password: pass,
    permissions: [
      PermissionKey.ViewRoles,
      PermissionKey.UpdateRoles,
      PermissionKey.DeleteRoles,
      PermissionKey.CreateRoles,
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

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(`${basePath}/${id}/roles`).expect(401);
    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed', async () => {
    await client
      .get(`${basePath}/${id}/roles`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 422 when request body is invalid', async () => {
    const role = {};
    await client
      .post(`${basePath}/${id}/roles`)
      .set('authorization', `Bearer ${token}`)
      .send(role)
      .expect(422);
  });

  it('gives status 200 when a new role is created', async () => {
    const role = {
      name: 'test_role',
      roleType: 0 as unknown as undefined,
    };
    await client
      .post(`${basePath}/${id}/roles`)
      .set('authorization', `Bearer ${token}`)
      .send(role)
      .expect(200);
  });
  it('gives status 403 when user try to create role with permission that user itself does not has', async () => {
    const role = {
      name: 'test_role',
      roleType: 0 as unknown as undefined,
      permissions: [PermissionKey.CreateGroup],
    };
    await client
      .post(`${basePath}/${id}/roles`)
      .set('authorization', `Bearer ${token}`)
      .send(role)
      .expect(403);
  });

  it('gives status 200 when a role is updated ', async () => {
    const role = await roleRepo.create(
      new Role({
        name: 'admin_devops',
      }),
    );
    await client
      .patch(`${basePath}/${id}/roles`)
      .set('authorization', `Bearer ${token}`)
      .send({name: 'admin_sde'})
      .query({id: role.id})
      .expect(200);
  });

  it('gives status 403 when user tries to update role permissions that user itself does not has', async () => {
    const role = {
      name: 'test_role',
      roleType: 0 as unknown as undefined,
      permissions: [PermissionKey.CreateGroup],
    };
    await client
      .patch(`${basePath}/${id}/roles`)
      .set('authorization', `Bearer ${token}`)
      .send(role)
      .expect(403);
  });

  it('gives status 403 when user try to delete his own role', async () => {
    const role = await roleRepo.create(
      new Role({
        name: 'test_admin',
        roleType: 0 as unknown as undefined,
      }),
    );
    const userTenant = await userTenantRepo.create(
      new UserTenant({
        userId: id,
        tenantId: id,
        roleId: role.id,
      }),
    );
    testUser.userTenantId = userTenant.id ?? '';
    await setCurrentUser();
    await client
      .del(`${basePath}/${id}/roles/${role.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('gives status 204 when a role is deleted ', async () => {
    const role = await roleRepo.create(
      new Role({
        name: 'test_admin',
        roleType: 0 as unknown as undefined,
      }),
    );
    const userTenant = await userTenantRepo.create(
      new UserTenant({
        userId: id,
        tenantId: id,
        roleId: '2',
      }),
    );
    testUser.userTenantId = userTenant.id ?? '';
    await setCurrentUser();
    await client
      .del(`${`${basePath}/${id}/roles`}/${role.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
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
    await client
      .post(`${basePath}/${id}/roles`)
      .send(
        new Role({
          name: 'test_admin',
          roleType: 0 as unknown as undefined,
        }),
      )
      .set('authorization', `Bearer ${newToken}`)
      .expect(403);
  });

  async function givenRepositories() {
    roleRepo = await app.getRepository(RoleRepository);
    userTenantRepo = await app.getRepository(UserTenantRepository);
    jwtKeyRepo = await app.getRepository(JwtKeysRepository);
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
    app
      .bind(UserTenantServiceKey.TenantOperationsService)
      .toClass(TenantOperationsService);
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
