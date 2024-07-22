// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingScope} from '@loopback/context';
import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {Strategies} from 'loopback4-authentication';
import {WorkflowServiceApplication} from '../../application';
import {CamundaComponent} from '../../connectors/camunda';
import {WorkflowServiceBindings} from '../../keys';
import {BPMTask, WorkflowCacheSourceName} from '../../types';
import {TestBpmnCommand} from '../commands/test.command';
import {MOCK_CAMUNDA, firstTestBpmn} from '../const';
import {WorkflowDbDatasource} from '../datasources/workflowdb.datasource';
import {MockEngine} from '../mock-engine';
import {BearerTokenVerifyProvider} from '../provider/bearer-token-verify.provider';
import {WorkflowMockProvider} from '../provider/workflow-helper-mock.provider';
import {WorkerMockImplementationProvider} from '../provider/workflow-mock-implementation.provider';
import {MOCK_BPMN_ENGINE_KEY} from '../types';

export async function setUpApplication(mock = true): Promise<AppWithClient> {
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
  if (mock) {
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
  } else {
    app.component(CamundaComponent);
    app.bind(WorkflowServiceBindings.Config).to({
      workflowEngineBaseUrl: process.env.WORKFLOW_ENGINE_BASE_URL,
      useCustomSequence: false,
    });
  }

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
