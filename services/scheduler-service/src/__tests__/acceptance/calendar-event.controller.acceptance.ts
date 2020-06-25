import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {CalendarRepository, SubscriptionRepository} from '../../repositories';
import {SchedulerApplication} from '../application';
import {setUpApplication} from './helper';

describe('Calendar Event Controller', () => {
  let app: SchedulerApplication;
  let client: Client;
  let calendarRepo: CalendarRepository;
  let subscriptionRepo: SubscriptionRepository;
  let calendarId: string;
  let subscriptionId: string;
  const pass = 'test_password';
  const testUser = {
    id: 1,
    username: 'test_user',
    password: pass,
    permissions: [
      'ViewEvent',
      'CreateEvent',
      'UpdateEvent',
      'DeleteEvent',
      'CreateCalendar',
      'CreateSubscription',
      'DeleteSubscription',
      'CreateAttendee',
      'ViewAttendee',
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
  beforeEach(setUpMockData);

  it('gives status 422 when data sent is incorrect', async () => {
    const reqData = {invalid: 'dummy'};
    const response = await client
      .post(`/calendars/${calendarId}/events`)
      .set('authorization', `Bearer ${token}`)
      .send(reqData)
      .expect(422);

    expect(response).to.have.property('error');
  });

  it('gives status 401 when no token is passed', async () => {
    const response = await client
      .get(`/calendars/${calendarId}/events`)
      .expect(401);

    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed', async () => {
    await client
      .get(`/calendars/${calendarId}/events`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 200 when filter is passed', async () => {
    await client
      .get(`/calendars/${calendarId}/events?filter[where][deleted]=false`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 200 when valid min max times are passed as query parameters', async () => {
    const timeMin = new Date(2020, 6, 12).toISOString();
    const timeMax = new Date(2020, 6, 13).toISOString();
    await client
      .get(
        `/calendars/${calendarId}/events?timeMin=${timeMin}&timeMax=${timeMax}`,
      )
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 422 when invalid min max times are passed as query parameters', async () => {
    const timeMin = new Date(2020, 6, 14).toISOString();
    const timeMax = new Date(2020, 6, 13).toISOString();
    await client
      .get(
        `/calendars/${calendarId}/events?timeMin=${timeMin}&timeMax=${timeMax}`,
      )
      .set('authorization', `Bearer ${token}`)
      .expect(422);
  });

  it('gives status 404 when primary calendar does not exist', async () => {
    await client
      .get(`/calendars/primary/events`)
      .set('authorization', `Bearer ${token}`)
      .expect(404);
  });

  it('gives status 404 when calendar does not exist', async () => {
    const id = 'c8bf9bcc-b486-11ea-8c6b-1002b57a26e6';
    await client
      .get(`/calendars/${id}/events`)
      .set('authorization', `Bearer ${token}`)
      .expect(404);
  });

  it('gives status 404 when subscription does not exist', async () => {
    await client
      .del(`/subscriptions/${subscriptionId}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);

    await client
      .get(`/calendars/${calendarId}/events`)
      .set('authorization', `Bearer ${token}`)
      .expect(404);
  });

  it('gives status 200 when valid timeMin passed as query parameter', async () => {
    const timeMin = new Date(2020, 6, 12).toISOString();
    await client
      .get(`/calendars/${calendarId}/events?timeMin=${timeMin}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 200 when valid timeMax passed as query parameter', async () => {
    const timeMax = new Date(2020, 6, 12).toISOString();
    await client
      .get(`/calendars/${calendarId}/events?timeMax=${timeMax}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 422 when event details are not correct', async () => {
    const settingsToAdd = {invalid: 'dummy'};

    await client
      .post(`/calendars/${calendarId}/events`)
      .set('authorization', `Bearer ${token}`)
      .send(settingsToAdd)
      .expect(422);
  });

  it('deletes events belonging to a calendarId successfully', async () => {
    await client
      .del(`/calendars/${calendarId}/events`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('updates events belonging to a calendarId successfully', async () => {
    const response = await client
      .patch(`/calendars/${calendarId}/events`)
      .set('authorization', `Bearer ${token}`)
      .send({isFullDayEvent: true})
      .expect(200);
    expect(response.body).to.have.properties('count');
  });

  async function setUpMockData() {
    const calendar = await client
      .post(`/calendars`)
      .set('authorization', `Bearer ${token}`)
      .send({identifier: 'dummy'});

    calendarId = calendar.body.id;

    const subscription = await client
      .post(`/subscriptions`)
      .set('authorization', `Bearer ${token}`)
      .send({identifier: 'dummy', calendarId: calendarId, isPrimary: true});

    subscriptionId = subscription.body.id;

    await client
      .post(`/calendars/${calendarId}/events`)
      .set('authorization', `Bearer ${token}`)
      .send({isFullDayEvent: false, identifier: 'dummy'});
  }

  async function deleteMockData() {
    await calendarRepo.deleteAllHard();
    await subscriptionRepo.deleteAllHard();
  }

  async function givenRepositories() {
    calendarRepo = await app.getRepository(CalendarRepository);
    subscriptionRepo = await app.getRepository(SubscriptionRepository);
  }
});
