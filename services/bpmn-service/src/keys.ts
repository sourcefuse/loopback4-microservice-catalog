// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey, Constructor} from '@loopback/core';
import {BINDING_PREFIX} from '@sourceloop/core';
import {
  ExecutionInputValidator,
  ICommand,
  IWorkflowService,
  IWorkflowServiceConfig,
  WorflowManager,
  WorkerImplementationFn,
  WorkerMap,
  WorkerRegisterFn,
} from './types';

export namespace WorkflowServiceBindings {
  export const WorkflowManager = BindingKey.create<WorflowManager | null>(
    `${BINDING_PREFIX}.workflow.manager`,
  );
  export const Config = BindingKey.create<IWorkflowServiceConfig | null>(
    `${BINDING_PREFIX}.workflow.config`,
  );
  export const ExecutionInputValidatorFn =
    BindingKey.create<ExecutionInputValidator | null>(
      `${BINDING_PREFIX}.workflow.execute.validator`,
    );
  export const RegisterWorkerFunction =
    BindingKey.create<WorkerRegisterFn | null>(
      `${BINDING_PREFIX}.workflow.worker.register`,
    );
  export const WorkerImplementationFunction =
    BindingKey.create<WorkerImplementationFn | null>(
      `${BINDING_PREFIX}.workflow.worker.implementation`,
    );
  export const WORKER_MAP = BindingKey.create<WorkerMap | null>(
    `${BINDING_PREFIX}.workflow.worker.map`,
  );
  export const COMMANDS = BindingKey.create<Constructor<ICommand>[]>(
    `${BINDING_PREFIX}.workflow.commands`,
  );

  export const WorkflowService = BindingKey.create<IWorkflowService>(
    `${BINDING_PREFIX}.workflow.service`,
  );
}
