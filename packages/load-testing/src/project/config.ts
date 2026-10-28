// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import fs from 'node:fs';
import path from 'node:path';
import type {
  BrowserLimitOptions,
  LoadTestConfig,
  MetricThresholds,
  BrowserScenario,
  Thresholds,
  WebVital,
} from '../types';
import {toSeconds} from '../scenario/workload';
import {isPlainObject} from '../scenario/guards';
import {builtFile, CONFIG_FILE} from './layout';
import {ConfigError} from '../errors';
import type {
  BrowserLimits,
  ResolvedMetricThresholds,
  ResolvedThresholds,
} from './types';

/** Starts the name of each variable that only the CLI reads. */
export const CLI_ONLY_PREFIX = 'LOAD_TESTS_';

/**
 * Common p95 targets for HTTP APIs, in milliseconds. Use one as the `p95` of
 * an endpoint, so that a reader sees which kind of API the limit is for. A
 * limit above the target of its kind is a deviation: write the reason next to
 * it, and let the review approve it.
 */
export const P95_TARGETS = {
  /**
   * User-blocking APIs, which a user waits for: 300 to 500 ms where
   * practical. This is the default limit.
   */
  userBlockingApi: 500,
  /**
   * Supporting APIs, such as reports and exports: 700 ms to 1 s where
   * practical. It is the highest target for an API.
   */
  supportingApi: 1000,
  /**
   * Not a target for an API. Work of more than 5 s should be async, or have
   * an explicit approval. An endpoint that uses this value as its `p95` is
   * performance debt, and a heavy API: see `maxHeavyApis`.
   */
  heavyOperation: 5000,
} as const;

/**
 * The p95 targets of the standard for a browser step, in ms. Use one as the
 * `p95` of a step, so that a reader sees which kind of screen the limit is
 * for. A limit above its target is a deviation: write the reason next to it.
 */
export const UI_TARGETS = {
  /** Login, save, submit or search. This is the default limit of a step. */
  criticalAction: 1500,
  /** A standard page or workflow. */
  standardPage: 2500,
  /** A data-heavy screen that shows a loader. */
  dataHeavyScreen: 5000,
  /** The loader or the result of an action that is not instant. */
  feedback: 1000,
  /** A route change in a single-page app. */
  routeChange: 1000,
} as const;

/**
 * The "good" limits of Google for each Web Vital, which the standard uses.
 * The library gates their p95. CLS has no unit; the others are in ms.
 */
export const WEB_VITALS_TARGETS = {
  FCP: 1800,
  LCP: 2500,
  CLS: 0.1,
  TTFB: 800,
  INP: 200,
} as const;

/**
 * The values of `Thresholds` when nothing sets them. The units are in
 * `Thresholds`. Every endpoint counts as user-blocking until it sets another
 * target. A strict default fails safe: a looser limit must be written next to
 * the endpoint, where the review sees it. For why the default is 500 ms and
 * not 300 ms, see the caution in the README.
 */
const LIBRARY_DEFAULTS: ResolvedThresholds = {
  p95Regression: 20,
  minDelta: 10,
  errorRate: 1,
  p95: P95_TARGETS.userBlockingApi,
};

const METRIC_DEFAULTS = {
  p95Regression: LIBRARY_DEFAULTS.p95Regression,
  minDelta: LIBRARY_DEFAULTS.minDelta,
};

/**
 * The limits of each Web Vital when nothing sets them, in the order of the
 * report. Artillery rounds CLS to 1 decimal, so its `minDelta` is one step
 * of the report.
 */
const VITAL_DEFAULTS: Record<WebVital, ResolvedMetricThresholds> = {
  FCP: {...METRIC_DEFAULTS, p95: WEB_VITALS_TARGETS.FCP},
  LCP: {...METRIC_DEFAULTS, p95: WEB_VITALS_TARGETS.LCP},
  CLS: {...METRIC_DEFAULTS, p95: WEB_VITALS_TARGETS.CLS, minDelta: 0.1},
  TTFB: {...METRIC_DEFAULTS, p95: WEB_VITALS_TARGETS.TTFB},
  INP: {...METRIC_DEFAULTS, p95: WEB_VITALS_TARGETS.INP},
};

const METRIC_KEYS = ['p95Regression', 'minDelta', 'p95'] as const;

const THRESHOLD_KEYS = [
  'p95Regression',
  'minDelta',
  'p95',
  'errorRate',
] as const;

