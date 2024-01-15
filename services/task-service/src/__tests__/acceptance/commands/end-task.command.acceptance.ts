import {expect, sinon} from '@loopback/testlab';
import {EndTaskCommand} from '../../../commands';
import {TaskServiceBindings} from '../../../keys';
import {TaskRepository} from '../../../repositories';
import {EventType, TaskStatus} from '../../../types';
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

describe('EndTaskCommand: Acceptance', () => {
  let app: TestTaskServiceApplication;
  let engine: MockEngine;
  let logger: ReturnType<typeof mockLogger>;
  let sandbox: sinon.SinonSandbox;
  let command: EndTaskCommand;
  let stubCommand: sinon.SinonStub;
  let taskId: string | undefined;
  let taskRepo: TaskRepository;

  before('setupApplication', async () => {
    sandbox = sinon.createSandbox();
    logger = mockLogger(sandbox);
    ({app} = await setupApplication(logger));
    engine = app.getSync<MockEngine>(MOCK_BPMN_ENGINE_KEY);
    taskRepo = await getRepo<TaskRepository>(
      app,
      'repositories.TaskRepository',
    );
    // stub a command for task workflow
    stubCommand = sandbox.stub();
    stubCommand.returns({});
    engine.subscribe('stub-command', stubCommand);
  });

  after(async () => {
    await app.stop();
  });

  beforeEach(async () => {
    await clearRepo(app, 'repositories.TaskRepository');
    await seedTask();
    sandbox.resetHistory();
    // create command instance
    command = new EndTaskCommand(app);
  });

  it('should mark a task as completed on being executed', async () => {
    command.parameters = getMockCamundaParameters({
      taskId,
    });
    await command.execute();
    const task = await taskRepo.findById(taskId);
    expect(task).to.have.properties({
      status: TaskStatus.Completed,
    });
  });

  it('should publish an event for task being completed', async () => {
    const stream = await app.get(TaskServiceBindings.OUTGOING_CONNECTOR);
    const publishSpy = sinon.spy(stream, 'publish');
    command.parameters = getMockCamundaParameters({
      taskId,
    });
    await command.execute();

    const calls = publishSpy.getCalls();
    expect(calls).to.have.length(1);
    expect(calls[0].args[0]).to.containEql({
      key: EventType.TaskCompleted,
      payload: {
        taskId: taskId,
      },
      source: 'task-service',
    });
  });

  async function seedTask() {
    ({id: taskId} = await taskRepo.create(mockTasks[0]));
  }
});
