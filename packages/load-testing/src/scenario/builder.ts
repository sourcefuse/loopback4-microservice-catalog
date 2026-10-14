// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {
  FlowItem,
  GroupOptions,
  Method,
  ParallelGroup,
  RawStep,
  LoadRequest,
  RequestOptions,
  Scenario,
  ScenarioOptions,
  StepInput,
} from '../types';
import {mergeHeaders} from './headers';
import {isRequest} from './guards';
import {brand} from './brand';

function request(method: Method) {
  return (path: string, options: RequestOptions = {}): LoadRequest =>
    brand({
      kind: 'request',
      id: `${method} ${path}`,
      method,
      path,
      options,
    });
}

function parallel(
  requests: LoadRequest[],
  options: {limit?: number} = {},
): ParallelGroup {
  if (!Array.isArray(requests) || requests.length === 0) {
    throw new TypeError('load.parallel: the list of requests cannot be empty');
  }
  if (!requests.every(isRequest)) {
    throw new TypeError(
      'load.parallel: every item must be a request, made with load.get (or post, put, ...)',
    );
  }
  const {limit} = options;
  if (limit !== undefined && (!Number.isInteger(limit) || limit < 1)) {
    throw new TypeError(
      `load.parallel: the limit must be a whole number above 0, not ${limit}`,
    );
  }
  return brand({
    kind: 'parallel',
    requests,
    ...(limit !== undefined && {limit}),
  });
}

type Flag = 'only' | 'skip';

/** A `load.describe` that is open. */
type Frame = {
  name: string;
  flag?: Flag;
  options: GroupOptions;
};

/** `load.describe` with or without options. */
type Describe = {
  (name: string, define: () => void): void;
  (name: string, options: GroupOptions, define: () => void): void;
};

/** The `load.describe` blocks that are open, the outermost first. */
const frames: Frame[] = [];

/** What `load.it` registered, and the loader has not taken yet. */
const registered: Scenario[] = [];

function describeWith(flag?: Flag): Describe {
  return (
    name: string,
    second: GroupOptions | (() => void),
    third?: () => void,
  ): void => {
    const [options, define] =
      typeof second === 'function'
        ? [{}, second]
        : [second, third as () => void];
    frames.push({name, flag, options});
    try {
      const returned: unknown = define();
      if (
        typeof (returned as {then?: unknown} | undefined)?.then === 'function'
      ) {
        throw new TypeError(
          `load.describe("${name}"): the function cannot be async`,
        );
      }
    } finally {
      frames.pop();
    }
  };
}

/**
 * Merges the options of the open describes and of the scenario, the
 * strongest last: `headers` merge by name, the last `phases` wins, and
 * `thresholds` merge by field. A key that no layer sets stays out.
 */
function merged(layers: GroupOptions[]): GroupOptions {
  const withKey = (key: keyof GroupOptions) =>
    layers.filter(layer => layer[key] !== undefined);
  const headers = withKey('headers');
  const thresholds = withKey('thresholds');
  const phases = withKey('phases').at(-1)?.phases;
  return {
    ...(headers.length > 0 && {
      headers: headers.reduce(
        (all: GroupOptions['headers'], layer) =>
          mergeHeaders(all, layer.headers),
        undefined,
      ),
    }),
    ...(phases && {phases}),
    ...(thresholds.length > 0 && {
      thresholds: Object.assign({}, ...thresholds.map(l => l.thresholds)),
    }),
  };
}

function itWith(flag?: Flag) {
  return (
    name: string,
    requests: FlowItem[],
    options: ScenarioOptions = {},
  ): Scenario => {
    const flagged = (wanted: Flag) =>
      flag === wanted || frames.some(frame => frame.flag === wanted);
    const added: Scenario = {
      name,
      requests,
      ...options,
      ...merged([...frames.map(frame => frame.options), options]),
      ...(frames.length > 0 && {group: frames.map(frame => frame.name)}),
      ...(flagged('only') && {only: true}),
      ...(flagged('skip') && {skip: true}),
    };
    registered.push(added);
    return added;
  };
}

/**
 * Hands over the scenarios that `load.it` registered since the last call. The
 * loader calls it before and after it requires a built file.
 */
export function takeRegistered(): Scenario[] {
  return registered.splice(0);
}

/**
 * Builds scenarios. The HTTP methods sit on one object because `delete` is a
 * reserved word and cannot be a function name.
 */
export const load = {
  /**
   * Groups the scenarios of a file, like `describe` of Mocha. The function
   * runs at once and cannot be async. `.only` and `.skip` apply to every
   * scenario inside. The optional `options` (`headers`, `phases`,
   * `thresholds`) go to every scenario inside: `load.it` beats the inner
   * describe, which beats the outer one.
   */
  describe: Object.assign(describeWith(), {
    only: describeWith('only'),
    skip: describeWith('skip'),
  }),
  /**
   * Adds a scenario to the file, like `it` of Mocha. Use a sentence for the
   * name. `.only` runs just the scenarios with `only`, and `.skip` leaves
   * the scenario out and wins over `.only`.
   */
  it: Object.assign(itWith(), {only: itWith('only'), skip: itWith('skip')}),
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  patch: request('PATCH'),
  delete: request('DELETE'),
  /**
   * Runs requests at the same time in one virtual user, for example
   * `load.parallel([load.get('/orders'), load.get('/customers')])`. The
   * requests of the group start together, and the flow goes on when all of
   * them are done. A request after the group can capture from a request of
   * the group; a request of the group cannot capture from another one.
   * `limit` is the largest number of requests that run at once. Only
   * requests can go in a group: no `load.step` and no other group.
   */
  parallel,
  /**
   * An Artillery flow step, for example `{think: 1}` or
   * `{loop: [load.get('/a')], count: 2}`.
   */
  step: (step: StepInput): RawStep => brand({kind: 'raw', step}),
};
