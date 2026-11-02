// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {errorMessage} from '../errors';
import {
  baselineFrom,
  errorRate,
  exceedsMax,
  judge,
  judgeP95,
  judgeVusers,
  p95Limit,
  workloadChanged,
} from './compare';
import {flowName, pageName, STEP} from './names';
import {labelOf} from '../scenario/label';
import type {
  BrowserLimits,
  LoadedScenario,
  ResolvedMetricThresholds,
  ResolvedThresholds,
} from '../project/types';
import {WEB_VITALS_TARGETS} from '../project/config';
import type {WebVital} from '../types';
import type {
  Baseline,
  EndpointResult,
  EndpointStats,
  MetricResult,
  MetricStats,
  RunResult,
  ScenarioResult,
  ScenarioRun,
} from './types';

type JudgedScenario = {
  result: ScenarioResult;
  /**
   * p95 by endpoint id or browser metric name, for the baseline.
   * Milliseconds, except CLS, which has no unit.
   */
  p95: Record<string, number>;
};

const NO_REQUESTS: EndpointStats = {count: 0, failed: 0};

/** The Web Vitals, in the order of the console table. */
const WEB_VITALS = Object.keys(WEB_VITALS_TARGETS) as WebVital[];

/** CLS is a score, so it has no unit. */
const unitOf = (vital: WebVital): MetricResult['unit'] =>
  vital === 'CLS' ? '' : 'ms';

/** What the judge of one browser metric needs from the run. */
type MetricRun = {
  stats?: MetricStats;
  unit: MetricResult['unit'];
  /** Count of vusers that completed. A gated metric needs as many samples. */
  completed: number;
  /** Mean p95 of the baseline history. */
  base?: number;
  /** True when the baseline has another workload. */
  changed: boolean;
};

/**
 * Compares the run of one scenario with its limits and with the baseline,
 * and makes the result of the scenario.
 */
export function judgeScenario(
  {scenario, endpoints: limitsById, browser}: LoadedScenario,
  run: ScenarioRun,
  {
    baseline,
    vuserLimits,
  }: {baseline?: Baseline; vuserLimits: ResolvedThresholds},
): JudgedScenario {
  const name = labelOf(scenario);
  const vuserFailures = judgeVusers(run.vusers, vuserLimits);
  // The p95 of another workload tells nothing about this one.
  const changed = workloadChanged(baseline, name, run.workload);
  const history = changed ? undefined : baseline?.history[name];
  const endpoints = [...limitsById].map(([id, limits]) =>
    endpointResult(id, limits, run, {
      base: baselineFrom(history?.[id]),
      changed,
    }),
  );
  const metrics = metricResults(browser, run, {label: name, history, changed});
  const p95 = Object.fromEntries(
    [
      ...endpoints.map(({id, p95: value}) => [id, value] as const),
      ...metrics.map(({name: key, p95: value}) => [key, value] as const),
    ].filter((entry): entry is [string, number] => entry[1] !== undefined),
  );
  const passed =
    run.hookErrors === 0 &&
    vuserFailures.length === 0 &&
    run.problems.length === 0 &&
    [...endpoints, ...metrics].every(row => row.failures.length === 0);
  const result: ScenarioResult = {
    name,
    workload: run.workload,
    vusers: {
      ...run.vusers,
      failedLimit: vuserLimits.errorRate,
      failures: vuserFailures,
    },
    hookErrors: run.hookErrors,
    problems: run.problems,
    baselineNote: changed
      ? `recorded with ${baseline?.workloads[name]}, so p95 is not compared`
      : undefined,
    endpoints,
    metrics,
    passed,
  };
  return {result, p95};
}

/**
 * Compares the browser metrics of a run with their limits and their
 * baseline: each step in the report or in `steps`, each Web Vital that is
 * on, and the flow total. The flow total has a row when the report has it
 * or when `flow` gates it.
 */
