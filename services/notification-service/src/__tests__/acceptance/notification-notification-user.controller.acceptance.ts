// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {NotificationRepository} from '../../repositories';
import {NotificationApplication} from '../application';
import {setUpApplication} from './helper';

describe('Notification Notification User Controller', () => {
  let app: NotificationApplication;
  let client: Client;
  let notificationRepo: NotificationRepository;
  const basePath = '/notifications/{id}/notification-users';
  const pass = 'test_password';
  const testUser = {
    id: 1,
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

  it('gives status 200 and check properties exist with response', async () => {
    const response = await client
      .get(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response).to.have.properties(['res', 'req']);
  });

  it('updates notification successfully using PATCH request', async () => {
    const notificationToUpdate = {
      body: 'updated-body',
    };

    await client
      .patch(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .send(notificationToUpdate)
      .expect(200);

    const response = await client
      .get(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response).to.have.properties(['res', 'req']);
  });

  it('deletes a notification successfully', async () => {
    await client
      .del(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  async function deleteMockData() {
    await notificationRepo.deleteAll();
  }

  async function givenRepositories() {
    notificationRepo = await app.getRepository(NotificationRepository);
  }
});
