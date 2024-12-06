import {Client, expect, sinon} from '@loopback/testlab';
import {PermissionKey} from '@sourceloop/bpmn-service';
import {JwtKeysRepository} from '@sourceloop/core';
import {generateKeyPairSync} from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as jose from 'node-jose';
import {CreateTaskCommand} from '../../../commands';
import {TaskRepository, TaskWorkFlowRepository} from '../../../repositories';
import {TaskStatus} from '../../../types';
import {MockEngine} from '../../fixtures/camunda';
import {mockTasks} from '../../fixtures/mock-data';
import {
  clearRepo,
  getMockCamundaParameters,
  getRepo,
  mockLogger,
  setupApplication,
} from '../../fixtures/test-helper';
import {TestTaskServiceApplication} from '../../fixtures/test.application';
import {MOCK_BPMN_ENGINE_KEY} from '../../fixtures/types';

describe('CreateTaskCommand: Acceptance', () => {
  let app: TestTaskServiceApplication;
  let client: Client;
  let engine: MockEngine;
  let logger: ReturnType<typeof mockLogger>;
  let sandbox: sinon.SinonSandbox;
  let jwtKeyRepo: JwtKeysRepository;
  let command: CreateTaskCommand;
  let stubCommand: sinon.SinonStub;
  let repo: TaskRepository;
  const taskWithoutWorkflow = 'task-without-workflow';
  const nonExistantWorkflow = 'non-existant-workflow';

  before('setupApplication', async () => {
    sandbox = sinon.createSandbox();
    logger = mockLogger(sandbox);
    ({app, client} = await setupApplication(logger));
    engine = app.getSync<MockEngine>(MOCK_BPMN_ENGINE_KEY);
    jwtKeyRepo = await app.getRepository(JwtKeysRepository);
    await seedData();
    // stub a command for task workflow
    stubCommand = sandbox.stub();
    stubCommand.returns({});
    engine.subscribe('stub-command', stubCommand);
    // expect tasks are created in DB
    repo = await getRepo<TaskRepository>(app, 'repositories.TaskRepository');
  });

  after(async () => {
    await jwtKeyRepo.deleteAll();
    await app.stop();
  });

  beforeEach(async () => {
    await clearRepo(app, 'repositories.TaskRepository');
    sandbox.resetHistory();
    // create command instance
    command = new CreateTaskCommand(app);
  });

  it('should create tasks according to the data received in variables', async () => {
    command.parameters = getMockCamundaParameters({
      tasks: {
        values: JSON.stringify(mockTasks),
      },
    });
    await command.execute();

    const tasks = await repo.find();
    expect(tasks.length).to.eql(mockTasks.length);
    expect(tasks[0].key).to.eql(mockTasks[0].key);
    expect(tasks[0].name).to.eql(mockTasks[0].name);
    expect(tasks[0].status).to.eql(TaskStatus.Pending);

    // expect workflow to be triggered for the created task
    const calls = stubCommand.getCalls();
    expect(calls.length).to.eql(1);
    // expect only taskId to be passed to task workflow
    expect(calls[0].args[0]).to.eql({
      taskId: tasks[0].id,
    });
  });

  it('should create tasks but does not trigger workflow for a task with no valid mapping', async () => {
    const unknownKey = 'unknown-key';
    command.parameters = getMockCamundaParameters({
      tasks: {
        values: JSON.stringify([
          {
            ...mockTasks[0],
            key: unknownKey,
          },
        ]),
      },
    });
    await command.execute();

    const tasks = await repo.find();
    expect(tasks.length).to.eql(mockTasks.length);
    expect(tasks[0].key).to.eql(unknownKey);
    expect(tasks[0].name).to.eql(mockTasks[0].name);
    expect(tasks[0].status).to.eql(TaskStatus.Pending);

    // expect workflow to be not be triggered as there is no valid mapping for it
    sinon.assert.notCalled(stubCommand);
  });

  it('should create tasks but does not trigger workflow for a task which is mapped to a non existant workflow', async () => {
    command.parameters = getMockCamundaParameters({
      tasks: {
        values: JSON.stringify([
          {
            ...mockTasks[0],
            key: taskWithoutWorkflow,
          },
        ]),
      },
    });
    await command.execute();

    const tasks = await repo.find();
    expect(tasks.length).to.eql(mockTasks.length);
    expect(tasks[0].key).to.eql(taskWithoutWorkflow);
    expect(tasks[0].name).to.eql(mockTasks[0].name);
    expect(tasks[0].status).to.eql(TaskStatus.Pending);

    // expect workflow to be not be triggered as there is no valid mapping for it
    sinon.assert.notCalled(stubCommand);

    // expect logged message for non existant workflow
    const calls = logger.debug.getCalls();
    expect(calls.length).to.eql(1);
    expect(calls[0].args[0]).to.eql(
      `No workflow found for key ${nonExistantWorkflow}`,
    );
  });

  async function seedData() {
    await seedJwtKeys();
    // create a workflow for tasks
    const token = await generateToken([PermissionKey.CreateWorkflow]);
    const {body: workflow} = await client
      .post('/workflows')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'workflow',
        description: 'test',
        bpmnFile: JSON.stringify(['stub-command']),
        inputSchema: {},
      });

    const taskWorkflowRepo = await getRepo<TaskWorkFlowRepository>(
      app,
      'repositories.TaskWorkFlowRepository',
    );
    await taskWorkflowRepo.create({
      workflowKey: workflow.externalIdentifier,
      taskKey: mockTasks[0].key,
    });

    // mapping for a non existant workflow
    await taskWorkflowRepo.create({
      workflowKey: nonExistantWorkflow,
      taskKey: taskWithoutWorkflow,
    });
  }

  async function seedJwtKeys() {
    process.env.JWT_PRIVATE_KEY_PASSPHRASE = 'jwt_private_key_passphrase';
    const {publicKey, privateKey} = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: process.env.JWT_PRIVATE_KEY_PASSPHRASE,
      },
    });

    // Create the JWKS object
    const keyStore = jose.JWK.createKeyStore();
    const key = await keyStore.add(publicKey, 'pem');
    await jwtKeyRepo.create({
      keyId: key.kid, // Unique identifier for the key
      publicKey: publicKey,
      privateKey: privateKey,
    });
  }

  async function generateToken(permissions: string[]): Promise<string> {
    const keys = await jwtKeyRepo.find();
    return jwt.sign(
      {
        id: 'test',
        userTenantId: 'test',
        permissions,
      },
      {
        key: keys[0].privateKey,
        passphrase: process.env.JWT_PRIVATE_KEY_PASSPHRASE,
      },
      {
        algorithm: 'RS256',
        issuer: process.env.JWT_ISSUER,
        keyid: keys[0].keyId,
      },
    );
  }
});
