// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {get, OperationObject} from '@loopback/rest';

export function getOnCondition(
  condition: boolean,
  path: string,
  spec?: OperationObject | undefined,
) {
  // sonarignore:start
  if (condition) {
    return get(path, spec);
  } else {
    return () => {};
  }
  // sonarignore:end
}
