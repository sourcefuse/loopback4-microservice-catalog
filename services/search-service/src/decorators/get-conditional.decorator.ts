// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {get, OperationObject} from '@loopback/rest';

export function getOnCondition(
  condition: boolean,
  path: string,
  spec?: OperationObject | undefined,
) {
  if (condition) {
    return get(path, spec);
  } else {
    return () => {}; //NOSONAR
  }
}
