// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {Notification, NotificationDto} from '../../models';
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
  const testUserEmail = 'test@yopmail.com';
  const testUser = {
    id: testUserEmail,
    username: 'test_user',
    password: pass,
    permissions: [
      'ViewNotification',
      'CreateNotification',
      'UpdateNotification',
      'DeleteNotification',
      'ViewNotification',
      'ViewNotificationNum',
      '1',
      '2',
      '3',
      '4',
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

  it('Gives status 200 and check properties exist with response for particular id when called get API to get by id.', async () => {
    const reqToAddNotificationUser = await addNotifications(false, '');
    expect(reqToAddNotificationUser.status).to.be.equal(200);

    const response = await client
      .get(`${basePath}/${reqToAddNotificationUser.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response).to.have.properties(['res', 'req']);
  });

  it('gives status 200 and check properties exist with response for particular id in case isGrouped flag is true and groupedKey is given in request.', async () => {
    const reqToAddNotificationUser = await addNotifications(true, 'testKey');
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
    const reqToAddNotificationUser = await addNotifications(false, '');
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

  it('gives status 422 for the request to send notification by groupKey, in case  receiver is not given in request.', async () => {
    const reqToDraftNotification = await draftNotifications();
    expect(reqToDraftNotification.status).to.be.equal(200);
    const requestBody = new NotificationDto({
      body: reqToDraftNotification.body?.body,
      type: 1,
      options: {from: testUserEmail},
    });
    await client
      .post(`${basePath}/groups/${reqToDraftNotification.body.groupKey}`)
      .set('authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(422);
  });

  it('gives status 200 for the request to send notification by groupKey, in case receiver is provided in request.', async () => {
    const reqToDraftNotification = await draftNotifications();
    expect(reqToDraftNotification.status).to.be.equal(200);
    const requestBody = new NotificationDto({
      body: reqToDraftNotification.body?.body,
      type: 1,
      receiver: {
        to: [
          {
            type: 1,
            id: 'testmail@yopmail.com',
          },
        ],
      },
      options: {from: testUserEmail},
    });
    await client
      .post(`${basePath}/groups/${reqToDraftNotification.body.groupKey}`)
      .set('authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(200);
  });

  it('gives status 422 for the request to send notification by id, in case receiver is not given.', async () => {
    const reqToDraftNotification = await draftNotifications();
    expect(reqToDraftNotification.status).to.be.equal(200);
    const requestBody = new NotificationDto({
      options: {from: testUserEmail},

      isCritical: true,
    });
    await client
      .post(`${basePath}/${reqToDraftNotification.body.id}/send`)
      .set('authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(422);
  });

  it('gives status 422 for the request to send notification by id, in case receiver is given provided.', async () => {
    const reqToDraftNotification = await draftNotifications();
    expect(reqToDraftNotification.status).to.be.equal(200);
    const requestBody = new NotificationDto({
      options: {from: testUserEmail},
      isCritical: true,
    });
    await client
      .post(`${basePath}/${reqToDraftNotification.body.id}/send`)
      .set('authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(422);
  });

  it('gives status 422 for the request to send notification by search criteria, in case there is no match for search criteria was found.', async () => {
    const reqToDraftNotification = await draftNotifications();
    expect(reqToDraftNotification.status).to.be.equal(200);
    const previousDate = new Date();
    previousDate.setDate(previousDate.getDate() + 1);
    const requestBody = {
      ids: ['1', '2', '5'],
    };
    await client
      .post(`${basePath}/send`)
      .set('authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(422);
  });

  it('gives status 422 for the request to send notification by search criteria, in case there is a match for search criteria was not found.', async () => {
    const reqToDraftNotification = await draftNotifications(false);
    expect(reqToDraftNotification.status).to.be.equal(200);
    const previousDate = new Date();
    previousDate.setDate(previousDate.getDate() - 1);

    const nextDate = new Date();
    nextDate.setDate(previousDate.getDate() + 1);
    const requestBody = {
      startTime: previousDate,
      endTime: nextDate,
    };
    await client
      .post(`${basePath}/send`)
      .set('authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(422);
  });

  async function addNotifications(isGrouped = false, groupKey = '') {
    const notificationToAdd = new Notification({
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
    });

    if (groupKey) {
      notificationToAdd.groupKey = groupKey;
    }
    return client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(notificationToAdd);
  }

  async function draftNotifications(isGrouped = true) {
    let notificationToAdd: Notification;
    if (!isGrouped) {
      notificationToAdd = new Notification({
        body: 'test_body',
        subject: 'subject',
        type: 1,
        options: {
          fromEmail: 'test@test.com',
        },
        sentDate: new Date(),
        receiver: {
          to: [
            {
              type: 1,
              id: '1',
            },
          ],
        },
      });
    } else {
      notificationToAdd = new Notification({
        body: 'test_body',
        groupKey: 'GKTest',
        type: 1,
        options: {},
        sentDate: new Date(),
      });
    }
    return client
      .post(`${basePath}/drafts`)
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
