// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import fs from 'node:fs';
import path from 'node:path';
import {OUT_DIR} from '../project/layout';
import {RunError} from '../errors';
import type {ResolvedThresholds} from '../project/types';
import type {
  Baseline,
  EndpointStats,
  BaselineSample,
  HeavyApis,
  VuserCounts,
} from './types';

/**
 * How many runs the baseline remembers. It is the default history size
 * (`opsToTrack`) of @sourceloop/benchmarking.
 */
export const HISTORY_SIZE = 10;

export const BASELINE_FILE = path.join(OUT_DIR, 'baseline.json');

/** One rule for the verdict and the FAIL line: more heavy APIs than the max. */
export function exceedsMax({endpoints, max}: HeavyApis): boolean {
  return endpoints.length > max;
}

/** Returns the reasons the endpoint fails. Empty means it passes. */
export function judge(
  stats: EndpointStats,
  limits: ResolvedThresholds,
  baselineP95?: number,
): string[] {
  if (stats.count === 0) return ['no requests'];
  const failures: string[] = [];
  const rate = errorRate(stats);
  if (rate > limits.errorRate) {
    failures.push(`error rate ${round(rate)}% > ${limits.errorRate}%`);
  }
  if (stats.p95 === undefined) return failures;
  if (stats.p95 > limits.p95) {
    failures.push(`p95 ${stats.p95} ms > limit ${limits.p95} ms`);
  }
  if (
    baselineP95 !== undefined &&
    stats.p95 > regressionLimit(limits, baselineP95)
  ) {
    const delta = stats.p95 - baselineP95;
    const over =
      baselineP95 > 0 ? `+${round((delta / baselineP95) * 100)}% ` : '';
    failures.push(
      `p95 ${over}(+${round(delta)} ms) over baseline ${baselineP95} ms`,
    );
  }
  return failures;
}

/**
 * The p95 above which an endpoint has regressed. It must be more than
 * `minDelta` and more than `p95Regression` above the baseline.
 */
function regressionLimit(
  limits: ResolvedThresholds,
  baselineP95: number,
): number {
  const allowance = Math.max(
    limits.minDelta,
    (baselineP95 * limits.p95Regression) / 100,
  );
  return baselineP95 + allowance;
}

/**
 * The highest p95 that `judge` accepts: the p95 limit, or the limit from the
 * baseline when that is lower.
 */
export function p95Limit(
  limits: ResolvedThresholds,
  baselineP95?: number,
): number {
  return baselineP95 === undefined
    ? limits.p95
    : Math.min(limits.p95, regressionLimit(limits, baselineP95));
}

/** Returns the reasons the vusers of a scenario fail. Empty means it passes. */
export function judgeVusers(
  vusers: VuserCounts,
  limits: Pick<ResolvedThresholds, 'errorRate'>,
): string[] {
  const rate =
    vusers.started === 0 ? 0 : (vusers.failed / vusers.started) * 100;
  return rate > limits.errorRate
    ? [`vuser failure rate ${round(rate)}% > ${limits.errorRate}%`]
    : [];
}

/** Percent of the requests of an endpoint that failed. */
export function errorRate(stats: EndpointStats): number {
  return stats.count === 0 ? 0 : (stats.failed / stats.count) * 100;
}

/** The baseline p95 of an endpoint: the mean of its history. */
export function baselineFrom(
  history: number[] | undefined,
): number | undefined {
  if (!history || history.length === 0) return undefined;
  return history.reduce((sum, value) => sum + value, 0) / history.length;
}

/** Adds a run to the history and drops the oldest runs over the limit. */
export function addRun(history: number[] | undefined, p95: number): number[] {
  return [...(history ?? []), p95].slice(-HISTORY_SIZE);
}

/** True when the baseline of the scenario has another workload. */
export function workloadChanged(
  baseline: Baseline | undefined,
  scenario: string,
  workload: string,
): boolean {
  const recorded = baseline?.workloads[scenario];
  return recorded !== undefined && recorded !== workload;
}

/**
 * The history and the workloads of a baseline after a run. A scenario with
 * a new workload starts a new history, because its old p95 values do not
 * tell what the new load should give.
 */
export function addRuns(
  baseline: Baseline | undefined,
  measured: Record<string, BaselineSample>,
): Pick<Baseline, 'history' | 'workloads'> {
  const history: Baseline['history'] = {...baseline?.history};
  const workloads: Baseline['workloads'] = {...baseline?.workloads};
  for (const [name, {workload, p95}] of Object.entries(measured)) {
    const runs = workloadChanged(baseline, name, workload) ? {} : history[name];
    history[name] = {...runs};
    for (const [id, value] of Object.entries(p95)) {
      history[name][id] = addRun(history[name][id], value);
    }
    workloads[name] = workload;
  }
  return {history, workloads};
}

/** Reads the baseline file. A file that is not a baseline stops the run. */
export function readBaseline(pkgDir: string): Baseline | undefined {
  const file = path.join(pkgDir, BASELINE_FILE);
  if (!fs.existsSync(file)) return undefined;
  const fail = (why: string) =>
    new RunError(`${BASELINE_FILE} ${why}. Delete it, and record a new one.`);
  let baseline: Partial<Baseline> | null;
  try {
    baseline = JSON.parse(fs.readFileSync(file, 'utf8')) as typeof baseline;
  } catch {
    throw fail('is not valid JSON');
  }
  if (!isObject(baseline?.history) || !isObject(baseline?.workloads)) {
    throw fail('has no history or no workloads');
  }
  const {history, workloads} = baseline as Baseline;
  const badHistory = Object.values(history).some(
    endpoints =>
      !isObject(endpoints) ||
      Object.values(endpoints).some(
        runs =>
          !Array.isArray(runs) ||
          runs.some(p95 => typeof p95 !== 'number' || !Number.isFinite(p95)),
      ),
  );
  if (badHistory) throw fail('has a history that is not a list of numbers');
  if (Object.values(workloads).some(text => typeof text !== 'string')) {
    throw fail('has a workload that is not a text');
  }
  return baseline as Baseline;
}

/** True for a JSON object. A list is not one: its keys are not names. */
function isObject(value: unknown): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function writeBaseline(pkgDir: string, baseline: Baseline): void {
  const file = path.join(pkgDir, BASELINE_FILE);
  fs.mkdirSync(path.dirname(file), {recursive: true});
  /*
   * A kill during the write must not leave a half file: rename is atomic.
   * The pid in the name keeps two runs in one checkout from sharing a file.
   */
  const tmp = `${file}.${process.pid}.tmp`;
  try {
    fs.writeFileSync(tmp, JSON.stringify(baseline, null, 2));
    fs.renameSync(tmp, file);
  } catch (err) {
    fs.rmSync(tmp, {force: true});
    throw err;
  }
}

export function round(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Adds the run to the baseline file. A failed run stays out, so a regression
 * does not become the new normal, unless `force` is set. A failure of `after`
 * or of a cleanup counts too: rows that it leaves can skew the next run.
 * `force` saves the run anyway. Returns true when it saved the run.
 */
export function saveRun(
  pkgDir: string,
  run: {
    baseUrl: string;
    baseline?: Baseline;
    measured: Record<string, BaselineSample>;
    failed: boolean;
    force: boolean;
  },
): boolean {
  if (run.failed && !run.force) return false;
  writeBaseline(pkgDir, {
    baseUrl: run.baseUrl,
    recordedAt: new Date().toISOString(),
    ...addRuns(run.baseline, run.measured),
  });
  return true;
}
