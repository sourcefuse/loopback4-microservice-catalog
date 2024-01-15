import {Client, expect, sinon} from '@loopback/testlab';
import {PermissionKey} from '@sourceloop/bpmn-service';
import {CreateTaskCommand} from '../../../commands';
import {TaskRepository, TaskWorkFlowRepository} from '../../../repositories';
import {TaskStatus} from '../../../types';
import {MockEngine} from '../../fixtures/camunda';
import {mockTasks} from '../../fixtures/mock-data';
import {
  clearRepo,
  getMockCamundaParameters,
  getRepo,
  getToken,
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
    await seedData();
    // stub a command for task workflow
    stubCommand = sandbox.stub();
    stubCommand.returns({});
    engine.subscribe('stub-command', stubCommand);
    // expect tasks are created in DB
    repo = await getRepo<TaskRepository>(app, 'repositories.TaskRepository');
  });

  after(async () => {
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
    // create a workflow for tasks
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
});