/** Loads the default export of the config file, as `tsc` built it. */
export function readConfig(pkgDir: string): LoadTestConfig {
  const source = path.join(pkgDir, CONFIG_FILE);
  if (!fs.existsSync(source)) {
    throw new ConfigError(
      `No ${CONFIG_FILE}. Add one that exports the default config (with phases) and, if you want, thresholds.`,
    );
  }
  const config: unknown = require(builtFile(pkgDir, source)).default;
  if (config === undefined) {
    throw new ConfigError(
      `${CONFIG_FILE} has no default export: export default config`,
    );
  }
  const problems = configProblems(config);
  if (problems.length > 0) {
    throw new ConfigError(`${CONFIG_FILE}:`, problems);
  }
  return config as LoadTestConfig;
}

/**
 * Returns what is wrong with the values of the config. Empty means nothing.
 * The type checks the keys when the package builds.
 */
export function configProblems(config: unknown): string[] {
  if (typeof config !== 'object' || config === null) {
    return ['the default export must be an object'];
  }
  const {
    phases,
    artillery,
    thresholds,
    datasources,
    engine,
    apis,
    reporters,
    tokenCheck,
    maxHeavyApis,
  } = config as Partial<LoadTestConfig>;
  const limits: Thresholds | undefined = thresholds?.default;
  const problems = [
    ...phaseProblems(phases, 'phases'),
    ...artilleryConfigProblems(artillery?.config, 'artillery.config'),
    ...artilleryEnvProblems(artillery?.env),
    ...browserEngineProblems(artillery?.browsers),
    ...thresholdProblems(limits, 'thresholds.default.'),
    ...browserLimitProblems(thresholds, 'thresholds.'),
    ...datasourceProblems(datasources),
    ...engineProblems(engine),
    ...apisProblems(apis),
    ...reporterProblems(reporters),
  ];
  if (tokenCheck !== undefined && typeof tokenCheck !== 'function') {
    problems.push('tokenCheck must be a function');
  }
  if (
    maxHeavyApis !== undefined &&
    !(Number.isInteger(maxHeavyApis) && maxHeavyApis >= 0)
  ) {
    problems.push('maxHeavyApis must be a whole number, 0 or more');
  }
  return problems;
}

/**
 * Returns what is wrong with an Artillery `config` of the package or of a
 * scenario: the library owns `phases`, `processor`, `target`, the
 * `metrics-by-endpoint` plugin and `engines.playwright.aggregateByName`. A
 * change of `target` would send the load to another host than `before` and
 * `after` use. A change of the plugin would rename the metrics, and the
 * report would find no request. A change of `aggregateByName` would rename
 * the metrics of a browser scenario, and the report would find no Web Vital.
 * `where` starts each message.
 */
export function artilleryConfigProblems(
  config:
    | {
        phases?: unknown;
        processor?: unknown;
        target?: unknown;
        plugins?: Record<string, unknown>;
        engines?: object;
      }
    | undefined,
  where: string,
): string[] {
  const problems: string[] = [];
  if (config?.target !== undefined) {
    problems.push(
      `${where}.target is not allowed: the library sets it from LOAD_TESTS_BASE_URL or LOAD_TESTS_UI_URL`,
    );
  }
  for (const [name, options] of Object.entries(config?.engines ?? {})) {
    if (Object(options).aggregateByName !== undefined) {
      problems.push(
        `${where}.engines.${name}.aggregateByName is not allowed: the library sets it`,
      );
    }
  }
  if (config?.plugins?.['metrics-by-endpoint'] !== undefined) {
    problems.push(
      `${where}.plugins['metrics-by-endpoint'] is not allowed: the library sets it`,
    );
  }
  if (config?.phases !== undefined) {
    problems.push(`${where}.phases is not allowed: use phases`);
  }
  if (config?.processor !== undefined) {
    problems.push(`${where}.processor is not allowed: use artillery.processor`);
  }
  return problems;
}

/** Returns what is wrong with `artillery.env`: a list of names. */
function artilleryEnvProblems(names: unknown): string[] {
  if (names === undefined) return [];
  if (!Array.isArray(names)) {
    return [
      'artillery.env must be an array of variable names, for example ["MY_REGION"]',
    ];
  }
  return names.flatMap((name: unknown, index) => {
    const where = `artillery.env[${index}]`;
    if (typeof name !== 'string' || name === '') {
      return [`${where} must be a text that is not empty`];
    }
    if (name.includes('=')) return [`${where} must not have "="`];
    if (name.toUpperCase().startsWith(CLI_ONLY_PREFIX)) {
      return [
        `${where} "${name}" is not allowed: these variables are for the CLI only`,
      ];
    }
    return [];
  });
}

