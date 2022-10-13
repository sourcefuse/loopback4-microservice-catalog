// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import {AuthenticationBindings} from 'loopback4-authentication';
import * as jwt from 'jsonwebtoken';
import {PermissionKey} from '../../enums';
import {UserOperationsService} from '../../services';
import {UserTenantServiceApplication} from '../application';
import {setupApplication} from './test-helper';

describe('TenantUser Controller', function () {
  /* eslint-disable @typescript-eslint/no-invalid-this */
  this.timeout(10000);
  let app: UserTenantServiceApplication;
  const id = '9640864d-a84a-e6b4-f20e-918ff280cdaa';
  const basePath = '/tenants';
  let client: Client;
  let token: string;
  const pass = 'test_password';
  const testUser = {
    id: id,
    userTenantId: id,
    username: 'test_user',
    tenantId: id,
    password: pass,
    roleId: id,
    permissions: [
      PermissionKey.ViewAnyUser,
      PermissionKey.ViewTenantUser,
      PermissionKey.ViewTenantUserRestricted,
      PermissionKey.ViewOwnUser,
      PermissionKey.CreateAnyUser,
      PermissionKey.CreateTenantUser,
      PermissionKey.CreateTenantUserRestricted,
      PermissionKey.UpdateAnyUser,
      PermissionKey.UpdateOwnUser,
      PermissionKey.UpdateTenantUser,
      PermissionKey.UpdateTenantUserRestricted,
      PermissionKey.DeleteAnyUser,
      PermissionKey.DeleteTenantUser,
      PermissionKey.DeleteTenantUserRestricted,
      PermissionKey.ViewAllUser,
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
    const response = await client.get(`${basePath}/${id}/users`).expect(401);
    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed ', async () => {
    await client
      .get(`${basePath}/${id}/users`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives view-all when token is passed ', async () => {
    await client
      .get(`${basePath}/${id}/users/view-all`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives count when token is passed ', async () => {
    await client
      .get(`${basePath}/${id}/users/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('when userdetails is not present and token is passed gives 404', async () => {
    await client
      .get(`${basePath}/${id}/users/${id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(404);
  });

  it('gives status 404 when entity not found', async () => {
    const newUser = {
      roleId: '1',
      userTenantId: '1',
      tenantId: '1',
      userDetails: {
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'test_user',
      },
    };
    await client
      .post(`${basePath}/${id}/users`)
      .set('authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(404);
  });

  function setCurrentUser() {
    app.bind(AuthenticationBindings.CURRENT_USER).to(testUser);
    app.bind('services.UserOperationsService').toClass(UserOperationsService);
    token = jwt.sign(testUser, 'kdskssdkdfs', {
      expiresIn: 180000,
      issuer: 'sf',
    });
  }
});
