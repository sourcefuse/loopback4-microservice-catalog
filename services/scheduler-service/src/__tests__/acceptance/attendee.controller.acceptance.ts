import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {AttendeeRepository} from '../../repositories';
import {SchedulerApplication} from '../application';
import {setUpApplication} from './helper';

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
      'ViewAttendee',
      'CreateAttendee',
      'UpdateAttendee',
      'DeleteAttendee',
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

  it('gives status 200 and enitity detail when enitity is added', async () => {
    const reqToAddEntity = await addEntity();
    expect(reqToAddEntity.status).to.be.equal(200);

    const response = await client
      .get(`${basePath}/${reqToAddEntity.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body).to.have.properties(['identifier']);
    expect(response.body.identifier).to.be.equal('test@gmail.com');
  });

  it('updates enitity successfully using PATCH request', async () => {
    const reqToAddEntity = await addEntity();
    const identifier = 'updated@gmail.com';
    const entityToUpdate = {
      identifier,
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

    expect(response.body).to.have.properties(['identifier']);
    expect(response.body.identifier).to.be.equal(identifier);
  });

  it('updates entity using PUT request', async () => {
    const reqToAddEntity = await addEntity();
    const identifier = 'updated@gmail.com';
    const entityToUpdate = {
      identifier,
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

    expect(response.body).to.have.properties(['identifier']);
    expect(response.body.identifier).to.be.equal(identifier);
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
      identifier: 'test@gmail.com',
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
