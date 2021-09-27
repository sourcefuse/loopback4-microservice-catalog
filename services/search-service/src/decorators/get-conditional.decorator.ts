import {get, OperationObject} from '@loopback/rest';

export function getOnCondition(
  condition: boolean,
  path: string,
  spec?: OperationObject | undefined,
) {
  if (condition) {
    return get(path, spec);
  } else {
    return () => {};
  }
}
