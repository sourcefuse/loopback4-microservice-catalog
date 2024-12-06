import {Client, expect} from '@loopback/testlab';
import {JwtKeysRepository} from '@sourceloop/core';
import {generateKeyPairSync} from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as jose from 'node-jose';
import {TaskPermssionKey} from '../../enums/permission-key.enum';
import {Task} from '../../models';
import {TaskRepository} from '../../repositories';
import {TaskStatus} from '../../types';
import {mockTasks} from '../fixtures/mock-data';
import {getRepo, setupApplication} from '../fixtures/test-helper';
import {TestTaskServiceApplication} from '../fixtures/test.application';

describe('TaskController: Acceptance', () => {
  let app: TestTaskServiceApplication;
  let client: Client;
  let task1: Task;
  let task2: Task;
  let jwtKeyRepo: JwtKeysRepository;
  let repo: TaskRepository;
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    jwtKeyRepo = await app.getRepository(JwtKeysRepository);
    await seedData();
  });

  before(async () => {
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
  });

  after(async () => {
    await jwtKeyRepo.deleteAll();
    await app.stop();
  });

  it('should fetch all tasks', async () => {
    const token = await generateToken([TaskPermssionKey.ViewTask]);
    const tasks = await client
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(tasks.body.length).to.equal(2);
  });

  it('should fetch a task by id', async () => {
    const token = await generateToken([TaskPermssionKey.ViewTask]);
    const task = await client
      .get(`/tasks/${task1.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(task.body.id).to.equal(task1.id);
  });

  it('should fetch count of tasks', async () => {
    const token = await generateToken([TaskPermssionKey.ViewTask]);
    const task = await client
      .get(`/tasks/count`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(task.body.count).to.equal(2);
  });

  it('should delete a task by id', async () => {
    const token = await generateToken([TaskPermssionKey.DeleteTask]);
    await client
      .del(`/tasks/${task2.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const secondTask = await repo.findOne({
      where: {
        id: task2.id,
      },
    });
    expect(secondTask).to.be.null();
  });

  it('should create a task workflow mapping', async () => {
    const token = await generateToken([TaskPermssionKey.MapTask]);
    await client
      .post(`/tasks/mapping`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        workflowKey: 'test-workflow',
        taskKey: 'test-task',
      })
      .expect(204);
  });

  it('should delete all tasks', async () => {
    const token = await generateToken([TaskPermssionKey.DeleteTask]);
    await client
      .del(`/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const tasks = await repo.find();
    expect(tasks.length).to.equal(0);
  });

  it('should update a task by id', async () => {
    const token = await generateToken([TaskPermssionKey.UpdateTask]);
    const newTask = await repo.create({
      ...mockTasks[0],
      key: 'test3',
      name: 'test3',
    });
    await client
      .patch(`/tasks/${newTask.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        priority: 'Low',
      })
      .expect(204);
    const updatedTask = await repo.findById(newTask.id);
    expect(updatedTask?.priority).to.equal('Low');
  });

  it('should update all tasks', async () => {
    const token = await generateToken([TaskPermssionKey.UpdateTask]);
    await client
      .patch(`/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        priority: 'Low',
      })
      .expect(200);
    const tasks = await repo.find();
    for (const task of tasks) {
      expect(task.priority).to.equal('Low');
    }
  });

  it('should not allow updating a complete task', async () => {
    const token = await generateToken([TaskPermssionKey.UpdateTask]);
    const newTask = await repo.create({
      ...mockTasks[0],
      key: 'test3',
      name: 'test3',
      status: TaskStatus.Pending,
    });
    await client
      .patch(`/tasks/${newTask.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: TaskStatus.Completed,
      })
      .expect(400)
      .expect((res: Response) => {
        expect(res.body).to.deepEqual({
          error: {
            message: 'Task completion cannot be done through the PATCH API.',
            name: 'BadRequestError',
            statusCode: 400,
          },
        });
      });
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
