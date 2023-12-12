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
  TaskServiceComponent,
} from '@sourceloop/task-service';

import {WorkflowServiceBindings} from '@sourceloop/bpmn-service';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
} from '@sourceloop/core';
import {
  CreateTaskCommand,
  EndTaskCommand,
  TaskServiceBindings,
} from '@sourceloop/task-service';
import {
  KafkaEventAdapter,
  KafkaStreamService,
  TaskServiceKafkaModule,
} from '@sourceloop/task-service/kafka';
import path from 'path';
import {ReadDataCommand} from './commands/read-data.command';
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

    this.bind(ExportedWorkflowServiceBindingConfig).to({
      useCustomSequence: true,
      workflowEngineBaseUrl: process.env.CAMUNDA_URL,
    });

    // Add bearer verifier component
    this.bind(BearerVerifierBindings.Config).to({
      type: BearerVerifierType.service,
    } as BearerVerifierConfig);
    this.component(BearerVerifierComponent);

    this.bind(TaskServiceKafkaModule.CONFIG).to({
      connection: {
        clientId: process.env.KAFKA_CLIENT_ID,
        brokers: [
          ...(process.env.KAFKA_SERVER?.split(',') ?? ['localhost:9092']),
        ],
        ...(process.env.KAFKA_SSL === 'true'
          ? {
              ssl: true,
            }
          : {}),
      },
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID ?? 'task-service',
      },
      producer: {},
      topics: ['sow.update'],
    });
    this.bind(TaskServiceKafkaModule.ADAPTER).toClass(KafkaEventAdapter);
    this.bind(TaskServiceBindings.INCOMING_CONNECTOR).toClass(
      KafkaStreamService,
    );
    this.bind(TaskServiceBindings.OUTGOING_CONNECTOR).toClass(
      KafkaStreamService,
    );
    this.bind(WorkflowServiceBindings.WorkflowManager).toProvider(BpmnProvider);
    this.bind(TaskServiceBindings.COMMANDS).to([
      CreateTaskCommand,
      ReadDataCommand,
      EndTaskCommand,
    ]);

    // Add authorization component
    this.bind('sf.userAuthorization.config').to({
      allowAlwaysPaths: ['/explorer', '/openapi.json'],
    });

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
