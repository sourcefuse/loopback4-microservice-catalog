import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX} from '@sourceloop/core';
import {EventQueueConnector, WorkflowManagerExtended} from '../src/types';

export namespace TaskServiceBindings {
  export const TASK_PROVIDER = BindingKey.create<EventQueueConnector>(
    `${BINDING_PREFIX}.task.provider`,
  );

  export const CUSTOM_BPMN_RUNNER = BindingKey.create(
    `${BINDING_PREFIX}.task.custom_task.runner`,
  );

  export const CONNECTOR_CONFIG = BindingKey.create(
    `${BINDING_PREFIX}.task.connector.config`,
  );

  export const CONNECTOR_NAME = BindingKey.create(
    `${BINDING_PREFIX}.task.connector.name`,
  );

  export const CAMUNDA_ENGINE_URL = BindingKey.create(
    `${BINDING_PREFIX}.task.engine.camunda`,
  );

  export const TASK_WORKFLOW_MANAGER =
    BindingKey.create<WorkflowManagerExtended | null>(
      `${BINDING_PREFIX}.task.workflow.manager`,
    );
}
