import {Client, expect, givenHttpServerConfig, createRestAppClient} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {SchedulerApplication} from '../application';
import {ThemeRepository} from '../../repositories';

describe('Theme Controller', () => {
  let app: SchedulerApplication;
  let client: Client;
  let themeRepo: ThemeRepository;
  const apiUrl = '/themes';
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
  
  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(apiUrl).expect(401);

    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed', async () => {
    await client
      .get(apiUrl)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 200 and enitity detail when enitity is added', async () => {
    const reqToAddEntity = await addEntity();
    expect(reqToAddEntity.status).to.be.equal(200);

    const response = await client
      .get(`${apiUrl}/${reqToAddEntity.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body).to.have.properties(['calBg']);
    expect(response.body.calBg).to.be.equal('red');
  });

  it('updates enitity successfully using PATCH request', async () => {
    const reqToAddEntity = await addEntity();

    const entityToUpdate = {
      calBg: 'yellow',
    };

    await client
      .patch(`${apiUrl}/${reqToAddEntity.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(entityToUpdate)
      .expect(204);

    const response = await client
      .get(`${apiUrl}/${reqToAddEntity.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['calBg']);
    expect(response.body.calBg).to.be.equal('yellow');
  });

  it('updates entity using PUT request', async () => {
    const reqToAddEntity = await addEntity();

    const entityToUpdate = {
      calBg: 'yellow',
    };

    await client
      .put(`${apiUrl}/${reqToAddEntity.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(entityToUpdate)
      .expect(204);

    const response = await client
      .get(`${apiUrl}/${reqToAddEntity.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['calBg']);
    expect(response.body.calBg).to.be.equal('yellow');
  });

  it('deletes a setting successfully', async () => {
    const reqToAddEntity = await addEntity();
    await client
      .del(`${apiUrl}/${reqToAddEntity.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('should return count', async () => {
    await client
      .get(`${apiUrl}/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  async function addEntity() {
    const enitityToAdd = {
      calBg: 'red',
      calFg: 'green',
    };

    const reqToAddEntity = await client
      .post(apiUrl)
      .set('authorization', `Bearer ${token}`)
      .send(enitityToAdd);

    return reqToAddEntity;
  }

  async function deleteMockData() {
    await themeRepo.deleteAllHard();
  }

  async function givenRepositories() {
    themeRepo = await app.getRepository(ThemeRepository);
  }
});
