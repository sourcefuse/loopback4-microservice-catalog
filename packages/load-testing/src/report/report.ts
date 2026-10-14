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
  judgeVusers,
  p95Limit,
  workloadChanged,
} from './compare';
import {labelOf} from '../scenario/label';
import type {LoadedScenario, ResolvedThresholds} from '../project/types';
import type {
  Baseline,
  EndpointResult,
  EndpointStats,
  RunResult,
  ScenarioResult,
  ScenarioRun,
} from './types';

type JudgedScenario = {
  result: ScenarioResult;
  /** p95 in milliseconds by endpoint id, for the baseline. */
  p95: Record<string, number>;
};

const NO_REQUESTS: EndpointStats = {count: 0, failed: 0};

/**
 * Compares the run of one scenario with its limits and with the baseline,
 * and makes the result of the scenario.
 */
export function judgeScenario(
  {scenario, endpoints: limitsById}: LoadedScenario,
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
  const p95 = Object.fromEntries(
    endpoints.flatMap(({id, p95: value}): Array<[string, number]> =>
      value === undefined ? [] : [[id, value]],
    ),
  );
  const passed =
    run.hookErrors === 0 &&
    vuserFailures.length === 0 &&
    run.problems.length === 0 &&
    endpoints.every(endpoint => endpoint.failures.length === 0);
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
    passed,
  };
  return {result, p95};
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
