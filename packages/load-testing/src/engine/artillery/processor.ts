// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {ScenarioError, errorMessage} from '../../errors';
import {requestsIn} from '../../scenario/guards';
import {labelOf} from '../../scenario/label';
import type {BeforeEachContext, HookRequest, Scenario, Vars} from '../../types';
import {
  TEMPLATE_AT_SOURCE,
  TEMPLATE_CAPTURE_MESSAGE,
  TEMPLATE_CAPTURE_START,
  TEMPLATE_VARS_MESSAGE,
} from './templates';
import type {CaptureStep} from './types';

/**
 * Starts the message of an error that a hook threw in a worker. The generated
 * processor writes it, and the report counts these errors apart from the
 * errors of the application.
 */
export const HOOK_ERROR_PREFIX = 'load-testing hook ';

/** Name of the generated function that runs `beforeEach` and sets the vars. */
export const BEFORE_SCENARIO = 'loadTestsBeforeScenario';

export const AFTER_SCENARIO = 'loadTestsAfterScenario';

/**
 * Name of the export that gives the CLI the hooks and the vars of the
 * processor, to try them before the load.
 */
const HOOKS_EXPORT = 'loadTestsHooks';

/** The names of the generated functions. A function of a consumer cannot use them. */
const RESERVED_NAME = /^(loadTests\w*|beforeRequest_\d+|afterResponse_\d+)$/;

/**
 * Name of the function that checks the captured values of the request at
 * `index`. It starts with `loadTests`, so `RESERVED_NAME` blocks it for the
 * functions of a consumer.
 */
export function captureCheckName(index: number): string {
  return `loadTestsCaptures_${index}`;
}

type Hook = (...args: never[]) => unknown;

/**
 * Source of the processor that Artillery loads in each worker. It holds the
 * hooks of the scenario, the functions of the consumer, and the vars that
 * `before` set. `loadTestsRunVars` makes a new copy of the vars on each call, so that
 * a user cannot change the vars of another user. Each name at module level
 * starts with `loadTests`, so that a hook that uses a variable of its own
 * module gets a ReferenceError in the probe and not one of these names.
 * `captures` lists, for each request, what Artillery captures from its
 * response. A request that captures gets a function that fails the user when
 * a captured value holds a text that the engine reads as a template.
 * `captureCheckName` gives its name.
 */
