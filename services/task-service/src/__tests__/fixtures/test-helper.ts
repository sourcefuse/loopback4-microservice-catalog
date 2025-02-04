import {Context} from '@loopback/context';
import {AnyObject, juggler} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  createRestAppClient,
  givenHttpServerConfig,
  sinon,
} from '@loopback/testlab';
import {AuthCacheSourceName, ILogger, LOGGER} from '@sourceloop/core';
import {Task} from 'camunda-external-task-client-js';
import {AuthenticationBindings} from 'loopback4-authentication';
import {TaskDbSourceName, WorkflowServiceSourceName} from '../../types';
import {AuthenticationDbDataSource} from './datasources';
import {TestTaskServiceApplication} from './test.application';

export async function setupApplication(loggerStub?: ILogger) {
  setupEnv();
  const restConfig = givenHttpServerConfig({});

  const app = new TestTaskServiceApplication({
    rest: restConfig,
  });

  app
    .bind(`datasources.${TaskDbSourceName}`)
    .to(new juggler.DataSource({name: TaskDbSourceName, connector: 'memory'}));

  app.bind(`datasources.${WorkflowServiceSourceName}`).to(
    new juggler.DataSource({
      name: WorkflowServiceSourceName,
      connector: 'memory',
    }),
  );

  app.bind('datasources.AuthDB').to({
    name: 'AuthDB',
    connector: 'memory',
  });
  app.dataSource(AuthenticationDbDataSource);

  app.bind(`datasources.config.${AuthCacheSourceName}`).to({
    name: 'redis',
    connector: 'kv-memory',
  });

  if (loggerStub) {
    app.bind(LOGGER.LOGGER_INJECT).to(loggerStub);
  }

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export function mockLogger(sandbox: sinon.SinonSandbox) {
  return {
    log: sandbox.stub(),
    error: sandbox.stub(),
    warn: sandbox.stub(),
    info: sandbox.stub(),
    debug: sandbox.stub(),
  };
}

export async function getRepo<T>(app: RestApplication, classString: string) {
  const tempContext = new Context(app, 'test');
  tempContext.bind<AnyObject>(AuthenticationBindings.CURRENT_USER).to({
    id: 'test',
    username: 'test',
    userTenantId: 'test',
  });
  return tempContext.getSync<T>(classString);
}

export async function clearRepo<T extends {deleteAllHard: () => Promise<void>}>(
  app: RestApplication,
  classString: string,
) {
  const repo = await getRepo<T>(app, classString);
  await repo.deleteAllHard();
}

export function getMockCamundaParameters(data: AnyObject) {
  const stubTaskService = {
    complete: sinon.stub(),
    handleFailure: sinon.stub(),
    handleBpmnError: sinon.stub(),
    extendLock: sinon.stub(),
    unlock: sinon.stub(),
  };
  const stubTask = {
    variables: {
      getAll() {
        return data;
      },
    },
  };
  return {taskService: stubTaskService, task: stubTask as unknown as Task};
}

function setupEnv() {
  process.env.JWT_ISSUER = 'test';
}