function metricResults(
  limits: BrowserLimits | undefined,
  run: ScenarioRun,
  {
    label,
    history,
    changed,
  }: {label: string; history?: Record<string, number[]>; changed: boolean},
): MetricResult[] {
  if (limits === undefined) return [];
  const metrics = run.metrics ?? new Map<string, MetricStats>();
  const judged = (
    name: string,
    gate?: ResolvedMetricThresholds,
    unit: MetricResult['unit'] = 'ms',
  ) =>
    metricResult(name, gate, {
      stats: metrics.get(name),
      unit,
      completed: run.vusers.completed,
      base: gate === undefined ? undefined : baselineFrom(history?.[name]),
      changed,
    });
  const found = [...metrics.keys()].filter(name => name.startsWith(STEP));
  const named = Object.keys(limits.steps).map(step => STEP + step);
  const steps = [...new Set([...found, ...named])].map(name =>
    judged(name, stepLimits(limits, name)),
  );
  const vitals = WEB_VITALS.flatMap(vital => {
    const gate = limits.vitals[vital];
    return gate ? [judged(pageName(vital, label), gate, unitOf(vital))] : [];
  });
  const flow = flowName(label);
  const flows =
    limits.flow !== undefined || metrics.has(flow)
      ? [judged(flow, limits.flow)]
      : [];
  return [...steps, ...vitals, ...flows];
}

/** The limits of the step with this report name. */
function stepLimits(
  {step, steps}: BrowserLimits,
  name: string,
): ResolvedMetricThresholds {
  const stepName = name.slice(STEP.length);
  // A step named `constructor` must not get a key of Object.prototype.
  return Object.hasOwn(steps, stepName) ? steps[stepName] : step;
}

/**
 * Compares one browser metric with its limits and its baseline. A metric
 * with no limits only shows its numbers.
 */
function metricResult(
  name: string,
  limits: ResolvedMetricThresholds | undefined,
  run: MetricRun,
): MetricResult {
  const {stats, unit, base, changed} = run;
  const failures = limits === undefined ? [] : failuresOf(limits, run);
  const gatedPass = limits !== undefined && failures.length === 0;
  return {
    name,
    samples: stats?.count ?? 0,
    p95: stats?.p95,
    unit,
    p95Limit: limits && p95Limit(limits, base),
    baselineP95: base,
    failures,
    note: gatedPass ? noteOf(base, changed) : undefined,
    ...(stats?.wallClock && {wallClock: true}),
  };
}

/** Why a gated browser metric fails. Empty means it passes. */
function failuresOf(
  limits: ResolvedMetricThresholds,
  {stats, unit, completed, base}: MetricRun,
): string[] {
  if (stats === undefined) return ['no samples'];
  const lost =
    stats.count < completed
      ? [`lost samples: ${stats.count} for ${completed} completed vusers`]
      : [];
  return [...lost, ...judgeP95(stats.p95, limits, base, unit)];
}

/** Compares the requests of one endpoint with its limits and its baseline. */
function endpointResult(
  id: string,
  limits: ResolvedThresholds,
  run: ScenarioRun,
  {base, changed}: {base?: number; changed: boolean},
): EndpointResult {
  const stats = run.endpoints.get(id) ?? NO_REQUESTS;
  const failures = judge(stats, limits, base);
  return {
    id,
    requests: stats.count,
    perSecond: run.seconds > 0 ? stats.count / run.seconds : undefined,
    p95: stats.p95,
    p95Limit: p95Limit(limits, base),
    baselineP95: base,
    errorRate: errorRate(stats),
    errorRateLimit: limits.errorRate,
    failures,
    note: failures.length > 0 ? undefined : noteOf(base, changed),
  };
}

function noteOf(
  base: number | undefined,
  changed: boolean,
): string | undefined {
  if (changed) return 'workload changed';
  return base === undefined ? 'no baseline' : undefined;
}

/** The result of a scenario that stopped with an error. */
export function failedScenario(name: string, err: unknown): ScenarioResult {
  return {
    name,
    workload: '',
    vusers: {started: 0, completed: 0, failed: 0, failedLimit: 0, failures: []},
    hookErrors: 0,
    problems: [],
    error: errorMessage(err),
    endpoints: [],
    metrics: [],
    passed: false,
  };
}

/** The result of a whole run, from the results of its scenarios. */
export function judgeRun(
  scenarios: ScenarioResult[],
  rest: Omit<RunResult, 'scenarios' | 'passed'>,
): RunResult {
  return {
    scenarios,
    ...rest,
    passed:
      scenarios.every(scenario => scenario.passed) &&
      !exceedsMax(rest.heavyApis),
  };
}
