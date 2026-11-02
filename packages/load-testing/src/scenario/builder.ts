// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {
  BrowserFlow,
  BrowserOptions,
  FlowItem,
  GroupOptions,
  Method,
  ParallelGroup,
  RawStep,
  LoadRequest,
  MetricThresholds,
  RequestOptions,
  BrowserScenario,
  HttpScenario,
  Scenario,
  ScenarioOptions,
  StepInput,
  WebVital,
} from '../types';
import {mergeHeaders} from './headers';
import {isPlainObject, isRequest} from './guards';
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

/** `load.browser` with or without options. */
type Browser = {
  (name: string, flow: BrowserFlow): BrowserScenario;
  (name: string, options: BrowserOptions, flow: BrowserFlow): BrowserScenario;
};

/** The options that `load.browser` takes. */
const BROWSER_OPTIONS: readonly string[] = [
  'phases',
  'step',
  'steps',
  'flow',
  'vitals',
  'before',
  'after',
];

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
 * strongest last: `headers` merge by name, the last `phases` wins,
 * `thresholds` and `step` merge by field, and `vitals` by Web Vital and
 * field. A key that no layer sets stays out.
 */
function merged(layers: GroupOptions[]): GroupOptions {
  const withKey = (key: keyof GroupOptions) =>
    layers.filter(layer => layer[key] !== undefined);
  const headers = withKey('headers');
  const thresholds = withKey('thresholds');
  const step = withKey('step');
  const vitals = withKey('vitals');
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
    ...(step.length > 0 && {
      step: step.reduce(
        (all: MetricThresholds | undefined, layer) =>
          mergeLimits(all, layer.step),
        undefined,
      ),
    }),
    ...(vitals.length > 0 && {
      vitals: vitals.reduce(
        (all: GroupOptions['vitals'], layer) => mergeVitals(all, layer.vitals),
        undefined,
      ),
    }),
  };
}

/**
 * Merges the vitals of a layer over the ones before, by Web Vital. Like
 * `mergeLimits`, a value that is not an object stays as it is, so that the
 * loader can report it.
 */
function mergeVitals(
  all: GroupOptions['vitals'],
  layer: GroupOptions['vitals'],
): GroupOptions['vitals'] {
  if (!isPlainObject(layer)) return layer;
  if (all !== undefined && !isPlainObject(all)) return all;
  return {
    ...all,
    ...Object.fromEntries(
      Object.entries(layer ?? {}).map(([vital, limits]) => [
        vital,
        mergeLimits(all?.[vital as WebVital], limits),
      ]),
    ),
  };
}

/**
 * Merges the limits of a layer over the ones before, by field. A value that
 * is not an object stays as it is, so that the loader can report it. A
 * plain JavaScript file can set it.
 */
function mergeLimits<T extends MetricThresholds | false>(
  all: T | undefined,
  layer: T | undefined,
): T | undefined {
  if (!isPlainObject(layer)) return layer;
  // An object after `false` turns the Web Vital on again, from its defaults.
  if (all === false) return layer;
  return all === undefined || isPlainObject(all)
    ? ({...all, ...layer} as T)
    : all;
}

/** Leaves out what a browser scenario has no use for: it sends no requests. */
function forBrowser({
  headers,
  thresholds,
  ...rest
}: GroupOptions): GroupOptions {
  return rest;
}

/** Adds the options of the open describes and the flags, and registers the scenario. */
function register<S extends Scenario>(flag: Flag | undefined, scenario: S): S {
  const flagged = (wanted: Flag) =>
    flag === wanted || frames.some(frame => frame.flag === wanted);
  const groups = frames.map(frame => frame.options);
  const added = {
    ...scenario,
    ...merged([
      ...(scenario.browser ? groups.map(forBrowser) : groups),
      scenario,
    ]),
    ...(frames.length > 0 && {group: frames.map(frame => frame.name)}),
    ...(flagged('only') && {only: true}),
    ...(flagged('skip') && {skip: true}),
  };
  registered.push(added);
  return added;
}

function itWith(flag?: Flag) {
  return (
    name: string,
    requests: FlowItem[],
    options: ScenarioOptions = {},
  ): HttpScenario => register(flag, {name, requests, ...options});
}

function checkBrowserOptions(options: BrowserOptions): void {
  const unknownOption = Object.keys(options).find(
    key => !BROWSER_OPTIONS.includes(key),
  );
  if (unknownOption !== undefined) {
    throw new TypeError(
      `load.browser: ${unknownOption} is not an option: use one of ${BROWSER_OPTIONS.join(', ')}`,
    );
  }
}

/** Drops the keys with an undefined value, so the scenario has no empty option. */
function defined<T extends object>(values: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}

function browserWith(flag?: Flag): Browser {
  return (
    name: string,
    second?: BrowserOptions | BrowserFlow,
    third?: BrowserFlow,
  ): BrowserScenario => {
    const [options, flow] =
      typeof second === 'function' ? [{}, second] : [second ?? {}, third];
    const {
      steps,
      flow: flowLimits,
      phases,
      step,
      vitals,
      before,
      after,
    } = options;
    checkBrowserOptions(options);
    return register(flag, {
      name,
      ...defined({
        phases,
        step,
        vitals,
        before,
        after,
      }),
      browser: {
        flow: flow as BrowserFlow,
        ...defined({steps, flowLimits}),
      },
    });
  };
}

/**
 * Hands over the scenarios that `load.it` registered since the last call. The
 * loader calls it before and after it requires a built file.
 */
export function takeRegistered(): Scenario[] {
  return registered.splice(0);
}

/** Requires a built file, and gives the scenarios that its calls register. */
export function registeredIn(file: string): Scenario[] {
  // Drops what an earlier file left behind.
  takeRegistered();
  require(file);
  return takeRegistered();
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
   * `thresholds`, `step`, `vitals`) go to every scenario inside: the
   * scenario beats the inner describe, which beats the outer one.
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
  /**
   * Adds a browser scenario to the file. Each virtual user runs `flow` with
   * a Chromium page and a `step` function that times a part of the flow.
   * The run gates each step and the Web Vitals of the page. `.only` and
   * `.skip` work as for `load.it`. The options `before` and `after` run
   * once per run, as for `load.it`. Their API client needs
   * `LOAD_TESTS_BASE_URL`, and the flow reads what `before` sets in `vars`.
   */
  browser: Object.assign(browserWith(), {
    only: browserWith('only'),
    skip: browserWith('skip'),
  }),
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
