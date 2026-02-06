// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { Booter } from '@loopback/boot';
import {
  Binding,
  Component,
  ControllerClass,
  CoreBindings,
  inject,
  ProviderMap,
} from '@loopback/core';
import { Class, Model, Repository } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  BooterBasePathMixin,
  CoreComponent,
  CoreControllerBooter,
  CoreModelBooter,
  JwtKeysRepository,
  SECURITY_SCHEME_SPEC,
  ServiceSequence,
} from '@sourceloop/core';
import { JwtKeysRepository as SequelizeJwtKeysRepository } from '@sourceloop/core/sequelize';
import { AuthenticationComponent } from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import { WorkflowServiceBindings } from './keys';
import { Workflow } from './models';
import { WorkflowProvider } from './providers';
import { ExecutionInputValidationProvider } from './providers/execution-input-validator.provider';
import { WorkerRegisterFnProvider } from './providers/register-worker.service';
import { WorkerImplementationProvider } from './providers/worker-implementation.provider';
import { WorkflowRepository, WorkflowVersionRepository } from './repositories';
import {
  WorkflowRepository as WorkflowSequelizeRepository,
  WorkflowVersionRepository as WorkflowVersionSequelizeRepository,
} from './repositories/sequelize';
import { IWorkflowServiceConfig } from './types';

export class WorkflowServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(WorkflowServiceBindings.Config, {optional: true})
    private readonly workflowSvcConfig?: IWorkflowServiceConfig,
  ) {
    this.bindings = [];
    this.providers = {};

    // Mount core component
    this.application.component(CoreComponent);

    this.application.api({
      openapi: '3.0.0',
      info: {
        title: 'Bpmn Service',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      servers: [{url: '/'}],
    });

    if (!this.workflowSvcConfig?.useCustomSequence) {
      // Mount default sequence if needed
      this.setupSequence();
    }

    this.booters = [
      BooterBasePathMixin(CoreModelBooter, __dirname, {
        interface: WorkflowServiceComponent.name,
      }),
      BooterBasePathMixin(CoreControllerBooter, __dirname, {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
        interface: WorkflowServiceComponent.name,
      }),
    ];

    if (this.workflowSvcConfig?.useSequelize) {
      this.repositories = [
        WorkflowSequelizeRepository,
        WorkflowVersionSequelizeRepository,
        SequelizeJwtKeysRepository,
      ];
    } else {
      this.repositories = [
        WorkflowRepository,
        WorkflowVersionRepository,
        JwtKeysRepository,
      ];
    }
    this.models = [Workflow];

    this.providers = {
      [WorkflowServiceBindings.WorkflowManager.key]: WorkflowProvider,
      [WorkflowServiceBindings.ExecutionInputValidatorFn.key]:
        ExecutionInputValidationProvider,
      [WorkflowServiceBindings.RegisterWorkerFunction.key]:
        WorkerRegisterFnProvider,
      [WorkflowServiceBindings.WorkerImplementationFunction.key]:
        WorkerImplementationProvider,
    };

    this.application
      .bind(WorkflowServiceBindings.WORKER_MAP)
      .toDynamicValue(() => {
        return {};
      });
  }

  providers?: ProviderMap = {};

  bindings?: Binding[] = [];

  /**
   * An optional list of Repository classes to bind for dependency injection
   * via `app.repository()` API.
   */
  repositories?: Class<Repository<Model>>[];

  /**
   * An optional list of Model classes to bind for dependency injection
   * via `app.model()` API.
   */
  models?: Class<Model>[];

  /**
   * An array of controller classes
   */
  controllers?: ControllerClass[];

  booters?: Class<Booter>[];

  /**
   * Setup ServiceSequence by default if no other sequnce provided
   *
   */
  setupSequence() {
    this.application.sequence(ServiceSequence);

    // Mount authentication component for default sequence
    this.application.component(AuthenticationComponent);
    // Mount bearer verifier component
    this.application.bind(BearerVerifierBindings.Config).to({
      authServiceUrl: '',
      type: BearerVerifierType.service,
    } as BearerVerifierConfig);
    this.application.component(BearerVerifierComponent);

    // Mount authorization component for default sequence
    this.application.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.application.component(AuthorizationComponent);
  }
}
