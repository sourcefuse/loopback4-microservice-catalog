// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import {AuthenticationBindings} from 'loopback4-authentication';
import * as jwt from 'jsonwebtoken';
import {PermissionKey} from '../../enums';
import {UserGroupService, UserGroupHelperService} from '../../services';
import {UserTenantServiceApplication} from '../application';
import {setupApplication} from './test-helper';

describe('UserGroups Controller', function () {
  /* eslint-disable @typescript-eslint/no-invalid-this */
  this.timeout(10000);
  let app: UserTenantServiceApplication;
  const id = '9640864d-a84a-e6b4-f20e-918ff280cdaa';
  const basePath = '/user-groups';
  let client: Client;
  let token: string;
  const pass = 'test_password';
  const testUser = {
    id: id,
    userTenantId: id,
    username: 'test_user',
    tenantId: id,
    password: pass,
    permissions: [PermissionKey.ViewUserGroupList],
  };

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  before(setCurrentUser);

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(`${basePath}`).expect(401);
    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed ', async () => {
    await client
      .get(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives userGroups Count when token is passed ', async () => {
    await client
      .get(`${basePath}/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  function setCurrentUser() {
    app.bind(AuthenticationBindings.CURRENT_USER).to(testUser);
    app.bind('service.sfUserService').toClass(UserGroupService);
    app.bind('service.sfUserService1').toClass(UserGroupHelperService);
    token = jwt.sign(testUser, 'kdskssdkdfs', {
      expiresIn: 180000,
      issuer: 'sf',
    });
  }
});
