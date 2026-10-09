// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {isPlainObject, isValue} from '../../scenario/guards';
import type {Capture, HeaderMap, Value, Var} from '../../scenario/types';
import type {LoadRequest, ParallelGroup, Scenario} from '../../types';
import {mergeHeaders} from '../../scenario/headers';
import type {CaptureStep} from './types';

/** A placeholder of an OpenAPI path. Its name is any text without braces or a slash. */
const PATH_PARAM = /\{([^{}/]+)\}/g;

/**
 * Starts the name of the variable of a capture. The `loadTests` prefix is
 * reserved for generated names, so it cannot clash with the vars of a run or
 * with a capture that a consumer names.
 */
const CAPTURE_PREFIX = 'loadTestsCapture_';

/** The environment variable that holds the token for Artillery. */
export const TOKEN_ENV = 'LOAD_TESTS_TOKEN';

type Entries = Record<string, string | number | boolean | Value>;

/** The headers of a request, over the headers of its scenario. */
function headersOf(
  req: LoadRequest,
  scenario: Scenario,
): HeaderMap | undefined {
  if (scenario.headers === undefined) return req.options.headers;
  return mergeHeaders(scenario.headers, req.options.headers);
}

/**
 * Turns the values of the requests into Artillery templates: in the path
 * params, the JSON bodies, the headers and the query. `known` holds the names
 * that `vars(name)` may use. The errors are messages: the caller decides what
 * to do with them. `groups` are the parallel groups of the flow: a request
 * cannot capture from a request of its own group. The `headers` of the
 * scenario go under the headers of each request.
 */
export function resolveRequests(
  scenario: Scenario,
  requests: LoadRequest[],
  known: ReadonlySet<string>,
  groups: ParallelGroup[] = [],
): {
  /** The URL of each request, with its path params in place. */
  urls: string[];
  /** The JSON body of each request, with its values in place. */
  bodies: unknown[];
  /** The headers that the request sets, with their values in place. */
  headers: (Record<string, string> | undefined)[];
  /** The query of each request, with its values in place. */
  queries: (Record<string, string> | undefined)[];
  /** What each request must capture, for the requests after it. */
  captures: CaptureStep[][];
  errors: string[];
} {
  const errors: string[] = [];
  const captures = requests.map((): CaptureStep[] => []);
  let captured = 0;

  /*
   * Turns one captured value into an Artillery `{{ var }}` template, and
   * records where Artillery should read it from. Each binding gets a
   * variable of its own, whatever the key of the body field is: the keys
   * `client.id` and `client-id` must not share a variable.
   */
  function bind(req: LoadRequest, at: number, value: Capture): string {
    const source = earlierIndex(requests, at, value.from, groups);
    if (typeof source === 'string') {
      errors.push(`${req.id}: ${source}`);
      return '';
    }
    const variable = `${CAPTURE_PREFIX}${captured++}`;
    captures[source].push({json: value.jsonPath, as: variable});
    return `{{ ${variable} }}`;
  }

  function useVar(req: LoadRequest, value: Var): string {
    if (!known.has(value.name)) {
      errors.push(
        `${req.id}: vars("${value.name}") is set by neither before nor beforeEach`,
      );
    }
    return `{{ ${value.name} }}`;
  }

  /** The Artillery text of one value. */
  function render(req: LoadRequest, at: number, value: Value): string {
    switch (value.kind) {
      case 'capture':
        return bind(req, at, value);
      case 'var':
        return useVar(req, value);
      case 'token':
        return `{{ $env.${TOKEN_ENV} }}`;
      case 'randomString':
        return `{{ $randomString(${value.length}) }}`;
      case 'randomNumber':
        return `{{ $randomNumber(${value.min}, ${value.max}) }}`;
      case 'uuid':
        return '{{ $uuid }}';
      case 'template':
        return value.parts
          .map(part =>
            typeof part === 'string' ? part : render(req, at, part),
          )
          .join('');
    }
  }

  function resolveUrl(req: LoadRequest, at: number): string {
    return req.path.replace(PATH_PARAM, (match, param: string) => {
      const value = req.options.pathParams?.[param];
      if (value === undefined) {
        errors.push(`${req.id}: no value for {${param}}`);
        return match;
      }
      return isValue(value)
        ? render(req, at, value)
        : encodeURIComponent(String(value));
    });
  }

  /*
   * Walks the body the same way Artillery walks a script: through plain
   * objects and arrays only, so a Date or a class instance passes through
   * untouched. A value becomes a string; everything else, including its
   * type, is left as the consumer wrote it.
   */
  function resolveBody(req: LoadRequest, at: number): unknown {
    const {json} = req.options;
    if (json === undefined) return undefined;
    const walk = (value: unknown): unknown => {
      if (isValue(value)) return render(req, at, value);
      if (Array.isArray(value)) return value.map(walk);
      if (isPlainObject(value)) {
        return Object.fromEntries(
          Object.entries(value).map(([key, v]) => [key, walk(v)]),
        );
      }
      return value;
    };
    return walk(json);
  }

  /** Header and query entries: a value is rendered, anything else is a string. */
  function resolveEntries(
    req: LoadRequest,
    at: number,
    entries: Entries | undefined,
  ): Record<string, string> | undefined {
    if (entries === undefined) return undefined;
    return Object.fromEntries(
      Object.entries(entries).map(([key, v]) => [
        key,
        isValue(v) ? render(req, at, v) : String(v),
      ]),
    );
  }

  return {
    urls: requests.map((req, index) => resolveUrl(req, index)),
    bodies: requests.map((req, index) => resolveBody(req, index)),
    headers: requests.map((req, index) =>
      resolveEntries(req, index, headersOf(req, scenario)),
    ),
    queries: requests.map((req, index) =>
      resolveEntries(req, index, req.options.query),
    ),
    captures,
    errors,
  };
}

/**
 * Returns the index of the last request `from` before `index`, or why not.
 * The source must not be in the parallel group of the request: the requests
 * of a group run at the same time.
 */
function earlierIndex(
  requests: LoadRequest[],
  index: number,
  from: string,
  groups: ParallelGroup[],
): number | string {
  const current = requests[index];
  const peers =
    groups.find(group => group.requests.includes(current))?.requests ?? [];
  const source = requests
    .slice(0, index)
    .map(req => req.id)
    .lastIndexOf(from);
  if (source >= 0 && !peers.includes(requests[source])) return source;
  if (peers.some(req => req !== current && req.id === from)) {
    return `capture source "${from}" runs in parallel with this request`;
  }
  return requests.some(req => req.id === from)
    ? `capture source "${from}" is not earlier in the flow`
    : `capture source "${from}" is not a request in this scenario`;
}
