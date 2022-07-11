// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {BearerTokenVerifyProvider} from '../provider/bearer-token-verify.provider';
import {Strategies} from 'loopback4-authentication';
import {WorkflowServiceApplication} from '../../application';
import {BPMTask, WorkflowCacheSourceName} from '../../types';
import {WorkflowDbDatasource} from '../datasources/workflowdb.datasource';
import {WorkflowServiceBindings} from '../../keys';
import {WorkflowMockProvider} from '../provider/workflow-helper-mock.provider';
import {firstTestBpmn, MOCK_CAMUNDA} from '../const';
import {MOCK_BPMN_ENGINE_KEY} from '../types';
import {MockEngine} from '../mock-engine';
import {BindingScope} from '@loopback/context';
import {WorkerMockImplementationProvider} from '../provider/workflow-mock-implementation.provider';
import {TestBpmnCommand} from '../commands/test.command';

export async function setUpApplication(): Promise<AppWithClient> {
  const app = new WorkflowServiceApplication({
    rest: givenHttpServerConfig(),
  });

  app.dataSource(WorkflowDbDatasource);
  app.bind(`datasources.config.${WorkflowCacheSourceName}`).to({
    name: 'pgdb',
    connector: 'memory',
  });
  app
    .bind(Strategies.Passport.BEARER_TOKEN_VERIFIER)
    .toProvider(BearerTokenVerifyProvider);
  app
    .bind(WorkflowServiceBindings.WorkflowManager)
    .toProvider(WorkflowMockProvider);
  app
    .bind(WorkflowServiceBindings.WorkerImplementationFunction)
    .toProvider(WorkerMockImplementationProvider);
  app.bind(WorkflowServiceBindings.Config).to({
    workflowEngineBaseUrl: MOCK_CAMUNDA,
    useCustomSequence: false,
  });
  app
    .bind(MOCK_BPMN_ENGINE_KEY)
    .toClass(MockEngine)
    .inScope(BindingScope.SINGLETON);
  const registerFn = await app.getValueOrPromise(
    WorkflowServiceBindings.RegisterWorkerFunction,
  );
  if (registerFn) {
    const cmd = new TestBpmnCommand();
    await registerFn(firstTestBpmn.name, 'topic1', new BPMTask(cmd));
    await registerFn(firstTestBpmn.name, 'topic2', new BPMTask(cmd));
  } else {
    throw new Error('No worker register function in the context');
  }
  await app.boot();

  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: WorkflowServiceApplication;
  client: Client;
}
