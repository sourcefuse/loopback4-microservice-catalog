import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {EventRepository} from '../../repositories';
import {SchedulerApplication} from '../application';
import {setUpApplication} from './helper';

describe('Event-Attachment Controller', () => {
  let app: SchedulerApplication;
  let client: Client;
  let eventRepo: EventRepository;
  let eventId: string;

  const pass = 'test_password';
  const testUser = {
    id: 1,
    username: 'test_user',
    password: pass,
    permissions: [
      'ViewAttachment',
      'CreateAttachment',
      'UpdateAttachment',
      'DeleteAttachment',
      'CreateEvent',
      'ViewEvent',
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
      .post(`/events/${eventId}/attachments`)
      .set('authorization', `Bearer ${token}`)
      .send(reqData)
      .expect(422);

    expect(response).to.have.property('error');
  });

  it('gives status 401 when no token is passed', async () => {
    const response = await client
      .get(`/events/${eventId}/attachments`)
      .expect(401);

    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed', async () => {
    await client
      .get(`/events/${eventId}/attachments`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 422 when attachment details are not correct', async () => {
    const attachmentToAdd = {invalid: 'dummy'};

    await client
      .post(`/events/${eventId}/attachments`)
      .set('authorization', `Bearer ${token}`)
      .send(attachmentToAdd)
      .expect(422);
  });

  it('deletes attachments belonging to a eventId successfully', async () => {
    await client
      .del(`/events/${eventId}/attachments`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('updates attachments belonging to a eventId successfully', async () => {
    const response = await client
      .patch(`/events/${eventId}/attachments`)
      .set('authorization', `Bearer ${token}`)
      .send({fileUrl: 'dummy'})
      .expect(200);
    expect(response.body).to.have.properties('count');
  });

  async function setUpMockData() {
    const event = await client
      .post(`/events`)
      .set('authorization', `Bearer ${token}`)
      .send({identifier: 'dummy'});

    eventId = event.body.id;

    await client
      .post(`/events/${eventId}/attachments`)
      .set('authorization', `Bearer ${token}`)
      .send({identifier: 'dummy'});
  }

  async function deleteMockData() {
    await eventRepo.deleteAllHard();
  }

  async function givenRepositories() {
    eventRepo = await app.getRepository(EventRepository);
  }
});
