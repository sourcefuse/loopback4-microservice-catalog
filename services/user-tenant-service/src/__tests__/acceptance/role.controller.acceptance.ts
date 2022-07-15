// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {AuthenticationBindings} from 'loopback4-authentication';
import {PermissionKey} from '../../enums';
import {Role} from '../../models';
import {RoleRepository} from '../../repositories';
import {UserTenantServiceApplication} from '../application';
import {setupApplication} from './test-helper';

describe('Role Controller', function () {
  /* eslint-disable @typescript-eslint/no-invalid-this */
  this.timeout(10000);
  let app: UserTenantServiceApplication;
  let roleRepo: RoleRepository;
  const basePath = '/roles';
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
    const role = {};
    await client
      .post(basePath)
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
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(role)
      .expect(200);
  });

  it('gives status 204 when a role is deleted ', async () => {
    const role = await roleRepo.create(
      new Role({
        name: 'test_admin',
        roleType: 0 as unknown as undefined,
      }),
    );
    await client
      .del(`${basePath}/${role.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('return a role objet when id is sent', async () => {
    const role = await roleRepo.create(
      new Role({
        name: 'test_admin',
        roleType: 0 as unknown as undefined,
      }),
    );
    const response = await client
      .get(`${basePath}/${role.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body).to.have.properties(['name', 'id']);
  });

  it('gives status 204 when a task is updated ', async () => {
    const role = await roleRepo.create(
      new Role({
        name: 'test_admin',
        roleType: 0 as unknown as undefined,
      }),
    );
    await client
      .patch(`${basePath}/${role.id}`)
      .set('authorization', `Bearer ${token}`)
      .send({name: 'new_admin'})
      .expect(204);
  });

  it('gives count of the number of role entities ', async () => {
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
    await client
      .post(basePath)
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
  }

  function setCurrentUser() {
    app.bind(AuthenticationBindings.CURRENT_USER).to(testUser);
    token = jwt.sign(testUser, 'kdskssdkdfs', {
      expiresIn: 180000,
      issuer: 'sf',
    });
  }
});