/** Returns what is wrong with `artillery.browsers`: a list of browsers with unique names. */
function browserEngineProblems(browsers: unknown): string[] {
  if (browsers === undefined) return [];
  if (!Array.isArray(browsers) || browsers.length === 0) {
    return [
      'artillery.browsers must be a list that is not empty, for example [chromium()]',
    ];
  }
  return browsers.flatMap((browser: unknown, index) => {
    const where = `artillery.browsers[${index}]`;
    const {name, engine, engineOptions, vitals, check} = Object(
      browser,
    ) as Record<string, unknown>;
    const problems: string[] = [];
    if (typeof name !== 'string' || name === '') {
      problems.push(`${where}.name must be a text that is not empty`);
    } else if (
      browsers.findIndex(other => Object(other).name === name) !== index
    ) {
      problems.push(`${where}.name "${name}" is used twice`);
    }
    if (typeof engine !== 'string' || engine === '') {
      problems.push(`${where}.engine must be a text that is not empty`);
    }
    if (engineOptions !== undefined && !isPlainObject(engineOptions)) {
      problems.push(`${where}.engineOptions must be an object`);
    } else if (engineOptions?.aggregateByName !== undefined) {
      problems.push(
        `${where}.engineOptions.aggregateByName is not allowed: the library sets it`,
      );
    }
    if (
      !Array.isArray(vitals) ||
      vitals.some(vital => !Object.hasOwn(VITAL_DEFAULTS, String(vital)))
    ) {
      problems.push(
        `${where}.vitals must be a list of Web Vitals: ${Object.keys(VITAL_DEFAULTS).join(', ')}`,
      );
    }
    if (check !== undefined && typeof check !== 'function') {
      problems.push(`${where}.check must be a function`);
    }
    return problems;
  });
}

/** Returns what is wrong with `apis`: names that map to variable names. */
function apisProblems(apis: unknown): string[] {
  if (apis === undefined) return [];
  if (typeof apis !== 'object' || apis === null || Array.isArray(apis)) {
    return [
      "apis must be an object of names and variable names, for example {auth: 'LOAD_TESTS_AUTH_SERVICE_URL'}",
    ];
  }
  return Object.entries(apis).flatMap(([name, variable]) =>
    typeof variable === 'string' && /^[A-Za-z_][A-Za-z0-9_]*$/.test(variable)
      ? []
      : [
          `apis.${name} must be the name of a variable, for example LOAD_TESTS_AUTH_SERVICE_URL`,
        ],
  );
}

/** Returns what is wrong with `engine`: it needs a name and a `run` function. */
function engineProblems(engine: unknown): string[] {
  if (engine === undefined) return [];
  const {name, run} = Object(engine) as Record<string, unknown>;
  if (typeof run === 'function' && typeof name === 'string' && name !== '') {
    return [];
  }
  return [
    'engine must be an object with a `name` and a `run` function, for example artillery()',
  ];
}

/** Returns what is wrong with `reporters`: a list of objects with a name and `onRunEnd`. */
function reporterProblems(reporters: unknown): string[] {
  if (reporters === undefined) return [];
  if (!Array.isArray(reporters)) {
    return ['reporters must be an array, for example [consoleReporter()]'];
  }
  return reporters.flatMap((reporter: unknown, index) => {
    const {name, onRunEnd} = Object(reporter) as Record<string, unknown>;
    if (
      typeof onRunEnd === 'function' &&
      typeof name === 'string' &&
      name !== ''
    ) {
      return [];
    }
    return [
      `reporters[${index}] must be an object with a \`name\` and an \`onRunEnd\` function`,
    ];
  });
}

/** The options of a postgres datasource that hold a time in milliseconds. */
const POSTGRES_TIME_OPTIONS = ['statementTimeoutMs', 'connectionTimeoutMs'];

const DATASOURCE_FORMS =
  '{type: "postgres", url}, {type: "custom", connector}, or a connector (an object with a connect function)';

function hasConnect(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as {connect?: unknown}).connect === 'function'
  );
}

