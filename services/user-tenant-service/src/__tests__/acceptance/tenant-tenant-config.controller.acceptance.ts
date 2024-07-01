// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import {ConfigKey} from '@sourceloop/core';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import {AuthenticationBindings} from 'loopback4-authentication';
import path from 'path';
import {UserTenantServiceApplication} from '../../application';
import {PermissionKey} from '../../enums';
import {TenantConfig} from '../../models';
import {issuer, setupApplication} from './test-helper';

describe('Tenant Tenant-Config Controller', function (this: Mocha.Suite) {
  this.timeout(10000);
  let app: UserTenantServiceApplication;
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
    await app.stop();
  });

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
    const privateKey = fs.readFileSync(process.env.JWT_PRIVATE_KEY ?? '');
    const newToken = jwt.sign(newTestUser, privateKey, {
      expiresIn: 180000,
      issuer: issuer,
      algorithm: 'RS256',
    });
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

  function setCurrentUser() {
    app.bind(AuthenticationBindings.CURRENT_USER).to(testUser);
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
