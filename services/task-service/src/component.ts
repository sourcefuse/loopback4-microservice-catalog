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
import {
  WorkflowRepository,
  WorkflowServiceBindings,
  WorkflowServiceComponent,
  WorkflowVersionRepository,
} from '@sourceloop/bpmn-service';
import {
  WorkflowRepository as WorkflowSequelizeRepository,
  WorkflowVersionRepository as WorkflowVersionSequelizeRepository,
} from '@sourceloop/bpmn-service/sequelize';
import {
  CoreComponent,
  JwtKeysRepository,
  SECURITY_SCHEME_SPEC,
  ServiceSequence,
} from '@sourceloop/core';
import {JwtKeysRepository as SequelizeJwtKeysRepository} from '@sourceloop/core/sequelize';
import {AuthenticationComponent} from 'loopback4-authentication';
import {AuthorizationComponent} from 'loopback4-authorization';
import * as controllers from './controllers';
import {TaskServiceBindings} from './keys';
import {CommandObserver, EventStreamObserver} from './lifecycle-observers';
import {Event, EventWorkflow, Task, TaskWorkflow, UserTask} from './models';
import {BpmnProvider} from './providers';
import {SystemUserProvider} from './providers/system-user.provider';
import {
  EventRepository,
  EventWorkflowRepository,
  TaskRepository,
  TaskWorkFlowRepository,
  UserTaskRepository,
} from './repositories';
import {
  EventRepository as EventSequelizeRepository,
  EventWorkflowRepository as EventWorkflowSequelizeRepository,
  TaskRepository as TaskSequelizeRepository,
  TaskWorkFlowRepository as TaskWorkFlowSequelizeRepository,
  UserTaskRepository as UserTaskSequelizeRepository,
} from './repositories/sequelize';
import {
  CamundaService,
  EventProcessorService,
  HttpClientService,
  UserTaskService,
  UtilityService,
} from './services';
import {TaskServiceConfig} from './types';

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
    @inject(TaskServiceBindings.CONFIG, {optional: true})
    private readonly config?: TaskServiceConfig,
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
      controllers.EventController,
      controllers.TaskController,
      controllers.TaskUserTaskController,
    ];
    if (config?.useSequelize) {
      this.repositories = [
        EventSequelizeRepository,
        TaskSequelizeRepository,
        EventWorkflowSequelizeRepository,
        TaskWorkFlowSequelizeRepository,
        UserTaskSequelizeRepository,
        WorkflowSequelizeRepository,
        WorkflowVersionSequelizeRepository,
        SequelizeJwtKeysRepository,
      ];
    } else {
      this.repositories = [
        EventRepository,
        TaskRepository,
        EventWorkflowRepository,
        TaskWorkFlowRepository,
        UserTaskRepository,
        WorkflowRepository,
        WorkflowVersionRepository,
        JwtKeysRepository,
      ];
    }
    this.providers = {
      [TaskServiceBindings.SYSTEM_USER.key]: SystemUserProvider,
      [WorkflowServiceBindings.WorkflowManager.key]: BpmnProvider,
    };
    this.models = [EventWorkflow, Event, TaskWorkflow, Task, UserTask];
    this.services = [CamundaService, UtilityService, HttpClientService];
    this.bindings = [
      createBindingFromClass(EventProcessorService, {
        key: TaskServiceBindings.EVENT_PROCESSOR,
      }),
      createBindingFromClass(UserTaskService, {
        key: TaskServiceBindings.SUB_TASK_SERVICE,
      }),
    ];
    if (!this.config?.useCustomSequence) {
      this.setupSequence();
    }
    // default filter does not skip any events
    this.application.bind(TaskServiceBindings.EVENT_FILTER).to(() => true);
    this.application.lifeCycleObserver(EventStreamObserver);
    this.application.lifeCycleObserver(CommandObserver);
  }

  /**
   * Setup ServiceSequence by default if no other sequnce provided
   */
  setupSequence() {
    this.application.component(AuthenticationComponent);
    this.application.component(AuthorizationComponent);
    this.application.sequence(ServiceSequence);
  }
}
