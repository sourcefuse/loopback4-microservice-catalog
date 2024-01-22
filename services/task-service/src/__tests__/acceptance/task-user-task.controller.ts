import {Client, expect, sinon} from '@loopback/testlab';
import {TaskPermssionKey} from '../../enums/permission-key.enum';
import {Task, UserTask} from '../../models';
import {TaskRepository, UserTaskRepository} from '../../repositories';
import {HttpClientService} from '../../services';
import {
  TaskPriority,
  TaskSeverity,
  TaskStatus,
  UserTaskStatus,
} from '../../types';
import {getRepo, getToken, setupApplication} from '../fixtures/test-helper';
import {TestTaskServiceApplication} from '../fixtures/test.application';

describe('TaskUserTaskController: Acceptance', () => {
  let app: TestTaskServiceApplication;
  let task: Task;
  let userTask1: UserTask;
  let client: Client;
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  beforeEach(async () => {
    await seedData();
  });

  afterEach(async () => {
    await clearData();
  });

  it('should fetch all subtasks of a task', async () => {
    const token = getToken([TaskPermssionKey.ViewUserTask]);
    const {body} = await client
      .get(`/tasks/${task.id}/user-tasks`)
      .set('Authorization', token)
      .expect(200);
    expect(body.length).to.equal(2);
  });

  it('should fetch all subtasks of a task by id', async () => {
    const token = getToken([TaskPermssionKey.ViewUserTask]);
    const {body} = await client
      .get(`/tasks/${task.id}/user-tasks/${userTask1.id}`)
      .set('Authorization', token)
      .expect(200);
    expect(body.name).to.equal(userTask1.name);
  });

  it('should fetch count of subtasks of a task', async () => {
    const token = getToken([TaskPermssionKey.ViewUserTask]);
    const {body} = await client
      .get(`/tasks/${task.id}/user-tasks/count`)
      .set('Authorization', token)
      .expect(200);
    expect(body.count).to.equal(2);
  });

  it('should delete a subtask of a task', async () => {
    const token = getToken([
      TaskPermssionKey.DeleteUserTask,
      TaskPermssionKey.ViewUserTask,
    ]);
    await client
      .del(`/tasks/${task.id}/user-tasks/${userTask1.id}`)
      .set('Authorization', token)
      .expect(204);
    await client
      .get(`/tasks/${task.id}/user-tasks/${userTask1.id}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should delete all subtasks of a task', async () => {
    const token = getToken([
      TaskPermssionKey.DeleteUserTask,
      TaskPermssionKey.ViewUserTask,
    ]);
    await client
      .del(`/tasks/${task.id}/user-tasks`)
      .set('Authorization', token)
      .expect(204);
    const {body} = await client
      .get(`/tasks/${task.id}/user-tasks/count`)
      .set('Authorization', token)
      .expect(200);
    expect(body.count).to.equal(0);
  });

  it('should complete a user task and update list of user tasks for parent', async () => {
    const http = await app.get<HttpClientService>('services.HttpClientService');
    const postSpy = sinon.stub(http, 'post');
    const token = getToken([
      TaskPermssionKey.CompleteUserTask,
      TaskPermssionKey.ViewUserTask,
    ]);
    await client
      .patch(`/tasks/${task.id}/user-tasks/${userTask1.id}/complete`)
      .set('Authorization', token)
      .expect(204);

    const calls = postSpy.getCalls();
    expect(calls.length).to.eql(1);
  });

  async function seedData() {
    const repo = await getRepo<TaskRepository>(
      app,
      'repositories.TaskRepository',
    );
    task = await repo.create({
      name: 'test-task-1',
      description: 'test-task-1',
      status: TaskStatus.Pending,
      priority: TaskPriority.Low,
      key: 'key-task-1',
      severity: TaskSeverity.High,
      assigneeId: 'test-user-1',
      metadata: {},
      type: 'test',
    });

    const userTaskRepo = await getRepo<UserTaskRepository>(
      app,
      'repositories.UserTaskRepository',
    );
    userTask1 = await userTaskRepo.create({
      taskId: task.id,
      status: UserTaskStatus.Pending,
      name: 'test-user-task-1',
      externalId: 'test1',
    });

    await userTaskRepo.create({
      taskId: task.id,
      status: UserTaskStatus.Completed,
      name: 'test-user-task-2',
      externalId: 'test2',
    });
  }

  async function clearData() {
    const repo = await getRepo<TaskRepository>(
      app,
      'repositories.TaskRepository',
    );
    await repo.deleteAllHard();

    const userTaskRepo = await getRepo<UserTaskRepository>(
      app,
      'repositories.UserTaskRepository',
    );
    await userTaskRepo.deleteAllHard();
  }
});
