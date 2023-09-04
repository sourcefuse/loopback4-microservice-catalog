import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';

import {
  ExportedWorkflowServiceBindingConfig,
  TaskServiceBindings,
  TaskServiceComponent,
} from '@sourceloop/task-service';
import {CustomBpmnRunner, SQSConnector} from './providers';

import {WorkflowServiceBindings} from '@sourceloop/bpmn-service';
import path from 'path';
import {BpmnProvider} from './providers/bpmn.provider';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class TaskServiceUserApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // Add the component
    this.component(TaskServiceComponent);

    this.bind(WorkflowServiceBindings.WorkflowManager).toProvider(BpmnProvider);

    this.bind(TaskServiceBindings.CONNECTOR_CONFIG).to({
      accessKeyId: process.env.AWS_SQS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SQS_SECRET_KEY,
      region: process.env.AWS_SQS_REGION,
      queueUrl: process.env.AWS_QUEUE_URL,
    });

    this.bind(TaskServiceBindings.CONNECTOR_NAME).to('myConn');
    this.bind(ExportedWorkflowServiceBindingConfig).to({
      useCustomSequence: true,
      workflowEngineBaseUrl: process.env.CAMUNDA_URL,
    });
    this.bind(TaskServiceBindings.TASK_PROVIDER).toProvider(SQSConnector);
    this.bind(TaskServiceBindings.CUSTOM_BPMN_RUNNER).toProvider(
      CustomBpmnRunner,
    );

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
