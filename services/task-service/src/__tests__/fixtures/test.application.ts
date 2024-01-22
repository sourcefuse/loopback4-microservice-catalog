// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, BindingScope} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {WorkflowServiceBindings} from '@sourceloop/bpmn-service';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
} from '@sourceloop/core';
import * as path from 'path';
import {CreateTaskCommand, EndTaskCommand} from '../../commands';
import {TaskServiceComponent} from '../../component';
import {TaskHttpComponent} from '../../connectors/http';
import {
  KafkaEventAdapter,
  TaskServiceKafkaModule,
} from '../../connectors/kafka';
import {TaskServiceBindings} from '../../keys';
import {MockEngine} from './camunda/mock-camunda';
import {MOCK_CAMUNDA} from './const';
import {
  WorkerMockImplementationProvider,
  WorkflowMockProvider,
} from './providers';
import {MOCK_BPMN_ENGINE_KEY} from './types';

export {ApplicationConfig};

export class TestTaskServiceApplication extends BootMixin(
  RepositoryMixin(RestApplication),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.static('/', path.join(__dirname, '../public'));
    this.component(TaskServiceComponent);
    this.bind(TaskServiceKafkaModule.ADAPTER).toClass(KafkaEventAdapter);

    this.bind(TaskServiceBindings.EVENT_FILTER).to(event => {
      if (event.key === 'event') {
        return true;
      }
      // for testing unmapped events
      if (event.key === 'unmapped-event') {
        return true;
      }
      // for testing filtered out events
      return false;
    });

    this.component(TaskHttpComponent);
    this.bind(WorkflowServiceBindings.WorkflowManager).toProvider(
      WorkflowMockProvider,
    );
    this.bind(WorkflowServiceBindings.WorkerImplementationFunction).toProvider(
      WorkerMockImplementationProvider,
    );
    this.bind(WorkflowServiceBindings.Config).to({
      workflowEngineBaseUrl: MOCK_CAMUNDA,
      useCustomSequence: false,
    });
    this.bind(MOCK_BPMN_ENGINE_KEY)
      .toClass(MockEngine)
      .inScope(BindingScope.SINGLETON);
    this.bind(TaskServiceBindings.COMMANDS).to([
      CreateTaskCommand,
      EndTaskCommand,
    ]);
    this.bind(BearerVerifierBindings.Config).to({
      type: BearerVerifierType.service,
    } as BearerVerifierConfig);
    this.component(BearerVerifierComponent);

    this.projectRoot = __dirname;

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
