// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Binding,
  Component,
  ControllerClass,
  CoreBindings,
  createBindingFromClass,
  inject,
  ProviderMap,
  ServiceOrProviderClass,
} from '@loopback/core';
import {Class, Model, Repository} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {WorkflowServiceComponent} from '@sourceloop/bpmn-service';
import {
  CoreComponent,
  SECURITY_SCHEME_SPEC,
  ServiceSequence,
} from '@sourceloop/core';
import * as controllers from './controllers';

import {Strategies} from 'loopback4-authentication';
import {
  BearerStrategyFactoryProvider,
  BearerTokenVerifyProvider,
} from 'loopback4-authentication/dist/strategies';
import {TaskServiceBindings} from './keys';
import {CommandObserver, EventStreamObserver} from './lifecycle-observers';
import {
  EventRepository,
  EventWorkflowMappingRepository,
  TaskRepository,
  TaskWorkFlowMappingRepository,
  UserTaskRepository,
} from './repositories';
import {
  CamundaService,
  EventProcessorService,
  HttpClientService,
  SubTaskService,
  UtilityService,
} from './services';

export class TaskServiceComponent implements Component {
  repositories?: Class<Repository<Model>>[];

  /**
   * An optional list of Model classes to bind for dependency injection
   * via `app.model()` API.
   */
  models?: Class<Model>[];

  providers: ProviderMap = {};

  services?: ServiceOrProviderClass[];

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
    this.controllers = [
      controllers.EventsController,
      controllers.TaskController,
      controllers.TaskSubTaskController,
    ];
    this.repositories = [
      EventRepository,
      TaskRepository,
      EventWorkflowMappingRepository,
      TaskWorkFlowMappingRepository,
      UserTaskRepository,
    ];
    this.services = [
      CamundaService,
      UtilityService,
      SubTaskService,
      HttpClientService,
    ];
    this.bindings = [
      createBindingFromClass(EventProcessorService, {
        key: TaskServiceBindings.EVENT_PROCESSOR,
      }),
      createBindingFromClass(SubTaskService, {
        key: TaskServiceBindings.SUB_TASK_SERVICE,
      }),
    ];
    this.application.lifeCycleObserver(EventStreamObserver);
    this.application.lifeCycleObserver(CommandObserver);
  }

  /**
   * Setup ServiceSequence by default if no other sequnce provided
   */
  setupSequence() {
    this.application.sequence(ServiceSequence);
    this.application
      .bind(Strategies.Passport.BEARER_STRATEGY_FACTORY.key)
      .toProvider(BearerStrategyFactoryProvider);
    this.application
      .bind(Strategies.Passport.BEARER_TOKEN_VERIFIER.key)
      .toProvider(BearerTokenVerifyProvider);
  }
}