/** Returns what is wrong with `datasources`: a name or a datasource. */
function datasourceProblems(datasources: unknown): string[] {
  if (datasources === undefined) return [];
  if (typeof datasources !== 'object' || datasources === null) {
    return [
      'datasources must be an object: {name: {type: "postgres", url: ...}}',
    ];
  }
  return Object.entries(datasources).flatMap(([name, ds]) => [
    ...(name === '' ? ['datasources has a name that is empty'] : []),
    ...oneDatasourceProblems(`datasources.${name}`, ds),
  ]);
}

/** Returns what is wrong with one datasource. `where` starts each message. */
function oneDatasourceProblems(where: string, ds: unknown): string[] {
  if (typeof ds !== 'object' || ds === null) {
    return [`${where} must be an object: ${DATASOURCE_FORMS}`];
  }
  if (!('type' in ds)) {
    return hasConnect(ds) ? [] : [`${where} must be ${DATASOURCE_FORMS}`];
  }
  if (ds.type === 'custom') {
    return hasConnect((ds as {connector?: unknown}).connector)
      ? []
      : [`${where}.connector must be an object with a connect function`];
  }
  if (ds.type !== 'postgres') {
    return [`${where}.type must be "postgres" or "custom"`];
  }
  return POSTGRES_TIME_OPTIONS.filter(option => {
    const value = (ds as Record<string, unknown>)[option];
    return (
      value !== undefined && !(Number.isInteger(value) && Number(value) >= 0)
    );
  }).map(
    option =>
      `${where}.${option} must be a whole number of milliseconds from 0 (0 turns the limit off)`,
  );
}

/**
 * Returns what is wrong with the values of a set of thresholds, for the
 * config and for one request. `where` starts each message.
 */
export function thresholdProblems(
  limits: Thresholds | undefined,
  where: string,
  keys: readonly (keyof Thresholds)[] = THRESHOLD_KEYS,
): string[] {
  const problems: string[] = [];
  for (const key of keys) {
    const value = limits?.[key];
    const highest = key === 'errorRate' ? 100 : Infinity;
    if (
      value !== undefined &&
      !(typeof value === 'number' && value >= 0 && value <= highest)
    ) {
      problems.push(
        `${where}${key} must be ${key === 'errorRate' ? 'from 0 to 100' : '0 or more'}`,
      );
    }
  }
  return problems;
}

/**
 * Returns what is wrong with the limits of a metric: a step, a flow or a
 * Web Vital. A name that is not a metric limit, such as `errorRate`, is a
 * problem, because a plain JavaScript file can set it and nothing reads it.
 * Limits that are not an object are a problem too: no key would show it.
 */
export function metricProblems(
  limits: MetricThresholds | undefined,
  where: string,
): string[] {
  if (limits !== undefined && !isPlainObject(limits)) {
    return [
      `${where.slice(0, -1)} must be an object of limits, for example {p95: 3000}`,
    ];
  }
  const known: readonly string[] = METRIC_KEYS;
  return [
    ...Object.keys(limits ?? {})
      .filter(key => !known.includes(key))
      .map(
        key =>
          `${where}${key} is not a limit of a metric: use ${METRIC_KEYS.join(', ')}`,
      ),
    ...thresholdProblems(limits, where, METRIC_KEYS),
  ];
}

/**
 * Returns what is wrong with the `step` and `vitals` limits of the config,
 * of a describe or of a scenario. `where` starts each message.
 */
export function browserLimitProblems(
  {step, vitals}: BrowserLimitOptions = {},
  where: string,
): string[] {
  return [
    ...metricProblems(step, `${where}step.`),
    ...(vitals !== undefined && !isPlainObject(vitals)
      ? [
          `${where}vitals must be an object of limits, for example {LCP: {p95: 2500}}`,
        ]
      : Object.entries(vitals ?? {}).flatMap(([vital, limits]) =>
          Object.hasOwn(VITAL_DEFAULTS, vital)
            ? metricProblems(limits, `${where}vitals.${vital}.`)
            : [
                `${where}vitals.${vital} is not a Web Vital: use one of ${Object.keys(VITAL_DEFAULTS).join(', ')}`,
              ],
        )),
  ];
}

/**
 * A time or a count: a whole number above 0, or a text such as `1m` for
 * Artillery that reads as more than 0. Artillery cannot read a number with a
 * fraction as a time.
 */
function isAmount(value: unknown): boolean {
  if (typeof value === 'number') return Number.isInteger(value) && value > 0;
  return isText(value) && (toSeconds(value as string) ?? 0) > 0;
}

