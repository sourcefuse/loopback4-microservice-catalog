import {Client, expect, createRestAppClient, givenHttpServerConfig} from '@loopback/testlab';
import {SchedulerApplication} from '../application';
import {SettingsRepository} from '../../repositories';
import * as jwt from 'jsonwebtoken';

describe('Settings Controller', () => {
  let app: SchedulerApplication;
  let client: Client;
  let settingsRepo: SettingsRepository;
  const pass = 'test_password';
  const testUser = {
    id: 1,
    username: 'test_user',
    password: pass,
    permissions: [
      'NotAllowed',
      'ViewSubscription',
      'CreateSubscription',
      'UpdateSubscription',
      'DeleteSubscription',
      'ViewEvent',
      'CreateEvent',
      'UpdateEvent',
      'DeleteEvent',
      'ViewCalendar',
      'CreateCalendar',
      'UpdateCalendar',
      'DeleteCalendar',
      'ViewAttachment',
      'CreateAttachment',
      'UpdateAttachment',
      'DeleteAttachment',
      'ViewAttendee',
      'CreateAttendee',
      'UpdateAttendee',
      'DeleteAttendee',
      'ViewSettings',
      'CreateSettings',
      'UpdateSettings',
      'DeleteSettings',
      'ViewTheme',
      'CreateTheme',
      'UpdateTheme',
      'DeleteTheme',
      'ViewWorkingHour',
      'CreateWorkingHour',
      'UpdateWorkingHour',
      'DeleteWorkingHour',
    ],
  };

  const token = jwt.sign(testUser, 'kdskssdkdfs', {
    expiresIn: 180000,
    issuer: 'rashi',
  });

  before(givenRunningApplicationWithCustomConfiguration);
  after(async () => {
    await app.stop();
  });
  before(givenRepositories);
  before(() => {
    client = createRestAppClient(app);
  });
  afterEach(deleteMockData);

  async function givenRunningApplicationWithCustomConfiguration() {
    app = new SchedulerApplication({
      rest: givenHttpServerConfig(),
    });

    await app.boot();
    
    app.bind('datasources.config.schedulerDb').to({
      name: 'pgdb',
      connector: 'memory',
    });
    // Start Application
    await app.start();
  }
  
  it('gives status 422 when data sent is incorrect', async () => {
    const reqData = {};
    const response = await client.post(`/settings`).send(reqData).expect(422);

    expect(response).to.have.property('error');
  });

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(`/settings`).expect(401);

    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed', async () => {
    await client
      .get(`/settings`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 422 when settings details are not correct', async () => {
    const settingsToAdd = {};

    await client
      .post(`/settings`)
      .set('authorization', `Bearer ${token}`)
      .send(settingsToAdd)
      .expect(422);
  });

  it('gives status 200 and settings detail when settings is added', async () => {
    const reqToAddSetting = await addSetting();
    expect(reqToAddSetting.status).to.be.equal(200);

    const response = await client
      .get(`/settings/${reqToAddSetting.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body).to.have.properties(['ownerId']);
    expect(response.body.ownerId).to.be.equal('ownerid');
  });

  it('updates settings successfully using PATCH request', async () => {
    const reqToAddSettings = await addSetting();

    const settingToUpdate = {
      ownerId: 'updatedId',
    };

    await client
      .patch(`/settings/${reqToAddSettings.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(settingToUpdate)
      .expect(204);

    const response = await client
      .get(`/settings/${reqToAddSettings.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['ownerId']);
    expect(response.body.ownerId).to.be.equal('updatedId');
  });

  it('updates settings using PUT request', async () => {
    const reqToAddSettings = await addSetting();

    const settingToUpdate = {
      ownerId: 'updatedId',
    };

    await client
      .put(`/settings/${reqToAddSettings.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(settingToUpdate)
      .expect(204);

    const response = await client
      .get(`/settings/${reqToAddSettings.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['ownerId']);
    expect(response.body.ownerId).to.be.equal('updatedId');
  });

  it('deletes a setting successfully', async () => {
    const reqToAddSettings = await addSetting();
    await client
      .del(`/settings/${reqToAddSettings.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('should return count', async () => {
    await client
      .get(`/settings/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  async function addSetting() {
    const settingsToAdd = {
      ownerId: 'ownerid',
      ownerType: 'global',
      settingName: 'string',
      settingValue: 'string',
    };

    const reqToAddSetting = await client
      .post(`/settings`)
      .set('authorization', `Bearer ${token}`)
      .send(settingsToAdd);

    return reqToAddSetting;
  }

  async function deleteMockData() {
    await settingsRepo.deleteAllHard();
  }

  async function givenRepositories() {
    settingsRepo = await app.getRepository(SettingsRepository);
  }
});
