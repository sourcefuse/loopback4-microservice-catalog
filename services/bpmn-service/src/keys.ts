import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX} from '@sourceloop/core';
import {IWorkflowServiceConfig, WorflowManager} from './types';

export namespace WorkflowServiceBindings {
  export const WorkflowManager = BindingKey.create<WorflowManager | null>(
    `${BINDING_PREFIX}.workflow.manager`,
  );
  export const Config = BindingKey.create<IWorkflowServiceConfig | null>(
    `${BINDING_PREFIX}.workflow.config`,
  );
}
