import {
  Client,
  createRestAppClient,
  expect,
  givenHttpServerConfig,
} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {CalendarRepository, WorkingHourRepository} from '../../repositories';
import {SchedulerApplication} from '../application';

describe('Calendar Controller', () => {
  let app: SchedulerApplication;
  let client: Client;
  let calendarRepo: CalendarRepository;
  let workingHourRepo: WorkingHourRepository;
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
    // Start Application
    await app.start();
  }

  it('gives status 422 when data sent is incorrect', async () => {
    const reqData = {};
    const response = await client.post(`/calendars`).send(reqData).expect(422);

    expect(response).to.have.property('error');
  });

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(`/calendars`).expect(401);

    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed', async () => {
    await client
      .get(`/calendars`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 422 when calendar details are not correct', async () => {
    const calendarToAdd = {};

    await client
      .post(`/calendars`)
      .set('authorization', `Bearer ${token}`)
      .send(calendarToAdd)
      .expect(422);
  });

  it('gives status 200, calendar detail when calendar is added', async () => {
    const reqToAddCalendar = await addCalendar();

    expect(reqToAddCalendar.status).to.be.equal(200);
    const response = await client
      .get(`/calendars/${reqToAddCalendar.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['ownerEmail']);
    expect(response.body.ownerEmail).to.be.equal('test@gmail.com');
  });

  it('add workinghours when calendar is added', async () => {
    const reqToAddCalendar = await addCalendar();

    const workingHoursResponse = await client
      .get(`/working-hours/${reqToAddCalendar.body.workingHours[0].id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(workingHoursResponse.body).to.have.properties(['dayOfWeek']);
    expect(workingHoursResponse.body.dayOfWeek).to.be.equal(1);
  });

  it('updates calendar successfully using PATCH request', async () => {
    const reqToAddCalendar = await addCalendar();

    const calendarToUpdate = {
      ownerDisplayName: 'updatedName',
    };

    await client
      .patch(`/calendars/${reqToAddCalendar.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(calendarToUpdate)
      .expect(204);

    const response = await client
      .get(`/calendars/${reqToAddCalendar.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['ownerDisplayName']);
    expect(response.body.ownerDisplayName).to.be.equal('updatedName');
  });

  it('updates calendar using PUT request', async () => {
    const reqToAddCalendar = await addCalendar();

    const calendarToUpdate = {
      ownerEmail: 'new@gmail.com',
    };

    await client
      .put(`/calendars/${reqToAddCalendar.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(calendarToUpdate)
      .expect(204);
  });

  it('deletes a calendar successfully', async () => {
    const reqToAddCalendar = await addCalendar();
    await client
      .del(`/calendars/${reqToAddCalendar.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('should return count', async () => {
    await client
      .get(`/calendars/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  async function addCalendar() {
    const calendarToAdd = {
      source: 'internal',
      enableWorkingHours: true,
      location: 'location',
      ownerDisplayName: 'name',
      ownerEmail: 'test@gmail.com',
      summary: 'string',
      timezone: 'ist',
      workingHours: [
        {
          createdOn: '2020-06-06T09:50:34.246Z',
          modifiedOn: '2020-06-06T09:50:33.246Z',
          dayOfWeek: 1,
          end: '09:50:33.246Z',
          start: '09:50:33.246Z',
          calendarId: '',
        },
      ],
    };

    return client
      .post(`/calendars`)
      .set('authorization', `Bearer ${token}`)
      .send(calendarToAdd);
  }

  async function deleteMockData() {
    await calendarRepo.deleteAllHard();
    await workingHourRepo.deleteAllHard();
  }

  async function givenRepositories() {
    calendarRepo = await app.getRepository(CalendarRepository);
    workingHourRepo = await app.getRepository(WorkingHourRepository);
  }
});
