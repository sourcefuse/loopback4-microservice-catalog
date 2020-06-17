import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {WorkingHour} from '../../models';
import {WorkingHourRepository} from '../../repositories';
import {SchedulerApplication} from '../application';
import {setUpApplication} from './helper';

describe('WorkingHour Controller', () => {
  let app: SchedulerApplication;
  let client: Client;
  let workingHourRepo: WorkingHourRepository;
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
    const response = await client
      .post(`/working-hours`)
      .send(reqData)
      .expect(422);

    expect(response).to.have.property('error');
  });

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(`/working-hours`).expect(401);

    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed', async () => {
    await client
      .get(`/working-hours`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 422 when workingHour details are not correct', async () => {
    const workingHourToAdd = {};

    await client
      .post(`/working-hours`)
      .set('authorization', `Bearer ${token}`)
      .send(workingHourToAdd)
      .expect(422);
  });

  it('gives status 200 and workingHour detail when workingHour is added', async () => {
    const reqToAddWorkingHour = await addWorkingHour();
    expect(reqToAddWorkingHour.status).to.be.equal(200);

    const response = await client
      .get(`/working-hours/${reqToAddWorkingHour.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body).to.have.properties(['calendarId']);
    expect(response.body.calendarId).to.be.equal('dummy');
  });

  it('updates workingHour successfully using PATCH request', async () => {
    const reqToAddWorkingHour = await addWorkingHour();

    const workingHourToUpdate = {
      calendarId: 'updatedId',
    };

    await client
      .patch(`/working-hours/${reqToAddWorkingHour.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(workingHourToUpdate)
      .expect(204);

    const response = await client
      .get(`/working-hours/${reqToAddWorkingHour.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['calendarId']);
    expect(response.body.calendarId).to.be.equal('updatedId');
  });

  it('updates workingHour using PUT request', async () => {
    const reqToAddWorkingHour = await addWorkingHour();

    const workingHourToUpdate = {
      calendarId: 'updatedId',
    };

    await client
      .put(`/working-hours/${reqToAddWorkingHour.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(workingHourToUpdate)
      .expect(204);

    const response = await client
      .get(`/working-hours/${reqToAddWorkingHour.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['calendarId']);
    expect(response.body.calendarId).to.be.equal('updatedId');
  });

  it('deletes a workingHour successfully', async () => {
    const reqToAddWorkingHour = await addWorkingHour();
    await client
      .del(`/working-hours/${reqToAddWorkingHour.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('should return count', async () => {
    await client
      .get(`/working-hours/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  async function addWorkingHour() {
    const workingHourToAdd = new WorkingHour({
      calendarId: 'dummy',
      dayOfWeek: 1,
    });

    return client
      .post(`/working-hours`)
      .set('authorization', `Bearer ${token}`)
      .send(workingHourToAdd);
  }

  async function deleteMockData() {
    await workingHourRepo.deleteAllHard();
  }

  async function givenRepositories() {
    workingHourRepo = await app.getRepository(WorkingHourRepository);
  }
});
