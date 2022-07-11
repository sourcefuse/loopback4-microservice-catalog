// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {AuthenticationBindings} from 'loopback4-authentication';
import {PermissionKey} from '../../enums';
import {Group, GroupUserCountView} from '../../models';
import {
  GroupRepository,
  UserGroupCountViewRepository,
} from '../../repositories';
import {UserGroupHelperService, UserGroupService} from '../../services';
import {UserTenantServiceApplication} from '../application';
import {setupApplication} from './test-helper';

describe('Group Controller', function () {
  /* eslint-disable @typescript-eslint/no-invalid-this */
  this.timeout(10000);
  let app: UserTenantServiceApplication;
  let groupRepo: GroupRepository;
  let userGroupCountRepo: UserGroupCountViewRepository;
  const basePath = '/groups';
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
      PermissionKey.ViewUserGroupList,
      PermissionKey.UpdateUserGroup,
      PermissionKey.DeleteUserGroup,
      PermissionKey.CreateUserGroup,
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

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(basePath).expect(401);
    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed', async () => {
    await client
      .get(basePath)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 422 when request body is invalid', async () => {
    const group = {
      name: 12,
    };
    await client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(group)
      .expect(422);
  });

  it('gives status 200 when a new group is created', async () => {
    const group = {
      name: 'test_group',
    };
    await client
      .post(basePath)
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
      .del(`${basePath}/${group.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('return a group object when id is sent', async () => {
    const userGroup = await userGroupCountRepo.create(
      new GroupUserCountView({
        userCount: 3,
      }),
    );
    const response = await client
      .get(`${basePath}/${userGroup.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body).to.have.properties(['userCount', 'id']);
  });

  it('gives status 204 when a task is updated ', async () => {
    const group = await groupRepo.create(
      new Group({
        name: 'test_admin',
      }),
    );
    await client
      .patch(`${basePath}/${group.id}`)
      .set('authorization', `Bearer ${token}`)
      .send({name: 'new_admin'})
      .expect(204);
  });

  it('gives count of the number of Group entities ', async () => {
    const countResponse = await client
      .get(`${basePath}/count`)
      .set('authorization', `Bearer ${token}`);
    expect(countResponse.body).to.have.property('count');
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
    const newToken = jwt.sign(newTestUser, 'kdskssdkdfs', {
      expiresIn: 180000,
      issuer: 'sf',
    });
    app.bind(AuthenticationBindings.CURRENT_USER).to(newTestUser);
    await client
      .post(basePath)
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
    userGroupCountRepo = await app.getRepository(UserGroupCountViewRepository);
  }

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
