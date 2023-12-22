import {BindingKey, Constructor} from '@loopback/core';
import {ICommand} from '@sourceloop/bpmn-service';
import {BINDING_PREFIX} from '@sourceloop/core';
import {
  IEventProcessor,
  IIncomingConnector,
  IOutgoingConnector,
  ISubTaskService,
} from './interfaces';
import {EventFilter} from './types';

export namespace TaskServiceBindings {
  export const CUSTOM_BPMN_RUNNER = BindingKey.create(
    `${BINDING_PREFIX}.task.custom_task.runner`,
  );

  export const SUB_TASK_SERVICE = BindingKey.create<ISubTaskService>(
    `${BINDING_PREFIX}.subtask.service`,
  );

  export const EVENT_PROCESSOR = BindingKey.create<IEventProcessor>(
    `${BINDING_PREFIX}.task.event.processor`,
  );

  export const EVENT_FILTER = BindingKey.create<EventFilter>(
    `${BINDING_PREFIX}.task.event.filter`,
  );

  export const INCOMING_CONNECTOR = BindingKey.create<IIncomingConnector>(
    `${BINDING_PREFIX}.task.incoming.processor`,
  );
  export const OUTGOING_CONNECTOR = BindingKey.create<
    IOutgoingConnector<unknown>
  >(`${BINDING_PREFIX}.task.incoming.processor`);

  export const COMMANDS = BindingKey.create<Constructor<ICommand>[]>(
    `${BINDING_PREFIX}.task.commands`,
  );
}