function isText(value: unknown): boolean {
  return typeof value === 'string' && value !== '';
}

/**
 * Returns what is wrong with a list of phases, for the config and for one
 * scenario. `where` starts each message. Artillery reads a time or a rate
 * that is a text, so a text passes.
 */
export function phaseProblems(phases: unknown, where: string): string[] {
  if (!Array.isArray(phases) || phases.length === 0) {
    return [`${where} must be a list with at least one phase`];
  }
  return phases.flatMap((phase: unknown, i) =>
    onePhaseProblems(phase, `${where}[${i}]`),
  );
}

function onePhaseProblems(phase: unknown, at: string): string[] {
  if (typeof phase !== 'object' || phase === null) {
    return [`${at} must be an object`];
  }
  const fields = phase as Record<string, unknown>;
  if (fields.pause !== undefined) {
    return isAmount(fields.pause)
      ? []
      : [`${at}.pause must be a whole number above 0, or a text such as "1m"`];
  }
  return [
    ...(isAmount(fields.duration)
      ? []
      : [
          `${at}.duration must be a whole number above 0, or a text such as "1m"`,
        ]),
    ...countProblems(fields, at),
    ...rateProblems(fields, at),
  ];
}

/** A phase has a count of vusers, or a rate, or a ramp. */
function countProblems(fields: Record<string, unknown>, at: string): string[] {
  const {arrivalCount, arrivalRate, rampTo} = fields;
  if (arrivalCount !== undefined) {
    return isAmount(arrivalCount)
      ? []
      : [`${at}.arrivalCount must be a whole number above 0`];
  }
  if (arrivalRate === undefined && rampTo === undefined) {
    return [`${at} needs arrivalRate or arrivalCount`];
  }
  return rampTo !== undefined && arrivalRate === undefined
    ? [`${at} needs arrivalRate with rampTo`]
    : [];
}

function rateProblems(fields: Record<string, unknown>, at: string): string[] {
  return (['arrivalRate', 'rampTo'] as const)
    .filter(key => {
      const value = fields[key];
      const valid = (typeof value === 'number' && value >= 0) || isText(value);
      return value !== undefined && !valid;
    })
    .map(key => `${at}.${key} must be 0 or more`);
}

/**
 * The limits of a browser scenario. Each metric merges the library, the
 * config, and the describes with the scenario, by field. `steps` and `flow`
 * merge on top of `step`. INP is on only when a layer names it, and the flow
 * total only when `flow` is set.
 */
export function resolveBrowserLimits(
  config: BrowserLimitOptions,
  scenario: BrowserScenario,
): BrowserLimits {
  const step = resolveMetric(
    {...METRIC_DEFAULTS, p95: UI_TARGETS.criticalAction},
    config.step,
    scenario.step,
  );
  const vitals = (Object.keys(VITAL_DEFAULTS) as WebVital[])
    .filter(
      vital =>
        vital !== 'INP' ||
        config.vitals?.INP !== undefined ||
        scenario.vitals?.INP !== undefined,
    )
    .map(vital => [
      vital,
      resolveMetric(
        VITAL_DEFAULTS[vital],
        config.vitals?.[vital],
        scenario.vitals?.[vital],
      ),
    ]);
  const {steps = {}, flowLimits} = scenario.browser;
  return {
    step,
    steps: Object.fromEntries(
      Object.entries(steps).map(([name, limits]) => [
        name,
        resolveMetric(step, limits),
      ]),
    ),
    vitals: Object.fromEntries(vitals),
    ...(flowLimits && {flow: resolveMetric(step, flowLimits)}),
  };
}

function resolveMetric(
  base: ResolvedMetricThresholds,
  ...layers: Array<MetricThresholds | undefined>
): ResolvedMetricThresholds {
  const resolved = {...base};
  for (const layer of layers) {
    for (const key of METRIC_KEYS) {
      const value = layer?.[key];
      if (value !== undefined) resolved[key] = value;
    }
  }
  return resolved;
}

/** Merges the layers field by field. A later layer wins. */
export function resolveThresholds(...layers: Thresholds[]): ResolvedThresholds {
  const resolved: ResolvedThresholds = {...LIBRARY_DEFAULTS};
  for (const layer of layers) {
    for (const key of THRESHOLD_KEYS) {
      const value = layer[key];
      if (value !== undefined) resolved[key] = value;
    }
  }
  return resolved;
}
