import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {CalendarRepository} from '../../repositories';
import {SchedulerApplication} from '../application';
import {setUpApplication} from './helper';

describe('Calendar-WorkingHour Controller', () => {
  let app: SchedulerApplication;
  let client: Client;
  let calendarRepo: CalendarRepository;
  let calendarId: string;

  const pass = 'test_password';
  const testUser = {
    id: 1,
    username: 'test_user',
    password: pass,
    permissions: [
      'ViewWorkingHour',
      'CreateWorkingHour',
      'UpdateWorkingHour',
      'DeleteWorkingHour',
      'CreateCalendar',
      'ViewCalendar',
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
  before(setUpMockData);

  it('gives status 422 when data sent is incorrect', async () => {
    const reqData = {invalid: 'dummy'};
    const response = await client
      .post(`/calendars/${calendarId}/working-hours`)
      .set('authorization', `Bearer ${token}`)
      .send(reqData)
      .expect(422);

    expect(response).to.have.property('error');
  });

  it('gives status 401 when no token is passed', async () => {
    const response = await client
      .get(`/calendars/${calendarId}/working-hours`)
      .expect(401);

    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed', async () => {
    await client
      .get(`/calendars/${calendarId}/working-hours`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 422 when workingHour details are not correct', async () => {
    const workingHourToAdd = {invalid: 'dummy'};

    await client
      .post(`/calendars/${calendarId}/working-hours`)
      .set('authorization', `Bearer ${token}`)
      .send(workingHourToAdd)
      .expect(422);
  });

  it('deletes working-hours belonging to a calendarId successfully', async () => {
    await client
      .del(`/calendars/${calendarId}/working-hours`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('updates working-hours belonging to a calendarId successfully', async () => {
    const response = await client
      .patch(`/calendars/${calendarId}/working-hours`)
      .set('authorization', `Bearer ${token}`)
      .send({dayOfWeek: 1})
      .expect(200);
    expect(response.body).to.have.properties('count');
  });

  async function setUpMockData() {
    const calendar = await client
      .post(`/calendars`)
      .set('authorization', `Bearer ${token}`)
      .send({identifier: 'dummy'});

    calendarId = calendar.body.id;

    await client
      .post(`/calendars/${calendarId}/working-hours`)
      .set('authorization', `Bearer ${token}`)
      .send({identifier: 'dummy'});
  }

  async function deleteMockData() {
    await calendarRepo.deleteAllHard();
  }

  async function givenRepositories() {
    calendarRepo = await app.getRepository(CalendarRepository);
  }
});
