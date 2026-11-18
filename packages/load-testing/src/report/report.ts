// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {errorMessage} from '../errors';
import {errorRate, exceedsMax, judge, judgeP95, judgeVusers} from './compare';
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
  EndpointResult,
  EndpointStats,
  MetricResult,
  MetricStats,
  RunResult,
  ScenarioResult,
  ScenarioRun,
} from './types';

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
};

/** Compares the run of one scenario with its limits, and makes its result. */
export function judgeScenario(
  {scenario, endpoints: limitsById, browser}: LoadedScenario,
  run: ScenarioRun,
  vuserLimits: ResolvedThresholds,
): ScenarioResult {
  const name = labelOf(scenario);
  const vuserFailures = judgeVusers(run.vusers, vuserLimits);
  const endpoints = [...limitsById].map(([id, limits]) =>
    endpointResult(id, limits, run),
  );
  const metrics = metricResults(browser, run, name);
  const passed =
    run.hookErrors === 0 &&
    vuserFailures.length === 0 &&
    run.problems.length === 0 &&
    [...endpoints, ...metrics].every(row => row.failures.length === 0);
  return {
    name,
    workload: run.workload,
    vusers: {
      ...run.vusers,
      failedLimit: vuserLimits.errorRate,
      failures: vuserFailures,
    },
    hookErrors: run.hookErrors,
    problems: run.problems,
    endpoints,
    metrics,
    passed,
  };
}

/**
 * Compares the browser metrics of a run with their limits: each step in the report or in `steps`, each Web Vital that is
 * on, and the flow total. The flow total has a row when the report has it
 * or when `flow` gates it.
 */
function metricResults(
  limits: BrowserLimits | undefined,
  run: ScenarioRun,
  label: string,
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

/** Compares one browser metric with its limits. A metric with no limits only shows its numbers. */
function metricResult(
  name: string,
  limits: ResolvedMetricThresholds | undefined,
  run: MetricRun,
): MetricResult {
  const {stats, unit} = run;
  const failures = limits === undefined ? [] : failuresOf(limits, run);
  return {
    name,
    samples: stats?.count ?? 0,
    p95: stats?.p95,
    unit,
    p95Limit: limits?.p95,
    failures,
    ...(stats?.wallClock && {wallClock: true}),
  };
}

/** Why a gated browser metric fails. Empty means it passes. */
function failuresOf(
  limits: ResolvedMetricThresholds,
  {stats, unit, completed}: MetricRun,
): string[] {
  if (stats === undefined) return ['no samples'];
  const lost =
    stats.count < completed
      ? [`lost samples: ${stats.count} for ${completed} completed vusers`]
      : [];
  return [...lost, ...judgeP95(stats.p95, limits, unit)];
}

/** Compares the requests of one endpoint with its limits. */
function endpointResult(
  id: string,
  limits: ResolvedThresholds,
  run: ScenarioRun,
): EndpointResult {
  const stats = run.endpoints.get(id) ?? NO_REQUESTS;
  const failures = judge(stats, limits);
  return {
    id,
    requests: stats.count,
    perSecond: run.seconds > 0 ? stats.count / run.seconds : undefined,
    p95: stats.p95,
    p95Limit: limits.p95,
    errorRate: errorRate(stats),
    errorRateLimit: limits.errorRate,
    failures,
  };
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
