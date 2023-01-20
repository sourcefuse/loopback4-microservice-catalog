import {WorkflowPrompt} from '../classes/nodes/abstract-prompt.class';
import {WorkflowAction} from '../classes/nodes/abstract-workflow-action.class';
import {WorkflowEvent} from '../classes/nodes/abstract-workflow-event.class';
import {ConditionTypes} from '../enum';
import {AndGroup, OrGroup} from '../services/statement/groups';

/**
 * A RecordOfAnyType is a record whose keys are strings and whose values are of any type.
 * @property {any} [key: any] - This is the key of the object. It can be any type.
 */
export type RecordOfAnyType = {
  // sonarignore:start
  [key: string]: any;
  // sonarignore:end
};

export type AllowedValues = string | number | object | boolean;

/**
 * `AllowedValuesMap` is an object whose keys are strings and whose values are `AllowedValues`.
 * @property {AllowedValues} [key: AllowedValues] - This is the key of the object. The key is a string,
 * and the value is an array of strings.
 */
export type AllowedValuesMap = {
  [key: string]: AllowedValues;
};

// sonarignore:start
export type Constructor<T> = new (...args: any) => T;
// sonarignore:end
export type StrategyFunction<R, S> = (arg: R) => S;

/**
 * `ConditionOperatorPair` is an object with a `condition` property of type `ConditionTypes`, an
 * `operator` property of type `string`, and a `value` property of type `boolean`.
 * @property {ConditionTypes} condition - The condition type.
 * @property {string} operator - The operator to use for the condition.
 * @property {boolean} value - The value of the condition.
 */
export type ConditionOperatorPair = {
  condition: ConditionTypes;
  operator: string;
  value: boolean;
};

export type WorkflowNode<E> = WorkflowAction<E> | WorkflowEvent<E>;

export type BaseGroup<E> = AndGroup<E> | OrGroup<E>;

/**
 * `ActionWithInput` is an object with a `node` property of type `WorkflowAction` and an `inputs`
 * property of type `WorkflowPrompt[]`.
 * @property node - The action node that is being executed.
 * @property {WorkflowPrompt[]} inputs - The inputs that the user will be prompted for.
 */
export type ActionWithInput<E> = {
  node: WorkflowAction<E>;
  inputs: WorkflowPrompt[];
};

/**
 * `EventWithInput` is a type that represents a `WorkflowEvent` with a list of `WorkflowPrompt`s.
 * @property node - The event node that was triggered.
 * @property {WorkflowPrompt[]} inputs - The inputs that are required for the event to be executed.
 */
export type EventWithInput<E> = {
  node: WorkflowEvent<E>;
  inputs: WorkflowPrompt[];
};

/**
 * `ElementsWithInput` is a type that represents a `WorkflowNode` and a `NodeWithInput` that are
 * related to each other.
 *
 * The `ElementsWithInput` type is used in the `getElementsWithInput` function.
 * @property node - The original node that we're going to be replacing.
 * @property newNode - The new node that will be added to the workflow.
 */
export type ElementsWithInput<E> = {
  node: WorkflowNode<E>;
  newNode: NodeWithInput<E>;
};

export type NodeWithInput<E> = EventWithInput<E> | ActionWithInput<E>;

/**
 * `StateMap` is a type that takes a generic type `R` and returns a type that is a map of strings to
 * `R`.
 * @property {R} [key: R] - R;
 */
export type StateMap<R extends RecordOfAnyType> = {
  [key: string]: R;
};

export type DecoratedContructor<R> = Constructor<R> & {
  ctorParameters: () => ConstructorParameters[];
};

/**
 * It's an array of objects, each of which has a property called args, which is an array of strings.
 * @property {{
 *     args: string[];
 *   }[]} decorators - An array of decorators that are applied to the class.
 * @property {string} type - The type of the parameter.
 */
export type ConstructorParameters = {
  decorators: {
    args: string[];
  }[];
  type: string;
};

/**
 * A Dropdown is an object with an id and a fullName.
 * @property {string} id - The id of the user.
 * @property {string} fullName - The full name of the user.
 */
export type Dropdown = {
  id: string;
  fullName: string;
};

/**
 * Select is an object with a text property that is a string and a value property that is a string.
 * @property {string} text - The text that will be displayed in the dropdown.
 * @property {string} value - The value of the select option.
 */
export type Select = {
  text: string;
  value: string;
};

/**
 * DateType is an object with three properties: month, day, and year, all of which are numbers.
 * @property month - The month of the date.
 * @property day - The day of the month.
 * @property year - The year of the date.
 */
export type DateType = {month: 0; day: 0; year: 0};

/**
 * `DateTime` is an object with a `date` property of type `DateType` and a `time` property of type
 * `{hour: null; minute: null}`.
 * @property {DateType} date - The date of the event.
 * @property time - {hour: null; minute: null}
 */
export type DateTime = {
  date: DateType;
  time: {hour: null; minute: null};
};

/**
 * `EmailInput` is an object with three properties: `subject`, `body`, and `focusKey`.
 *
 * The `subject` and `body` properties are both strings. The `focusKey` property is a string that is
 * either `"subject"` or `"body"`.
 *
 * The `focusKey` property is a string that is either `"subject"` or `"body"`.
 *
 * The `focusKey` property is a string that is either `"subject"` or `"body"`.
 *
 * The `focusKey` property is a
 * @property {string} subject - The subject of the email.
 * @property {string} body - The body of the email.
 * @property {string} focusKey - The key of the input that should be focused when the email input is
 * rendered.
 */
export type EmailInput = {
  subject: string;
  body: string;
  focusKey: string;
};

/**
 * `ENV` is an object with a property called `envIdentifier` that is a string.
 * @property {string} envIdentifier - This is the name of the environment. It's used to identify the
 * environment in the `.env` file.
 */
export type ENV = {
  envIdentifier: string;
};
