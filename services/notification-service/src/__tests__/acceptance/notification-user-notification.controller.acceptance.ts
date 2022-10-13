// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {NotificationUserRepository} from '../../repositories';
import {NotificationApplication} from '../application';
import {setUpApplication} from './helper';

describe('Notification User Notification Controller', () => {
  let app: NotificationApplication;
  let client: Client;
  let notificationUserRepo: NotificationUserRepository;
  const basePath = '/notification-users/{id}/notification';
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

  it('gives status 404 when token is passed for non presence of entity', async () => {
    const response = await client
      .get(basePath)
      .set('authorization', `Bearer ${token}`)
      .expect(404);

    expect(response).to.have.property('error');
  });

  async function deleteMockData() {
    await notificationUserRepo.deleteAll();
  }

  async function givenRepositories() {
    notificationUserRepo = await app.getRepository(NotificationUserRepository);
  }
});
