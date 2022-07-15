// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {
  NotificationRepository,
  NotificationUserRepository,
} from '../../repositories';
import {NotificationApplication} from '../application';
import {setUpApplication} from './helper';

describe('Notification Controller', () => {
  let app: NotificationApplication;
  let client: Client;
  let notificationRepo: NotificationRepository;
  let notificationUserRepo: NotificationUserRepository;
  const basePath = '/notifications';
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

  it('gives status 200 for adding notif in bulk', async () => {
    const reqToAddNotificationUser = await addNotifBulk();
    expect(reqToAddNotificationUser.status).to.be.equal(200);
  });

  it('updates notification successfully using PATCH request', async () => {
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

  it('updates notification successfully using PATCH request with id', async () => {
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

  it('deletes all notification successfully', async () => {
    await client
      .del(`${basePath}`)
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
    const notificationToAdd = {
      body: 'test_body',
      receiver: {
        to: [
          {
            id: 'test_id',
            ['test_key']: '',
          },
        ],
      },
      type: 0,
      sentDate: new Date(),
    };

    return client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(notificationToAdd);
  }

  async function addNotifBulk() {
    const notificationsToAdd = [
      {
        body: 'test_body',
        receiver: {
          to: [
            {
              id: 'test_id',
              ['test_key']: '',
            },
          ],
        },
        type: 0,
        sentDate: new Date(),
      },
    ];

    return client
      .post(`${basePath}/bulk`)
      .set('authorization', `Bearer ${token}`)
      .send(notificationsToAdd);
  }

  async function deleteMockData() {
    await notificationRepo.deleteAll();
    await notificationUserRepo.deleteAll();
  }

  async function givenRepositories() {
    notificationRepo = await app.getRepository(NotificationRepository);
    notificationUserRepo = await app.getRepository(NotificationUserRepository);
  }
});
