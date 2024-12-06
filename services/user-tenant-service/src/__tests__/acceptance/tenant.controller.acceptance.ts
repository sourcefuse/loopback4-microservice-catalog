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
import {Tenant} from '../../models';
import {TenantRepository} from '../../repositories';
import {setupApplication} from './test-helper';

describe('Tenant Controller', function (this: Mocha.Suite) {
  this.timeout(10000);
  let app: UserTenantServiceApplication;
  let tenantRepo: TenantRepository;
  let jwtKeyRepo: JwtKeysRepository;
  const basePath = '/tenants';
  let client: Client;
  let token: string;
  const pass = 'test_password';
  const tenantName = 'sample_tenant';
  const id = '9640864d-a84a-e6b4-f20e-918ff280cdaa';
  const testUser = {
    id: id,
    userTenantId: id,
    username: 'test_user',
    tenantId: id,
    password: pass,
    permissions: [
      PermissionKey.ViewTenant,
      PermissionKey.CreateTenant,
      PermissionKey.UpdateTenant,
      PermissionKey.DeleteTenant,
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
    const tenant = {};
    await client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(tenant)
      .expect(422);
  });

  it('gives status 200 when a new tenant entity is created', async () => {
    const key = nanoid(10);
    const tenant = {
      name: tenantName,
      key: key,
      status: 1,
    };
    await client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(tenant)
      .expect(200);
  });

  it('gives status 204 when a tenant entity is deleted ', async () => {
    const key = nanoid(10);
    const tenant = await tenantRepo.create(
      new Tenant({
        name: tenantName,
        key: key,
        status: 1,
      }),
    );
    await client
      .del(`${basePath}/${tenant.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('return a tenant objet when id is sent', async () => {
    const key = nanoid(10);
    const tenant = await tenantRepo.create(
      new Tenant({
        name: tenantName,
        key: key,
        status: 1,
      }),
    );
    const response = await client
      .get(`${basePath}/${tenant.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body).to.have.properties(['name']);
  });

  it('gives status 204 when a task is updated ', async () => {
    const key = nanoid(10);
    const tenant = await tenantRepo.create(
      new Tenant({
        name: tenantName,
        key: key,
        status: 1,
      }),
    );
    await client
      .patch(`${basePath}/${tenant.id}`)
      .set('authorization', `Bearer ${token}`)
      .send({name: 'new tenant'})
      .expect(204);
  });

  it('gives count of the number of tenant entities ', async () => {
    const countResponse = await client
      .get(`${basePath}/count`)
      .set('authorization', `Bearer ${token}`);
    expect(countResponse.body).to.have.property('count');
  });

  it('gives status 403 when user doesnt have the required permissions', async () => {
    const key = nanoid(10);
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
      .post(basePath)
      .send({
        name: tenantName,
        key: key,
        status: 1,
      })
      .set('authorization', `Bearer ${newToken}`)
      .expect(403);
  });

  async function givenRepositories() {
    tenantRepo = await app.getRepository(TenantRepository);
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
