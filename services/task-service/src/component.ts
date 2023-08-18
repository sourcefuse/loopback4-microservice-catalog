// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Binding,
  Component,
  ControllerClass,
  CoreBindings,
  inject,
  ProviderMap,
} from '@loopback/core';
import {Class, Model, Repository} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  CoreComponent,
  SECURITY_SCHEME_SPEC,
  ServiceSequence,
} from '@sourceloop/core';
import {
  CamundaService,
  EventProcessorService,
  EventQueueService,
  HttpClientService,
  TaskOperationService,
} from './services';
import {Connector} from './providers';
import * as controllers from './controllers';
import {TaskServiceBindings} from './keys';
import {
  EventRepository,
  TaskRepository,
  TaskWorkFlowMappingRepository,
} from './repositories';
import {
  WorkflowServiceBindings,
  WorkflowServiceComponent,
} from '@sourceloop/bpmn-service';
import {EventWorkflowMappingRepository} from './repositories/event-workflow-mapping.repository';

export class TaskServiceComponent implements Component {
  repositories?: Class<Repository<Model>>[];

  /**
   * An optional list of Model classes to bind for dependency injection
   * via `app.model()` API.
   */
  models?: Class<Model>[];

  providers: ProviderMap = {
    [TaskServiceBindings.TASK_PROVIDER.key]: Connector,
  };

  services = [
    CamundaService,
    EventProcessorService,
    EventQueueService,
    HttpClientService,
    TaskOperationService,
  ];

  /**
   * An array of controller classes
   */
  controllers?: ControllerClass[];
  bindings?: Binding[] = [];
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
  ) {
    this.application.component(CoreComponent);

    this.application.api({
      openapi: '3.0.0',
      info: {
        title: 'Task Service',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      servers: [{url: '/'}],
    });
    this.application.component(WorkflowServiceComponent);
    this.application.bind(WorkflowServiceBindings.Config).to({
      useCustomSequence: true,
      workflowEngineBaseUrl: 'http://localhost:8080/engine-rest',
    });
    this.controllers = [controllers.EventQueueController];
    this.repositories = [
      EventRepository,
      TaskRepository,
      EventWorkflowMappingRepository,
      TaskWorkFlowMappingRepository,
    ];
  }

  /**
   * Setup ServiceSequence by default if no other sequnce provided
   */
  setupSequence() {
    this.application.sequence(ServiceSequence);
  }
}
