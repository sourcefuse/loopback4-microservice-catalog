// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import fs from 'node:fs';
import path from 'node:path';
import {
  isParallel,
  isPlainObject,
  isRaw,
  isRequest,
  requestsIn,
} from '../../scenario/guards';
import {artilleryConfigProblems} from '../../project/config';
import {OUT_DIR} from '../../project/layout';
import {labelOf, slugOf} from '../../scenario/label';
import type {LoadRequest, ParallelGroup, Scenario, Vars} from '../../types';
import {
  BEFORE_SCENARIO,
  AFTER_SCENARIO,
  captureCheckName,
  processorSource,
  probeHooks,
  checkNames,
} from './processor';
import {resolveRequests} from './requests';
import {ScenarioError} from '../../errors';
import type {Phase} from '../../scenario/types';
import type {ArtilleryConfig, CaptureStep} from './types';

/**
 * Writes the Artillery script of one run, and the processor that holds the
 * worker hooks. Returns the path of the script. `runVars` is what `before`
 * set. It writes the processor first, because the CLI tries the worker
 * hooks in that file. `phases` is the load of the run: the script runs
 * exactly these.
 */
export function writeScenario(
  pkgDir: string,
  scenario: Scenario,
  defaults: ArtilleryConfig | undefined,
  phases: Phase[],
  runVars: Vars,
): string {
  const outDir = path.join(pkgDir, OUT_DIR);
  fs.mkdirSync(outDir, {recursive: true});
  const slug = slugOf(scenario);
  checkNames(scenario);

  const processorPath = path.join(outDir, `${slug}.processor.js`);
  const requests = requestsIn(scenario.requests);
  // The errors of this call come again from `transpile`, with the real vars.
  const {captures} = resolveRequests(
    scenario,
    requests,
    new Set(),
    groupsIn(scenario.requests),
  );
  const writesProcessor = needsProcessor(
    scenario,
    requests,
    new Set(Object.keys(runVars)),
    captures,
  );
  if (writesProcessor) {
    fs.writeFileSync(
      processorPath,
      processorSource(scenario, runVars, captures),
    );
  }
  const {eachVars} = writesProcessor
    ? probeHooks(scenario, processorPath)
    : {eachVars: {}};
  const known = new Set([...Object.keys(runVars), ...Object.keys(eachVars)]);
  const script = transpile(scenario, defaults, phases, processorPath, known);
  const scriptPath = path.join(outDir, `${slug}.json`);
  fs.writeFileSync(scriptPath, JSON.stringify(script, null, 2));
  return scriptPath;
}

/**
 * True when the script needs the generated processor: a var to set, a worker
 * hook, a captured value to check, or a function or a processor of the
 * consumer.
 */
function needsProcessor(
  scenario: Scenario,
  requests: LoadRequest[],
  known: ReadonlySet<string>,
  captures: CaptureStep[][],
): boolean {
  return (
    known.size > 0 ||
    captures.some(captured => captured.length > 0) ||
    scenario.beforeEach !== undefined ||
    scenario.afterEach !== undefined ||
    scenario.artillery?.functions !== undefined ||
    scenario.artillery?.processor !== undefined ||
    requests.some(
      req =>
        req.options.beforeRequest !== undefined ||
        req.options.afterResponse !== undefined,
    )
  );
}

/** The problems with the options of a scenario, as messages. Empty means none. */
function optionProblems(scenario: Scenario, requests: LoadRequest[]): string[] {
  const problems = artilleryConfigProblems(
    scenario.artillery?.config,
    'artillery.config',
  );
  if (new Set(requests).size < requests.length) {
    problems.push(
      'a request is in the flow twice: call load.get (or post, put, ...) once for each use',
    );
  }
  return problems;
}

/**
 * Makes the Artillery script. `defaults` is the `artillery.config` of
 * config.ts, and the `artillery.config` of the scenario is merged over it.
 * `phases` is the load, and no `config` can replace it. `processorPath` is where
 * `processorSource` will be written. `known` holds the names that
 * `vars(name)` may use.
 */
