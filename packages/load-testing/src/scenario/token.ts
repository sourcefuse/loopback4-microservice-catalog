// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {isPlainObject, isTemplate, isValue, requestsIn} from './guards';
import type {Scenario} from '../types';

/** True when `token()` is in the value, at any depth, also inside a template. */
function hasToken(value: unknown): boolean {
  if (isValue(value)) {
    return (
      value.kind === 'token' ||
      (isTemplate(value) && value.parts.some(hasToken))
    );
  }
  if (Array.isArray(value)) return value.some(hasToken);
  if (isPlainObject(value)) return Object.values(value).some(hasToken);
  return false;
}

/**
 * True when the scenario sends the access token: `token()` is in its
 * `headers`, or in the `headers`, `query`, `pathParams` or `json` of a
 * request (also a request in a `load.step`). The CLI uses this to know if
 * the scenario needs a login, and if the token check must run.
 */
export function usesToken(scenario: Scenario): boolean {
  return (
    hasToken(scenario.headers) ||
    requestsIn(scenario.requests).some(({options}) =>
      [options.headers, options.query, options.pathParams, options.json].some(
        hasToken,
      ),
    )
  );
}