export function processorSource(
  scenario: Scenario,
  runVars: Vars,
  captures: CaptureStep[][] = [],
): string {
  const tried: string[] = [];
  const parts = [
    `const loadTestsRunVars = () => (${JSON.stringify(runVars)});`,
    `let loadTestsVu = 0;`,
    `const loadTestsFail = (name, err) => new Error(${JSON.stringify(HOOK_ERROR_PREFIX)} + name + ': ' + (err instanceof Error ? err.message : err));`,
  ];
  if (scenario.artillery?.processor) {
    parts.push(
      `Object.assign(exports, require(${JSON.stringify(scenario.artillery.processor)}));`,
    );
  }
  const {beforeEach, afterEach} = scenario;
  const checksValues =
    beforeEach !== undefined || captures.some(captured => captured.length > 0);
  if (checksValues) parts.push(TEMPLATE_AT_SOURCE);
  if (beforeEach) {
    parts.push(`const loadTestsBeforeEach = ${expression(beforeEach)};`);
    tried.push('beforeEach: loadTestsBeforeEach');
  }
  if (afterEach) {
    parts.push(`const loadTestsAfterEach = ${expression(afterEach)};`);
    tried.push('afterEach: loadTestsAfterEach');
  }
  parts.push(`
exports.${BEFORE_SCENARIO} = function (context, ee, done) {
  try {
    Object.assign(context.vars, loadTestsRunVars());
    ${
      beforeEach
        ? `const loadTestsEach = loadTestsBeforeEach({vars: {...context.vars}, vu: loadTestsVu++});
    const loadTestsBad = loadTestsTemplateAt(JSON.parse(JSON.stringify(loadTestsEach)), 'vars');
    if (loadTestsBad !== undefined) throw new Error(loadTestsBad + ${JSON.stringify(TEMPLATE_VARS_MESSAGE)});
    Object.assign(context.vars, loadTestsEach);`
        : ''
    }
    done();
  } catch (err) {
    done(loadTestsFail('beforeEach', err));
  }
};`);
  if (afterEach) {
    parts.push(`
exports.${AFTER_SCENARIO} = function (context, ee, done) {
  try {
    loadTestsAfterEach({vars: {...context.vars}});
    done();
  } catch (err) {
    done(loadTestsFail('afterEach', err));
  }
};`);
  }
  for (const [name, fn] of Object.entries(
    scenario.artillery?.functions ?? {},
  )) {
    parts.push(`exports[${JSON.stringify(name)}] = ${expression(fn)};`);
  }
  requestsIn(scenario.requests).forEach((req, index) => {
    const {beforeRequest, afterResponse} = req.options;
    const captured = captures[index] ?? [];
    if (captured.length > 0) {
      parts.push(`
const loadTestsCaptured_${index} = ${JSON.stringify(captured)};
exports.${captureCheckName(index)} = function (req, res, context, ee, next) {
  for (const {json, as} of loadTestsCaptured_${index}) {
    const value = context.vars[as];
    const text = typeof value === 'string' ? value : JSON.stringify(value);
    if (text !== undefined && loadTestsReadsAsTemplate(text)) {
      return next(loadTestsFail('capture', new Error(${JSON.stringify(TEMPLATE_CAPTURE_START)} + ${JSON.stringify(req.id)} + ' at ' + json + ${JSON.stringify(TEMPLATE_CAPTURE_MESSAGE)})));
    }
  }
  next();
};`);
    }
    if (beforeRequest) {
      parts.push(`
const loadTestsBeforeRequest_${index} = ${expression(beforeRequest)};
exports.beforeRequest_${index} = function (req, context, ee, next) {
  try {
    loadTestsBeforeRequest_${index}(req, {vars: context.vars});
    next();
  } catch (err) {
    next(loadTestsFail('beforeRequest', err));
  }
};`);
      tried.push(`beforeRequest_${index}: loadTestsBeforeRequest_${index}`);
    }
    if (afterResponse) {
      parts.push(`
const loadTestsAfterResponse_${index} = ${expression(afterResponse)};
exports.afterResponse_${index} = function (req, res, context, ee, next) {
  try {
    loadTestsAfterResponse_${index}(req, res, {vars: context.vars});
    next();
  } catch (err) {
    next(loadTestsFail('afterResponse', err));
  }
};`);
      tried.push(`afterResponse_${index}: loadTestsAfterResponse_${index}`);
    }
  });
  parts.push(
    `exports.${HOOKS_EXPORT} = {runVars: loadTestsRunVars, hooks: {${tried.join(', ')}}};`,
  );
  return parts.join('\n') + '\n';
}

/**
 * Source of a hook as a JavaScript expression. A method written as
 * `beforeEach(ctx) {}` is not an expression by itself, so it goes in an
 * object literal. Its source starts with its name, with `async` before it
 * when the method is async. Any other function starts with `function`, with
 * `async`, or with its parameters.
 */
function expression(fn: Hook): string {
  const source = fn.toString();
  const isMethod =
    fn.name !== '' &&
    (source.startsWith(`${fn.name}(`) ||
      source.startsWith(`async ${fn.name}(`));
  return isMethod ? `({${source}})[${JSON.stringify(fn.name)}]` : source;
}

/** What the processor gives the CLI to try the hooks. */
type TrialHooks = {
  /** A new copy of the vars of the run. */
  runVars: () => Vars;
  hooks: Record<string, ((...args: unknown[]) => unknown) | undefined>;
};

/**
 * Tries the worker hooks of a scenario once, before the load, so that a
 * fault stops the run here and not once in each worker. It loads the
 * processor file that `writeScenario` wrote, the file that the workers load,
 * so a hook sees the same names here as in a worker: its arguments and the
 * globals. A hook that uses an import or a variable of its module gets a
 * ReferenceError. Returns the vars that `beforeEach` gives.
 *
 * A worker hook must be synchronous: the worker does not wait for a promise.
 * So a hook that returns a promise stops the run here.
 *
 * A hook that never returns blocks the CLI here, and Ctrl-C cannot stop it.
 */