export function transpile(
  scenario: Scenario,
  defaults: ArtilleryConfig | undefined,
  phases: Phase[],
  processorPath: string,
  known: ReadonlySet<string>,
) {
  const requests = requestsIn(scenario.requests);
  const resolved = resolveRequests(
    scenario,
    requests,
    known,
    groupsIn(scenario.requests),
  );
  const errors = [...optionProblems(scenario, requests), ...resolved.errors];
  if (errors.length > 0) {
    throw new ScenarioError(`Scenario ${labelOf(scenario)}:`, errors);
  }
  const {urls, bodies, headers, queries, captures} = resolved;

  const setsVars = known.size > 0 || scenario.beforeEach !== undefined;
  const hasProcessor = needsProcessor(scenario, requests, known, captures);

  const stepOf = (req: LoadRequest) => {
    const i = requests.indexOf(req);
    return step(req, i, {
      url: urls[i],
      body: bodies[i],
      headers: headers[i],
      qs: queries[i],
      capture: captures[i],
    });
  };

  const replaceRequests = (value: unknown): unknown => {
    if (isRequest(value)) return stepOf(value);
    if (isParallel(value)) {
      /*
       * Artillery runs `{parallel: [...], limit}` (engine_http.ts), although
       * its types have no `parallel` step. The script is plain JSON, so no
       * Artillery type is needed here.
       */
      return {
        parallel: value.requests.map(stepOf),
        ...(value.limit !== undefined && {limit: value.limit}),
      };
    }
    if (isRaw(value)) return replaceRequests(value.step);
    if (Array.isArray(value)) return value.map(replaceRequests);
    if (isPlainObject(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, replaceRequests(v)]),
      );
    }
    return value;
  };

  const beforeScenario = [
    ...(setsVars ? [BEFORE_SCENARIO] : []),
    ...asList(scenario.artillery?.raw?.beforeScenario),
  ];
  const afterScenario = [
    ...(scenario.afterEach ? [AFTER_SCENARIO] : []),
    ...asList(scenario.artillery?.raw?.afterScenario),
  ];

  return {
    config: {
      ...deepMerge(
        deepMerge(
          {
            target: '{{ $env.LOAD_TESTS_BASE_URL }}',
            plugins: {'metrics-by-endpoint': {useOnlyRequestNames: true}},
            ...(hasProcessor && {processor: processorPath}),
          },
          defaults ?? {},
        ),
        scenario.artillery?.config ?? {},
      ),
      phases,
    },
    scenarios: [
      {
        ...scenario.artillery?.raw,
        name: labelOf(scenario),
        ...(beforeScenario.length > 0 && {beforeScenario}),
        ...(afterScenario.length > 0 && {afterScenario}),
        flow: scenario.requests.map(replaceRequests),
      },
    ],
  };
}

/** The parallel groups of the flow, also inside raw steps. */
function groupsIn(value: unknown): ParallelGroup[] {
  if (isParallel(value)) return [value];
  if (isRaw(value)) return groupsIn(value.step);
  if (Array.isArray(value)) return value.flatMap(groupsIn);
  if (isPlainObject(value)) return Object.values(value).flatMap(groupsIn);
  return [];
}

function step(
  req: LoadRequest,
  index: number,
  {
    url,
    body,
    headers,
    qs,
    capture,
  }: {
    url: string;
    body: unknown;
    headers?: Record<string, string>;
    qs?: Record<string, string>;
    capture: CaptureStep[];
  },
) {
  const {beforeRequest, afterResponse} = req.options;
  const raw = req.options.artillery?.raw;
  const captures = [...capture, ...asList(raw?.capture)];
  const before = [
    ...(beforeRequest ? [`beforeRequest_${index}`] : []),
    ...asList(raw?.beforeRequest),
  ];
  const after = [
    ...(capture.length > 0 ? [captureCheckName(index)] : []),
    ...(afterResponse ? [`afterResponse_${index}`] : []),
    ...asList(raw?.afterResponse),
  ];
  return {
    [req.method.toLowerCase()]: {
      url,
      name: req.id,
      ...(headers && {headers}),
      ...(qs && {qs}),
      ...(body !== undefined && {json: body}),
      ...raw,
      ...(captures.length > 0 && {capture: captures}),
      ...(before.length > 0 && {beforeRequest: before}),
      ...(after.length > 0 && {afterResponse: after}),
    },
  };
}

/** A value that Artillery takes as one item or as a list, as a list. */
function asList<T>(value: T | T[] | undefined): T[] {
  return value === undefined ? [] : ([value].flat() as T[]);
}

/** Plain objects merge, everything else (arrays too) is replaced. */
function deepMerge<T extends Record<string, unknown>>(
  base: T,
  extra: Record<string, unknown>,
): T {
  const out: Record<string, unknown> = {...base};
  for (const [k, v] of Object.entries(extra)) {
    const current = out[k];
    out[k] =
      isPlainObject(v) && isPlainObject(current) ? deepMerge(current, v) : v;
  }
  return out as T;
}
