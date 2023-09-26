import {Client} from '@loopback/testlab';
import {setupApplication} from '../helper';
import {TaskServiceApplication} from '../../application';
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

let apiKey: string;
let apiSecret: string;

describe('TaskServiceController', () => {
  let app: TaskServiceApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  before('generate API keys', async () => {
    // Generate API keys before running the test

    const clientApp = {
      key: 'testApp',
      secret: 'testing',
    };

    const response = await client
      .post('/api-keys')
      .set('Authorization', `Bearer ${token}`)
      .send(clientApp)
      .expect(200);

    apiKey = response.body.apiKey;
    apiSecret = response.body.apiSecret;
  });

  after(async () => {
    await app.stop();
  });

  it('should not be able to update task', async () => {
    const requestBody = {
      taskKey: 'taskKey',
      payload: {},
    };

    await client
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(500);
  });

  it('should subscribe to webhook successfully', async () => {
    const requestBody = {
      url: 'https://example.com/webhook',
      key: 'yourKey',
    };

    await client
      .post('/tasks/subscribe')
      .set('Authorization', `Bearer ${token}`)
      .set('x-api-key', apiKey)
      .set('x-api-secret', apiSecret)
      .send(requestBody)
      .expect(204);
  });

  it('should not subscribe to webhook with invalid API key or secret', async () => {
    const requestBody = {
      url: 'https://example.com/webhook',
      key: 'yourKey',
    };

    await client
      .post('/tasks/subscribe')
      .set('Authorization', `Bearer ${token}`)
      .set('x-api-key', 'invalidKey')
      .set('x-api-secret', 'invalidSecret')
      .send(requestBody)
      .expect(401);
  });

  it('should map task to workflow successfully', async () => {
    const requestBody = {
      taskKey: 'taskKey',
      workflowKey: 'workflowKey',
    };

    await client
      .post('/tasks/mapping')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(204);
  });

  it('should not allow mapping task to workflow with invalid input', async () => {
    const requestBody = {
      task: '',
      workflowKey: 'key',
    };

    await client
      .post('/tasks/mapping')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody)
      .expect(422);
  });
});
