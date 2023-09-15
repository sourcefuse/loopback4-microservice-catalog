import {TaskServiceApplication} from '../application';
import {Client, createRestAppClient} from '@loopback/testlab';
import {PgDbDataSource} from './datasource/pg-db.datasource';
import {
  ExportedWorkflowServiceBindingConfig,
  TaskDbSourceName,
  WorkflowServiceSourceName,
} from '../types';
import {WorkflowServiceComponent} from '@sourceloop/bpmn-service';
import {WorkflowDataSource} from './datasource/workflow.datasource';
import {TaskServiceBindings} from '../keys';
import {CustomBpmnRunner} from './providers/custom-runner.provider';
import {SQSConnector} from './providers/sqs-connector.provider';
import {Strategies} from 'loopback4-authentication';
import {BearerTokenVerifyProvider} from './providers/bearer-token-verifier.provider';

export async function setupApplication(): Promise<AppWithClient> {
  const app = new TaskServiceApplication({
    // Configure your application for testing
    rest: {
      port: 0, // Use an available port
    },
  });

  app.component(WorkflowServiceComponent);
  app.dataSource(PgDbDataSource);
  app.bind(`datasources.config.${TaskDbSourceName}`).to({
    name: 'pgdb',
    connector: 'memory',
  });
  app
    .bind(`datasources.${WorkflowServiceSourceName}`)
    .toClass(WorkflowDataSource);
  app.bind(ExportedWorkflowServiceBindingConfig).to({
    useCustomSequence: true,
    workflowEngineBaseUrl: 'http://',
  });
  app
    .bind(Strategies.Passport.BEARER_TOKEN_VERIFIER)
    .toProvider(BearerTokenVerifyProvider);
  app.bind(TaskServiceBindings.CUSTOM_BPMN_RUNNER).toProvider(CustomBpmnRunner);
  app.bind(TaskServiceBindings.CONNECTOR_CONFIG).to({
    region: '',
    queueUrl: '',
  });
  app.bind(TaskServiceBindings.TASK_PROVIDER).toProvider(SQSConnector);
  app.bind(TaskServiceBindings.CONNECTOR_NAME).to('myConn');

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: TaskServiceApplication;
  client: Client;
}
