import {Client, expect} from '@loopback/testlab';
import {TaskPermssionKey} from '../../enums/permission-key.enum';
import {Task} from '../../models';
import {TaskRepository} from '../../repositories';
import {mockTasks} from '../fixtures/mock-data';
import {getRepo, getToken, setupApplication} from '../fixtures/test-helper';
import {TestTaskServiceApplication} from '../fixtures/test.application';

describe('TaskController: Acceptance', () => {
  let app: TestTaskServiceApplication;
  let client: Client;
  let task1: Task;
  let task2: Task;
  let repo: TaskRepository;
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    await seedData();
  });

  after(async () => {
    await app.stop();
  });

  it('should fetch all tasks', async () => {
    const token = getToken([TaskPermssionKey.ViewTask]);
    const tasks = await client
      .get('/tasks')
      .set('Authorization', token)
      .expect(200);

    expect(tasks.body.length).to.equal(2);
  });

  it('should fetch a task by id', async () => {
    const token = getToken([TaskPermssionKey.ViewTask]);
    const task = await client
      .get(`/tasks/${task1.id}`)
      .set('Authorization', token)
      .expect(200);

    expect(task.body.id).to.equal(task1.id);
  });

  it('should fetch count of tasks', async () => {
    const token = getToken([TaskPermssionKey.ViewTask]);
    const task = await client
      .get(`/tasks/count`)
      .set('Authorization', token)
      .expect(200);

    expect(task.body.count).to.equal(2);
  });

  it('should delete a task by id', async () => {
    const token = getToken([TaskPermssionKey.DeleteTask]);
    await client
      .del(`/tasks/${task2.id}`)
      .set('Authorization', token)
      .expect(204);

    const secondTask = await repo.findOne({
      where: {
        id: task2.id,
      },
    });
    expect(secondTask).to.be.null();
  });

  it('should create a task workflow mapping', async () => {
    const token = getToken([TaskPermssionKey.MapTask]);
    await client
      .post(`/tasks/mapping`)
      .set('Authorization', token)
      .send({
        workflowKey: 'test-workflow',
        taskKey: 'test-task',
      })
      .expect(204);
  });

  it('should delete all tasks', async () => {
    const token = getToken([TaskPermssionKey.DeleteTask]);
    await client.del(`/tasks`).set('Authorization', token).expect(204);

    const tasks = await repo.find();
    expect(tasks.length).to.equal(0);
  });

  async function seedData() {
    repo = await getRepo<TaskRepository>(app, 'repositories.TaskRepository');
    task1 = await repo.create(mockTasks[0]);
    task2 = await repo.create({
      ...mockTasks[0],
      key: 'test2',
      name: 'test2',
      externalId: 'processInstanceId2',
    });
  }
});
