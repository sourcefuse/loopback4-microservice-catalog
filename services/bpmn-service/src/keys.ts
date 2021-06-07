import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX} from '@sourceloop/core';
import {
  ExecutionInputValidator,
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
}