export function probeHooks(
  scenario: Scenario,
  processorPath: string,
): {eachVars: Vars} {
  // A scenario with the same name can have an older processor in the cache.
  delete require.cache[require.resolve(processorPath)];
  const {runVars, hooks} = (
    require(processorPath) as Record<string, TrialHooks>
  )[HOOKS_EXPORT];

  let eachVars: unknown = {};
  const beforeEach = hooks.beforeEach;
  if (beforeEach) {
    const each: BeforeEachContext = {vars: runVars(), vu: 0};
    eachVars = runHook('beforeEach', () => beforeEach(each));
    rejectAsync('beforeEach', eachVars);
  }
  if (typeof eachVars !== 'object' || eachVars === null) {
    throw new ScenarioError(
      `Scenario ${labelOf(scenario)}: beforeEach must return vars`,
    );
  }
  const afterEach = hooks.afterEach;
  if (afterEach) {
    tryHook('afterEach', () => afterEach({vars: runVars()}));
  }
  requestsIn(scenario.requests).forEach((req, index) => {
    const request: HookRequest = {url: '', headers: {}};
    const beforeRequest = hooks[`beforeRequest_${index}`];
    if (beforeRequest) {
      tryHook(`${req.id} beforeRequest`, () =>
        beforeRequest(request, {vars: runVars()}),
      );
    }
    const afterResponse = hooks[`afterResponse_${index}`];
    if (afterResponse) {
      tryHook(`${req.id} afterResponse`, () =>
        afterResponse(request, {statusCode: 200}, {vars: runVars()}),
      );
    }
  });
  return {eachVars: eachVars as Vars};
}

/** Calls a hook, and returns its result. Any error stops the run. */
function runHook(label: string, call: () => unknown): unknown {
  try {
    return call();
  } catch (err) {
    throw trialError(label, err);
  }
}

/**
 * Calls a hook with made-up arguments. Only a ReferenceError stops the run:
 * it proves that the hook uses a name from outside, such as an import. The
 * made-up arguments can cause other errors.
 */
function tryHook(label: string, call: () => unknown): void {
  try {
    rejectAsync(label, call());
  } catch (err) {
    if (err instanceof ScenarioError) throw err;
    if (err instanceof ReferenceError) throw trialError(label, err);
  }
}

/**
 * Stops the run when a hook gave a promise. The worker does not wait for it,
 * and a rejection would be unhandled. The no-op catch keeps that rejection
 * from staying unhandled in the CLI.
 */
function rejectAsync(label: string, result: unknown): void {
  if (typeof (result as {then?: unknown} | null)?.then !== 'function') return;
  Promise.resolve(result).catch(() => undefined);
  throw new ScenarioError(
    `${label} returned a promise: worker hooks must be synchronous`,
  );
}

function trialError(label: string, err: unknown): ScenarioError {
  const message = errorMessage(err);
  return new ScenarioError(
    err instanceof ReferenceError
      ? `${label} can use only its arguments and the globals of a worker, such as URL and Buffer: ${message}`
      : `${label} failed when tried: ${message}`,
  );
}

/**
 * Stops the run when two functions of a scenario have one name, or one has
 * the name of a generated function. The names of a `processor` come from
 * loading it here.
 */
export function checkNames(scenario: Scenario): void {
  const names = [
    ...Object.keys(scenario.artillery?.functions ?? {}),
    ...(scenario.artillery?.processor
      ? Object.keys(require(scenario.artillery.processor))
      : []),
  ];
  const bad = names.filter(
    (name, i) => RESERVED_NAME.test(name) || names.indexOf(name) !== i,
  );
  if (bad.length > 0) {
    throw new ScenarioError(
      `Scenario ${labelOf(scenario)}: the function names ${[...new Set(bad)].join(', ')} are used twice or are reserved`,
    );
  }
}
