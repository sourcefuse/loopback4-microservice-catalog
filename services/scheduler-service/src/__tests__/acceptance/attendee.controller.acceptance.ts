import {
  Client,
  createRestAppClient,
  expect,
  givenHttpServerConfig,
} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {AttendeeRepository} from '../../repositories';
import {SchedulerApplication} from '../application';

describe('Attendee Controller', () => {
  let app: SchedulerApplication;
  let client: Client;
  let attendeeRepo: AttendeeRepository;
  const basePath = '/attendees';
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
    issuer: 'sf',
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
    await app.start();
  }

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

  it('gives status 200 and enitity detail when enitity is added', async () => {
    const reqToAddEntity = await addEntity();
    expect(reqToAddEntity.status).to.be.equal(200);

    const response = await client
      .get(`${basePath}/${reqToAddEntity.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body).to.have.properties(['email']);
    expect(response.body.email).to.be.equal('test@gmail.com');
  });

  it('updates enitity successfully using PATCH request', async () => {
    const reqToAddEntity = await addEntity();
    const email = 'updated@gmail.com';
    const entityToUpdate = {
      email: email,
      eventId: 'event-id',
    };

    await client
      .patch(`${basePath}/${reqToAddEntity.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(entityToUpdate)
      .expect(204);

    const response = await client
      .get(`${basePath}/${reqToAddEntity.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['email']);
    expect(response.body.email).to.be.equal(email);
  });

  it('updates entity using PUT request', async () => {
    const reqToAddEntity = await addEntity();
    const email = 'updated@gmail.com';
    const entityToUpdate = {
      email: email,
      eventId: 'event-id',
    };

    await client
      .put(`${basePath}/${reqToAddEntity.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(entityToUpdate)
      .expect(204);

    const response = await client
      .get(`${basePath}/${reqToAddEntity.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['email']);
    expect(response.body.email).to.be.equal(email);
  });

  it('deletes a setting successfully', async () => {
    const reqToAddEntity = await addEntity();
    await client
      .del(`${basePath}/${reqToAddEntity.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('should return count', async () => {
    await client
      .get(`${basePath}/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  async function addEntity() {
    const enitityToAdd = {
      email: 'test@gmail.com',
      eventId: 'event-id',
    };

    return client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(enitityToAdd);
  }

  async function deleteMockData() {
    await attendeeRepo.deleteAllHard();
  }

  async function givenRepositories() {
    attendeeRepo = await app.getRepository(AttendeeRepository);
  }
});
