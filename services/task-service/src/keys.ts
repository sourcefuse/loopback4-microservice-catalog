import {BindingKey} from '@loopback/core';
import {EventQueueConnector} from '../src/types';
export namespace TaskServiceBindings {
  export const TASK_PROVIDER =
    BindingKey.create<EventQueueConnector>('sf.task.provider');
}
