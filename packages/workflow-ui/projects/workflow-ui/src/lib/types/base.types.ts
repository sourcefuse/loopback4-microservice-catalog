import {WorkflowPrompt} from '../classes/nodes/abstract-prompt.class';
import {WorkflowAction} from '../classes/nodes/abstract-workflow-action.class';
import {WorkflowEvent} from '../classes/nodes/abstract-workflow-event.class';
import {ConditionTypes} from '../enum';

export type RecordOfAnyType = {
  // sonarignore:start
  [key: string]: any;
  // sonarignore:end
};

export type AllowedValues = string | number | object | boolean;

export type AllowedValuesMap = {
  [key: string]: AllowedValues;
};

// sonarignore:start
export type Constructor<T> = new (...args: any) => T;
// sonarignore:end
export type StrategyFunction<R, S> = (arg: R) => S;

export type ConditionOperatorPair = {
  condition: ConditionTypes;
  operator: string;
  value: boolean;
};

export type WorkflowNode<E> = WorkflowAction<E> | WorkflowEvent<E>;

export type ActionWithInput<E> = {
  node: WorkflowAction<E>;
  inputs: WorkflowPrompt[];
};

export type EventWithInput<E> = {
  node: WorkflowEvent<E>;
  inputs: WorkflowPrompt[];
};

export type NodeWithInput<E> = EventWithInput<E> | ActionWithInput<E>;

export type StateMap<R extends RecordOfAnyType> = {
  [key: string]: R;
};

export type DecoratedContructor<R> = Constructor<R> & {
  ctorParameters: () => ConstructorParameters[];
};

export type ConstructorParameters = {
  decorators: {
    args: string[];
  }[];
  type: string;
};
