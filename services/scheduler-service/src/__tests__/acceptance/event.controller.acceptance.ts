import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {
  AttachmentRepository,
  AttendeeRepository,
  CalendarRepository,
  EventRepository,
} from '../../repositories';
import {SchedulerApplication} from '../application';
import {setUpApplication} from './helper';

describe('Event Controller', () => {
  let app: SchedulerApplication;
  let client: Client;
  let eventRepo: EventRepository;
  let attendeeRepo: AttendeeRepository;
  let attachmentRepo: AttachmentRepository;
  let calendarRepo: CalendarRepository;
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

  it('gives status 422 when data sent is incorrect', async () => {
    const reqData = {};
    const response = await client.post(`/events`).send(reqData).expect(422);

    expect(response).to.have.property('error');
  });

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(`/events`).expect(401);

    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed', async () => {
    await client
      .get(`/events`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 422 when event details are not correct', async () => {
    const eventToAdd = {};

    await client
      .post(`/events`)
      .set('authorization', `Bearer ${token}`)
      .send(eventToAdd)
      .expect(422);
  });

  it('gives status 404 when calendarId does not exist on POST', async () => {
    const eventToAdd = {calendarId: 'invalid'};

    await client
      .post(`/events`)
      .set('authorization', `Bearer ${token}`)
      .send(eventToAdd)
      .expect(404);
  });

  it('gives status 404 when parentEventId does not exist', async () => {
    const calendar = await client
      .post(`/calendars`)
      .set('authorization', `Bearer ${token}`)
      .send({ownerEmail: 'dummy'});
    const eventToAdd = {calendarId: calendar.body.id, parentEventId: 'invalid'};
    await client
      .post(`/events`)
      .set('authorization', `Bearer ${token}`)
      .send(eventToAdd)
      .expect(404);
  });

  it('gives status 200 when event is added', async () => {
    const reqToAddEvent = await addEvent();
    expect(reqToAddEvent.status).to.be.equal(200);
    const response = await client
      .get(`/events/${reqToAddEvent.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['isFullDayEvent']);
    expect(response.body.isFullDayEvent).to.be.equal(false);
  });

  it('gives status 200, when an event with attachments and attendees is added', async () => {
    const reqToAddEvent = await addEventWithRelation();

    expect(reqToAddEvent.status).to.be.equal(200);
    const response = await client
      .get(`/events/${reqToAddEvent.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['isFullDayEvent']);
    expect(response.body.isFullDayEvent).to.be.equal(false);
  });

  it('updates event successfully using PATCH request', async () => {
    const reqToAddEvent = await addEvent();

    const eventToUpdate = {
      isFullDayEvent: true,
    };

    await client
      .patch(`/events/${reqToAddEvent.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(eventToUpdate)
      .expect(204);

    const response = await client
      .get(`/events/${reqToAddEvent.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['isFullDayEvent']);
    expect(response.body.isFullDayEvent).to.be.equal(true);
  });

  it('updates event using PUT request', async () => {
    const reqToAddEvent = await addEvent();
    const eventToUpdate = {
      calendarId: reqToAddEvent.body.calendarId,
      isFullDayEvent: true,
    };

    await client
      .put(`/events/${reqToAddEvent.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(eventToUpdate)
      .expect(204);
  });

  it('gives status 404 when calendarId does not exist on PUT request', async () => {
    const reqToAddEvent = await addEvent();
    const eventToUpdate = {
      calendarId: 'invalid',
      isFullDayEvent: true,
    };
    await client
      .put(`/events/${reqToAddEvent.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(eventToUpdate)
      .expect(404);
  });

  it('updates event with attendees and attachments using PUT request', async () => {
    const reqToAddEvent = await addEventWithRelation();
    const eventToUpdate = {
      calendarId: reqToAddEvent.body.calendarId,
      isFullDayEvent: true,
      attachments: [
        {
          id: reqToAddEvent.body.attachments[0].id,
          fileUrl: 'dummy',
          eventId: reqToAddEvent.body.attachments[0].eventId,
        },
      ],
      attendees: [
        {
          id: reqToAddEvent.body.attendees[0].id,
          eventId: reqToAddEvent.body.attendees[0].eventId,
          email: 'dummy',
        },
      ],
    };

    await client
      .put(`/events/${reqToAddEvent.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(eventToUpdate)
      .expect(204);
  });

  it('deletes a event successfully', async () => {
    const reqToAddEvent = await addEvent();
    await client
      .del(`/events/${reqToAddEvent.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('should return count', async () => {
    await client
      .get(`/events/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  async function addEvent() {
    const calendar = await client
      .post(`/calendars`)
      .set('authorization', `Bearer ${token}`)
      .send({ownerEmail: 'dummy'});

    const eventToAdd = {
      calendarId: calendar.body.id,
      isFullDayEvent: false,
    };
    return client
      .post(`/events`)
      .set('authorization', `Bearer ${token}`)
      .send(eventToAdd);
  }

  async function addEventWithRelation() {
    const calendar = await client
      .post(`/calendars`)
      .set('authorization', `Bearer ${token}`)
      .send({ownerEmail: 'dummy'});

    const eventToAdd = {
      calendarId: calendar.body.id,
      isFullDayEvent: false,
      attachments: [{fileUrl: 'dummy', eventId: ''}],
      attendees: [{eventId: '', email: 'dummy'}],
    };
    return client
      .post(`/events`)
      .set('authorization', `Bearer ${token}`)
      .send(eventToAdd);
  }

  async function deleteMockData() {
    await eventRepo.deleteAllHard();
    await attendeeRepo.deleteAllHard();
    await attachmentRepo.deleteAllHard();
    await calendarRepo.deleteAllHard();
  }

  async function givenRepositories() {
    eventRepo = await app.getRepository(EventRepository);
    attendeeRepo = await app.getRepository(AttendeeRepository);
    attachmentRepo = await app.getRepository(AttachmentRepository);
    calendarRepo = await app.getRepository(CalendarRepository);
  }
});
