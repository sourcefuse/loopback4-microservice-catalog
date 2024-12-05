// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject} from '@loopback/repository';
import {Client, expect} from '@loopback/testlab';
import {ConfigKey, JwtKeysRepository} from '@sourceloop/core';
import {generateKeyPairSync} from 'crypto';
import * as jwt from 'jsonwebtoken';
import {AuthenticationBindings} from 'loopback4-authentication';
import * as jose from 'node-jose';
import {UserTenantServiceApplication} from '../../application';
import {PermissionKey} from '../../enums';
import {TenantConfig} from '../../models';
import {setupApplication} from './test-helper';

describe('Tenant Tenant-Config Controller', function (this: Mocha.Suite) {
  this.timeout(10000);
  let app: UserTenantServiceApplication;
  const basePath = '/tenants';
  let jwtKeyRepo: JwtKeysRepository;
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
    const response = await client
      .get(`${basePath}/${id}/tenant-configs`)
      .expect(401);
    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed', async () => {
    await client
      .get(`${basePath}/${id}/tenant-configs`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 422 when request body is invalid', async () => {
    const tenantConfig = {};
    await client
      .post(`${basePath}/${id}/tenant-configs`)
      .set('authorization', `Bearer ${token}`)
      .send(tenantConfig)
      .expect(422);
  });

  it('gives status 200 when a new tenant config is created', async () => {
    const tenantConfig = new TenantConfig({
      configKey: ConfigKey.PasswordPolicy,
      configValue: {ok: 'red'},
    });
    await client
      .post(`${basePath}/${id}/tenant-configs`)
      .set('authorization', `Bearer ${token}`)
      .send(tenantConfig)
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
    await client
      .post(`${basePath}/${id}/tenant-configs`)
      .send(
        new TenantConfig({
          configKey: ConfigKey.PasswordPolicy,
          configValue: {ok: 'red'},
        }),
      )
      .set('authorization', `Bearer ${newToken}`)
      .expect(403);
  });

  async function givenRepositories() {
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
