import {Client, expect, sinon} from '@loopback/testlab';
import {PermissionKey} from '@sourceloop/bpmn-service';
import {TaskPermssionKey} from '../../../enums/permission-key.enum';
import {EventRepository, EventWorkflowRepository} from '../../../repositories';
import {MockEngine} from '../../fixtures/camunda';
import {
  mockEvent,
  mockUnexpectedEvent,
  mockUnmappedEvent,
} from '../../fixtures/mock-data';
import {
  getRepo,
  getToken,
  mockLogger,
  setupApplication,
} from '../../fixtures/test-helper';
import {TestTaskServiceApplication} from '../../fixtures/test.application';
import {MOCK_BPMN_ENGINE_KEY} from '../../fixtures/types';
import {ClientApp, ClientAppRepository} from '../../../connectors/http';
import {TaskServiceBindings} from '../../../keys';
import {IEvent, IOutgoingConnector} from '../../../interfaces';
import {HttpClientService} from '../../../services';

describe('HttpComponent: Acceptance', () => {
  let app: TestTaskServiceApplication;
  let client: Client;
  let engine: MockEngine;
  let logger: ReturnType<typeof mockLogger>;
  let sandbox: sinon.SinonSandbox;
  const testApiKey = new ClientApp({
    apiKey: 'test-app',
    apiSecret: 'test-secret',
    name: 'test-key',
  });

  before('setupApplication', async () => {
    sandbox = sinon.createSandbox();
    logger = mockLogger(sandbox);
    ({app, client} = await setupApplication(logger));
    engine = app.getSync<MockEngine>(MOCK_BPMN_ENGINE_KEY);
    await seedData();
  });

  after(async () => {
    await app.stop();
  });

  beforeEach(() => {
    sandbox.reset();
  });

  it('should handle an event by saving it and triggering mapped workflow', async () => {
    const token = getToken([TaskPermssionKey.TriggerEvent]);
    const stubCommand = sinon.stub();
    stubCommand.returns({});
    engine.subscribe('stub-command', stubCommand);

    // trigger event using the /events/trigger endpoint
    await client
      .post('/events/trigger')
      .set('Authorization', token)
      .send(mockEvent)
      .expect(204);
    const repo = await getRepo<EventRepository>(
      app,
      'repositories.EventRepository',
    );
    const event = await repo.findOne({
      where: {
        key: mockEvent.key,
      },
    });

    // event should be saved
    expect(event).to.containEql(mockEvent);
    expect(stubCommand.calledOnceWith(mockEvent.payload)).to.be.true();
  });

  it('should not handle an event if it is filtered out', async () => {
    const token = getToken([TaskPermssionKey.TriggerEvent]);
    const stubCommand = sinon.stub();
    stubCommand.returns({});
    engine.subscribe('stub-command', stubCommand);

    // trigger event using the /events/trigger endpoint
    await client
      .post('/events/trigger')
      .set('Authorization', token)
      .send(mockUnexpectedEvent)
      .expect(204);
    const repo = await getRepo<EventRepository>(
      app,
      'repositories.EventRepository',
    );
    const event = await repo.findOne({
      where: {
        key: mockUnexpectedEvent.key,
      },
    });

    // event should not be saved
    expect(event).to.be.null();
    expect(stubCommand.notCalled).to.be.true();
  });

  it('should save an event but log error if it is not mapped to a workflow', async () => {
    const token = getToken([TaskPermssionKey.TriggerEvent]);
    const stubCommand = sinon.stub();
    stubCommand.returns({});
    engine.subscribe('stub-command', stubCommand);

    // trigger event using the /events/trigger endpoint
    await client
      .post('/events/trigger')
      .set('Authorization', token)
      .send(mockUnmappedEvent)
      .expect(204);
    const repo = await getRepo<EventRepository>(
      app,
      'repositories.EventRepository',
    );
    const event = await repo.findOne({
      where: {
        key: mockUnmappedEvent.key,
      },
    });

    // event should be saved
    expect(event).to.containEql(mockUnmappedEvent);
    // workflow is not triggered
    expect(stubCommand.notCalled).to.be.true();
    // should have logged an error
    const calls = logger.debug.getCalls();
    expect(calls.length).to.eql(1);
    expect(calls[0].args[0]).to.eql(
      `No mapping found for event ${mockUnmappedEvent.key}`,
    );
  });

  it('should save an event but log error for an event with mapping to a non-existant workflow', async () => {
    const token = getToken([TaskPermssionKey.TriggerEvent]);
    const stubCommand = sinon.stub();
    stubCommand.returns({});
    engine.subscribe('stub-command', stubCommand);
    const workflowKey = 'non-existant-workflow';
    // seed mapping for non-existant workflow
    const mappingRepo = await getRepo<EventWorkflowRepository>(
      app,
      'repositories.EventWorkflowRepository',
    );
    await mappingRepo.create({
      workflowKey,
      eventKey: 'unmapped-event',
    });

    // trigger event using the /events/trigger endpoint
    await client
      .post('/events/trigger')
      .set('Authorization', token)
      .send(mockUnmappedEvent)
      .expect(204);
    const repo = await getRepo<EventRepository>(
      app,
      'repositories.EventRepository',
    );
    const event = await repo.findOne({
      where: {
        key: mockUnmappedEvent.key,
      },
    });

    // event should be saved
    expect(event).to.containEql(mockUnmappedEvent);
    // workflow is not triggered
    expect(stubCommand.notCalled).to.be.true();
    // should have logged an error
    const calls = logger.debug.getCalls();
    expect(calls.length).to.eql(1);
    expect(calls[0].args[0]).to.eql(`No workflow found for key ${workflowKey}`);
  });

  it('should hit subscribed url on publish from output stream', async () => {
    const testEventKey = 'test-event';
    const token = getToken([TaskPermssionKey.SubscribeToWebhook]);

    // create test app
    const repo = await getRepo<ClientAppRepository>(
      app,
      'repositories.ClientAppRepository',
    );
    await repo.create(testApiKey);

    // subcribe to workflow
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
    const stream = await app.get<IOutgoingConnector<IEvent>>(
      TaskServiceBindings.OUTGOING_CONNECTOR,
    );
    const http = await app.get<HttpClientService>(`services.HttpClientService`);
    const postSpy = sinon.stub(http, 'post');
    await stream.publish({
      key: testEventKey,
      payload: {},
      source: 'test',
      timestamp: Date.now(),
    });

    const calls = postSpy.getCalls();
    expect(calls.length).to.eql(1);
  });

  async function seedData() {
    const token = getToken([PermissionKey.CreateWorkflow]);
    const {body: workflow} = await client
      .post('/workflows')
      .set('Authorization', token)
      .send({
        name: 'workflow',
        description: 'test',
        bpmnFile: JSON.stringify(['stub-command']),
        inputSchema: {},
      });

    const repo = await getRepo<EventWorkflowRepository>(
      app,
      'repositories.EventWorkflowRepository',
    );
    await repo.create({
      workflowKey: workflow.externalIdentifier,
      eventKey: 'event',
    });
  }
});
