import {BindingKey} from '@loopback/core';
import {EventQueueConnector} from '../src/types';
import {BINDING_PREFIX} from '@sourceloop/core';

export namespace TaskServiceBindings {
  export const TASK_PROVIDER =
    BindingKey.create<EventQueueConnector>('sf.task.provider');

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
}
