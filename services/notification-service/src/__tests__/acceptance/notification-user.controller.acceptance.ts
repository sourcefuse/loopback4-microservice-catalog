// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {NotificationUserRepository} from '../../repositories';
import {NotificationApplication} from '../application';
import {setUpApplication} from './helper';

describe('Notification User Controller', () => {
  let app: NotificationApplication;
  let client: Client;
  let notificationUserRepo: NotificationUserRepository;
  const basePath = '/notification-users';
  const pass = 'test_password';
  const testUser = {
    id: '1',
    username: 'test_user',
    password: pass,
    permissions: [
      'ViewNotification',
      'CreateNotification',
      'UpdateNotification',
      'DeleteNotification',
    ],
  };

  const token = jwt.sign(testUser, 'kdskssdkdfs', {
    expiresIn: 180000,
    issuer: 'sf',
  });

  before('setupApplication', async () => {
    ({app, client} = await setUpApplication());
  });
  after(async () => app.stop());

  before(givenRepositories);
  afterEach(deleteMockData);

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

  it('gives status 200 and check properties exist with response for particular id', async () => {
    const reqToAddNotificationUser = await addUser();
    expect(reqToAddNotificationUser.status).to.be.equal(200);

    const response = await client
      .get(`${basePath}/${reqToAddNotificationUser.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response).to.have.properties(['res', 'req']);
  });

  it('updates notification user successfully using PATCH request', async () => {
    const notificationToUpdate = {
      body: 'updated-body',
    };

    const response = await client
      .patch(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .send(notificationToUpdate)
      .expect(200);

    expect(response).to.have.properties(['res', 'req']);
  });

  it('updates notification user successfully using PATCH request with id', async () => {
    const reqToAddNotificationUser = await addUser();

    const notificationToUpdate = {
      body: 'updated-body',
    };

    await client
      .patch(`${basePath}/${reqToAddNotificationUser.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(notificationToUpdate)
      .expect(204);

    const response = await client
      .get(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response).to.have.properties(['res', 'req']);
  });

  it('gives status 403 if current user is not same', async () => {
    const reqToAddNotificationUser = await addIncorrectUser();
    expect(reqToAddNotificationUser.status).to.be.equal(403);

    expect(reqToAddNotificationUser).to.have.property('error');
  });

  it('deletes a notification user successfully', async () => {
    const reqToAddNotificationUser = await addUser();
    await client
      .del(`${basePath}/${reqToAddNotificationUser.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('deletes all notification user successfully', async () => {
    await client
      .del(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('deletes all notification user hard successfully', async () => {
    await client
      .del(`${basePath}/hard`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('should return count', async () => {
    await client
      .get(`${basePath}/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  async function addUser() {
    const notificationUserToAdd = {
      userId: '1',
      notificationId: 'test_notification',
    };

    return client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(notificationUserToAdd);
  }

  async function addIncorrectUser() {
    const notificationUserToAdd = {
      userId: 'incorrect',
      notificationId: 'test_notification',
    };

    return client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(notificationUserToAdd);
  }

  async function deleteMockData() {
    await notificationUserRepo.deleteAll();
  }

  async function givenRepositories() {
    notificationUserRepo = await app.getRepository(NotificationUserRepository);
  }
});
