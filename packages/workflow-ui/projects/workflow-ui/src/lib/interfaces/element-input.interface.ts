import {State} from '../classes';

/* It's defining an interface called ElementInput. */
export interface ElementInput {
  name: string;
  fields: Record<string, ParamMap>;
}

export type ParamMap = ValueParam | FromParam | StateParam | FormattedParam;

/**
 * A ValueParam is an object with a single property called value, which is a string.
 * @property {string} value - The value of the parameter.
 */
export type ValueParam = {
  value: string;
};

/**
 * `FromParam` is an object with a single property `from` that is a string.
 * @property {string} from - The name of the parameter to be extracted from the URL.
 */
export type FromParam = {
  from: string;
};

/**
 * `StateParam` is an object with a single property called `state` that is a string.
 * @property {string} state - The state of the user.
 */
export type StateParam = {
  state: string;
};

/**
 * `FormattedParam` is a type that represents a function that takes a `State` and returns a `string`.
 *
 * The `formatter` property is a function that takes a `State` and returns a `string`.
 *
 * The `State` type is a generic type that represents the state of the application.
 *
 * The `<S>` syntax is a generic type parameter. It's a placeholder for the actual type of the state.
 *
 * The `<S>` syntax is a generic type parameter. It's a placeholder for the actual type of the state.
 * @property formatter - A function that takes the current state and returns a string.
 */
export type FormattedParam = {
  formatter: <S>(state: State<S>) => string;
};

/**
 * "If the param is a ValueParam, return true, otherwise return false."
 *
 * The function isValueParam() takes a parameter of type ParamMap. The function returns a value of type
 * boolean
 * @param {ParamMap} param - ParamMap - this is the parameter that we're checking.
 * @returns A function that takes a param and returns a boolean.
 */
export function isValueParam(param: ParamMap): param is ValueParam {
  return !!(param as ValueParam).value;
}

/**
 * If the param has a from property, then it's a FromParam.
 * @param {ParamMap} param - ParamMap - The parameter map from the URL.
 * @returns A function that takes a param and returns a boolean.
 */
export function isFromParam(param: ParamMap): param is FromParam {
  return !!(param as FromParam).from;
}

/**
 * If the param has a state property, then it's a StateParam.
 * @param {ParamMap} param - ParamMap - this is the parameter that we're checking.
 * @returns A function that takes a parameter of type ParamMap and returns a boolean.
 */
export function isStateParam(param: ParamMap): param is StateParam {
  return !!(param as StateParam).state;
}

/**
 * If the param has a formatter, then it's a FormattedParam.
 * @param {ParamMap} param - ParamMap - this is the parameter that we're checking.
 * @returns A function that takes a param and returns a boolean.
 */
export function isFormattedParam(param: ParamMap): param is FormattedParam {
  return !!(param as FormattedParam).formatter;
}
