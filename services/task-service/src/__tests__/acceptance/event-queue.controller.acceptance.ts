import {Client, expect} from '@loopback/testlab';
import {setupApplication} from '../helper';
import {TaskServiceApplication} from '../../application';
import {samplePayload} from '../data';
import * as jwt from 'jsonwebtoken';

const testUser = {
  id: 1,
  username: 'test_user',
  password: 'test_pass',
  permissions: ['1', '2', '3', '4'],
};

const token = jwt.sign(testUser, 'task-Service-Secret', {
  expiresIn: 180000,
  issuer: 'sf',
});

describe('EventQueueController', () => {
  let app: TaskServiceApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('gives status 401 when no token is passed', async () => {
    const response = await client.post('/event-queue/enqueue').expect(401);
    expect(response).to.have.property('error');
  });

  it('enqueueEvent successfully', async () => {
    const eventPayload = {
      ...samplePayload,
    };

    await client
      .post('/event-queue/enqueue')
      .set('authorization', `Bearer ${token}`)
      .send(eventPayload)
      .expect(204); // No Content status
  });
});
