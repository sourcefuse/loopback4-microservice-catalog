import {Client, expect} from '@loopback/testlab';
import {setupApplication} from '../helper';
import {TaskServiceApplication} from '../../application';
import * as jwt from 'jsonwebtoken';

const testUser = {
  id: 1,
  username: 'test_user',
  password: 'test_pass',
  permissions: ['StartListening', 'StopListening', 'AddToQueue', 'APIAdmin'],
};

const token = jwt.sign(testUser, 'task-Service-Secret', {
  expiresIn: 180000,
  issuer: 'sf',
});

describe('APIKey Controller', () => {
  let app: TaskServiceApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('should generate API keys successfully', async () => {
    const clientApp = {
      key: 'testApp',
      secret: 'testAppDescription',
    };

    const response = await client
      .post('/api-keys')
      .set('Authorization', `Bearer ${token}`)
      .send(clientApp)
      .expect(200);

    expect(response.body).to.have.properties(['apiKey', 'apiSecret']);
  });

  it('should not allow generating API keys with invalid input', async () => {
    const clientApp = {
      key: '',
      description: 'testAppDescription',
    };

    await client
      .post('/api-keys')
      .set('Authorization', `Bearer ${token}`)
      .send(clientApp)
      .expect(422);
  });
});
