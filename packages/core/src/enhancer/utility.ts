// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {PathsObject} from 'openapi3-ts';
import {OasHiddenApi} from '../keys';
import {HttpMethod, OasKeyMap} from '../enums';
function apiSearchFunction(
  apiSearch: [string, OasHiddenApi],
  path: PathsObject,
) {
  Object.values(HttpMethod).forEach(method => {
    if (path[OasKeyMap[method]] && apiSearch[1]['httpMethod'] === method) {
      delete path[OasKeyMap[method]];
    }
  });
}
export function apiHide(
  arrayApiSearch: [string, OasHiddenApi][],
  paths: PathsObject,
) {
  arrayApiSearch.forEach(apiSearch => {
    for (const path in paths) {
      if (path === apiSearch[1]['path']) {
        apiSearchFunction(apiSearch, paths[path]);
      }
    }
  });
}
