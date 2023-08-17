import {BindingKey} from '@loopback/core';
import {EventQueueConnector} from '../src/types';
import {BINDING_PREFIX} from '@sourceloop/core';
export namespace TaskServiceBindings {
  export const TASK_PROVIDER =
    BindingKey.create<EventQueueConnector>('sf.task.provider');

  export const BASE_BPMN_RUNNER = BindingKey.create(
    `${BINDING_PREFIX}.task.runner`,
  );
  export const CUSTOM_BPMN_RUNNER = BindingKey.create(
    `${BINDING_PREFIX}.custom_task.runner`,
  );
}
