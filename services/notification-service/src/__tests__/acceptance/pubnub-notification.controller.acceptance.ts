// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {NotificationAccessRepository} from '../../repositories';
import {NotificationApplication} from '../application';
import {setUpApplication} from './helper';

describe('Pubnub Notification Controller', () => {
  let app: NotificationApplication;
  let client: Client;
  let notificationAccessRepo: NotificationAccessRepository;
  const userId = 'test_id';
  const basePath = `/notifications/access/${userId}`;
  const pass = 'test_password';
  const testUser = {
    id: '1',
    username: 'test_user',
    password: pass,
    permissions: ['CanGetNotificationAccess'],
  };

  const token = jwt.sign(testUser, 'kdskssdkdfs', {
    expiresIn: 180000,
    issuer: 'sf',
  });

  const notif = {
    receiver: {
      to: [
        {
          type: 0,
          id: 'test_id',
        },
      ],
    },
    type: 0,
  };

  before('setupApplication', async () => {
    ({app, client} = await setUpApplication());
  });
  after(async () => {
    await app.stop();
  });

  before(givenRepositories);
  after(deleteMockData);

  it('gives status 401 when no token is passed', async () => {
    const response = await client
      .patch(basePath)
      .set('pubnubToken', 'test_token')
      .send(notif)
      .expect(401);

    expect(response).to.have.property('error');
  });

  it('gives status 403 when token is passed for channel not allowing access', async () => {
    await client
      .patch(basePath)
      .set('authorization', `Bearer ${token}`)
      .set('pubnubToken', 'test_token')
      .send(notif)
      .expect(403);
  });

  async function deleteMockData() {
    await notificationAccessRepo.deleteAll();
  }

  async function givenRepositories() {
    notificationAccessRepo = await app.getRepository(
      NotificationAccessRepository,
    );
  }
});
