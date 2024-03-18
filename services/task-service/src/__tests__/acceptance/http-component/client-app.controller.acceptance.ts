import {Client, sinon} from '@loopback/testlab';
import {TaskPermssionKey} from '../../../enums/permission-key.enum';
import {ClientAppDTO} from '../../../models';
import {
  getToken,
  mockLogger,
  setupApplication,
} from '../../fixtures/test-helper';
import {TestTaskServiceApplication} from '../../fixtures/test.application';

describe(`ClientAppController: Acceptance`, () => {
  let app: TestTaskServiceApplication;
  let client: Client;
  let logger: ReturnType<typeof mockLogger>;
  let sandbox: sinon.SinonSandbox;
  let stubCommand: sinon.SinonStub;
  const mockDto = new ClientAppDTO({
    clientName: 'test-app',
  });
  before('setupApplication', async () => {
    sandbox = sinon.createSandbox();
    logger = mockLogger(sandbox);
    ({app, client} = await setupApplication(logger));
    // stub a command for task workflow
    stubCommand = sandbox.stub();
    stubCommand.returns({});
  });

  after(async () => {
    await app.stop();
  });

  it('should create a client app key', async () => {
    const token = getToken([TaskPermssionKey.CreateApiKey]);
    await client
      .post('/client-app')
      .set('Authorization', token)
      .send(mockDto)
      .expect(200);
  });
});
