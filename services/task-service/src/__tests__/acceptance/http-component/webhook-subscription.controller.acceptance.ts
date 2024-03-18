import {Client, sinon} from '@loopback/testlab';
import {ClientAppRepository} from '../../../connectors/http';
import {ClientApp} from '../../../connectors/http/models';
import {TaskPermssionKey} from '../../../enums/permission-key.enum';
import {
  getRepo,
  getToken,
  mockLogger,
  setupApplication,
} from '../../fixtures/test-helper';
import {TestTaskServiceApplication} from '../../fixtures/test.application';

describe(`WebhookSubscriptionController: Acceptance`, () => {
  let app: TestTaskServiceApplication;
  let client: Client;
  let logger: ReturnType<typeof mockLogger>;
  let sandbox: sinon.SinonSandbox;
  let stubCommand: sinon.SinonStub;
  const testApiKey = new ClientApp({
    apiKey: 'test-app',
    apiSecret: 'test-secret',
    name: 'test-key',
  });
  const testEventKey = 'test-event';

  before('setupApplication', async () => {
    sandbox = sinon.createSandbox();
    logger = mockLogger(sandbox);
    ({app, client} = await setupApplication(logger));
    // stub a command for task workflow
    stubCommand = sandbox.stub();
    stubCommand.returns({});
    await seedData();
  });

  after(async () => {
    await app.stop();
  });

  it('should create a new webhook subcription', async () => {
    const token = getToken([TaskPermssionKey.SubscribeToWebhook]);
    await client
      .post('/webhooks/subscribe')
      .set('Authorization', token)
      .set('x-api-key', testApiKey.apiKey)
      .set('x-api-secret', testApiKey.apiSecret)
      .send({
        url: 'http://localhost:3000',
        key: testEventKey,
      })
      .expect(204);
  });

  async function seedData() {
    const repo = await getRepo<ClientAppRepository>(
      app,
      'repositories.ClientAppRepository',
    );
    await repo.create(testApiKey);
  }
});
