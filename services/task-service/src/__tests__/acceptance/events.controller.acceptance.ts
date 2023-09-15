import {Client} from '@loopback/testlab';
import {setupApplication} from '../helper';
import {TaskServiceApplication} from '../../application';
import * as jwt from 'jsonwebtoken';

const testUser = {
  id: 1,
  username: 'test_user',
  password: 'test_pass',
  permissions: ['StartListening', 'StopListening', 'AddToQueue', 'APIAdmin'],
};

const eventMapping = '/events/mapping';

const token = jwt.sign(testUser, 'task-Service-Secret', {
  expiresIn: 180000,
  issuer: 'sf',
});

describe('Events Mapping Controller', () => {
  let app: TaskServiceApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('should successfully map task to workflow', async () => {
    const requestBody = {
      eventKey: 'testEventKey1',
      workflowKey: 'testWorkflowKey1',
    };

    await client
      .post(eventMapping)
      .send(requestBody)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('should return 422 error when eventKey is missing', async () => {
    const requestBody = {
      workflowKey: 'testWorkflowKey2',
    };

    await client
      .post(eventMapping)
      .send(requestBody)
      .set('Authorization', `Bearer ${token}`)
      .expect(422);
  });

  it('should return 422 error when workflowKey is missing', async () => {
    const requestBody = {
      eventKey: 'testEventKey3',
    };

    await client
      .post(eventMapping)
      .send(requestBody)
      .set('Authorization', `Bearer ${token}`)
      .expect(422);
  });

  it('should return 422 error when both eventKey and workflowKey are missing', async () => {
    const requestBody = {};

    await client
      .post(eventMapping)
      .send(requestBody)
      .set('Authorization', `Bearer ${token}`)
      .expect(422);
  });
});
