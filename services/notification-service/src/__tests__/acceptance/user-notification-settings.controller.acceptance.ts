// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {UserNotificationSettings} from '../../models';
import {UserNotificationSettingsRepository} from '../../repositories';
import {NotificationApplication} from '../application';
import {setUpApplication} from './helper';

const currentDate = new Date();
const nextDate = new Date();
nextDate.setDate(nextDate.getDate() + 1);
describe('User Notification Settings Controller', () => {
  let app: NotificationApplication;
  let client: Client;
  let userNotificationSettingsRepo: UserNotificationSettingsRepository;
  const basePath = '/user-notification-settings';
  const pass = 'test_password';
  const testUser = {
    id: '1',
    username: 'test_user',
    password: pass,
    permissions: [
      'CreateNotificationUserSettings',
      'ViewNotificationUserSettings',
      'UpdateNotificationUserSettings',
      'DeleteNotificationUserSettings',
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
    const reqToAddUserNotificationSettings =
      await addUserNotificationSettings();
    expect(reqToAddUserNotificationSettings.status).to.be.equal(200);
    const response = await client
      .get(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response).to.have.properties(['res', 'req']);
  });

  it('updates user notification settings successfully using PATCH request', async () => {
    const notificationToUpdate = {
      sleepStartTime: nextDate,
      sleepEndTime: nextDate,
      type: 1,
    };

    const response = await client
      .patch(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .send(notificationToUpdate)
      .expect(200);

    expect(response).to.have.properties(['res', 'req']);
  });

  it('updates user notification settings successfully using PATCH request with id', async () => {
    const reqToAddNotificationUser = await addUserNotificationSettings();
    const notificationToUpdate = {
      sleepStartTime: nextDate,
      sleepEndTime: nextDate,
      type: 1,
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

  it('Deletes a user notification setting successfully', async () => {
    const reqToAddNotificationUser = await addUserNotificationSettings();
    await client
      .del(`${basePath}/${reqToAddNotificationUser.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('should return count', async () => {
    await client
      .get(`${basePath}/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  async function addUserNotificationSettings() {
    const userNotificationSettingsToAdd = new UserNotificationSettings({
      userId: '1',
      type: 1,
      sleepStartTime: currentDate,
      sleepEndTime: currentDate,
    });
    return client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(userNotificationSettingsToAdd);
  }

  async function deleteMockData() {
    await userNotificationSettingsRepo.deleteAll();
  }

  async function givenRepositories() {
    userNotificationSettingsRepo = await app.getRepository(
      UserNotificationSettingsRepository,
    );
  }
});
