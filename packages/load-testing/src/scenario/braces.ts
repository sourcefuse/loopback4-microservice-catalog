// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {isPlainObject, isTemplate} from './guards';
import type {LoadRequest, Scenario} from '../types';

/** Starts a template in Artillery. Artillery expands the text that holds it. */
export const OPEN_BRACES = '{{';

/**
 * Finds the plain strings with `{{` in a value, and says where they are. It
 * also finds the object keys with `{{`, because the engine fills in keys too.
 */
function bracesIn(value: unknown, place: string): string[] {
  if (typeof value === 'string') {
    return value.includes(OPEN_BRACES)
      ? [`${place} contains "${OPEN_BRACES}": use template\`...\``]
      : [];
  }
  if (isTemplate(value)) {
    return value.parts.flatMap(part => bracesIn(part, place));
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => bracesIn(item, `${place}[${index}]`));
  }
  if (isPlainObject(value)) {
    return Object.entries(value).flatMap(([key, item]) => [
      ...(key.includes(OPEN_BRACES)
        ? [`${place} key "${key}" contains "${OPEN_BRACES}": rename the key`]
        : []),
      ...bracesIn(item, `${place}.${key}`),
    ]);
  }
  return [];
}

/**
 * Finds the plain strings of a request that contain `{{`: in `path`,
 * `pathParams`, `headers`, `query` and `json`, and the object keys there.
 * Such a string is a template that a user wrote in the syntax of one engine.
 * A value must go through `template`, so that each engine can render it. The
 * strings under `artillery` are not checked. Each problem is a line, for
 * example `POST /orders: json.name contains "{{": use template`...``.
 */
export function bracesProblems(req: LoadRequest): string[] {
  const {pathParams, headers, query, json} = req.options;
  return [
    ...bracesIn(req.path, 'path'),
    ...bracesIn(pathParams, 'pathParams'),
    ...bracesIn(headers, 'headers'),
    ...bracesIn(query, 'query'),
    ...bracesIn(json, 'json'),
  ].map(problem => `${req.id}: ${problem}`);
}

/**
 * Finds the plain strings of the scenario `headers` that contain `{{`, as
 * `bracesProblems` does for a request.
 */
export function headerBracesProblems(scenario: Scenario): string[] {
  return bracesIn(scenario.headers, 'headers');
}
