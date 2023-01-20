import {AllowedValues} from '.';
import {WorkflowPrompt} from '../classes/nodes/abstract-prompt.class';
import {WorkflowAction} from '../classes/nodes/abstract-workflow-action.class';
import {WorkflowEvent} from '../classes/nodes/abstract-workflow-event.class';
import {WorkflowNode} from './base.types';

/**
 * A ChangeEvent is an object with a target property that is an object with a value property that is a
 * string.
 * @property target - The target property is the element that triggered the event.
 */
export type ChangeEvent = {
  target: {
    value: string;
  };
};

/**
 * If the event is a ChangeEvent, return true, otherwise return false.
 * @param {Event | ChangeEvent} [event] - Event | ChangeEvent
 * @returns A function that takes an event and returns a boolean.
 */
export function isChangeEvent(
  event?: Event | ChangeEvent,
): event is ChangeEvent {
  return !!(event && (event as ChangeEvent).target.value);
}

/**
 * `EventAddition` is an object with a `name` property and an `event` property. The `name` property is
 * a string and the `event` property is a `WorkflowEvent` object.
 *
 * The `WorkflowEvent` type is defined in the `workflow-events.ts` file.
 * @property {string} name - The name of the event.
 * @property event - The event that will be added to the workflow.
 */
export type EventAddition<E> = {
  name: string;
  event: WorkflowEvent<E>;
};

/**
 * `ActionAddition` is an object with a `name` property and an `action` property. The `name` property
 * is a string and the `action` property is a `WorkflowAction` function.
 * @property {string} name - The name of the action.
 * @property action - The action to be executed.
 */
export type ActionAddition<E> = {
  name: string;
  action: WorkflowAction<E>;
};

/**
 * `InputChanged` is an object with a `item` property that is a `WorkflowNode`, a `field` property that
 * is a `WorkflowPrompt`, and a `value` property that is an `AllowedValues`.
 * @property item - The workflow node that was changed.
 * @property {WorkflowPrompt} field - The field that was changed.
 * @property {AllowedValues} value - AllowedValues;
 */
export type InputChanged<E> = {
  item: WorkflowNode<E>;
  field: WorkflowPrompt;
  value: AllowedValues;
};
