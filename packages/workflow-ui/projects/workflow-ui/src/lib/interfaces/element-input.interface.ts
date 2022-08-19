import {State} from '../classes';

export interface ElementInput {
  name: string;
  fields: Record<string, ParamMap>;
}

export type ParamMap = ValueParam | FromParam | StateParam | FormattedParam;

export type ValueParam = {
  value: string;
};

export type FromParam = {
  from: string;
};

export type StateParam = {
  state: string;
};

export type FormattedParam = {
  formatter: <S>(state: State<S>) => string;
};

export function isValueParam(param: ParamMap): param is ValueParam {
  return !!(param as ValueParam).value;
}
export function isFromParam(param: ParamMap): param is FromParam {
  return !!(param as FromParam).from;
}
export function isStateParam(param: ParamMap): param is StateParam {
  return !!(param as StateParam).state;
}
export function isFormattedParam(param: ParamMap): param is FormattedParam {
  return !!(param as FormattedParam).formatter;
}
