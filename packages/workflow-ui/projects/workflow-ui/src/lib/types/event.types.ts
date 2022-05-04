import {AllowedValues} from '.';
import {WorkflowPrompt} from '../classes/nodes/abstract-prompt.class';
import {WorkflowAction} from '../classes/nodes/abstract-workflow-action.class';
import {WorkflowEvent} from '../classes/nodes/abstract-workflow-event.class';
import {WorkflowNode} from './base.types';

export type ChangeEvent = {
  target: {
    value: string;
  };
};

export function isChangeEvent(
  event?: Event | ChangeEvent,
): event is ChangeEvent {
  return !!(event && (event as ChangeEvent).target.value);
}

export type EventAddition<E> = {
  name: string;
  event: WorkflowEvent<E>;
};

export type ActionAddition<E> = {
  name: string;
  action: WorkflowAction<E>;
};

export type InputChanged<E> = {
  item: WorkflowNode<E>;
  field: WorkflowPrompt;
  value: AllowedValues;
};
