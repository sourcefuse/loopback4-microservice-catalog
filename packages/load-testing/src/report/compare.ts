// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import fs from 'node:fs';
import path from 'node:path';
import {OUT_DIR} from '../project/layout';
import {RunError} from '../errors';
import type {
  ResolvedMetricThresholds,
  ResolvedThresholds,
} from '../project/types';
import type {
  Baseline,
  EndpointStats,
  BaselineSample,
  HeavyApis,
  MetricResult,
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
  return [...failures, ...judgeP95(stats.p95, limits, baselineP95)];
}

/**
 * Returns the reasons a p95 fails its limit or its baseline. Empty means it
 * passes. The messages give `unit` after each value.
 */
export function judgeP95(
  p95: number,
  limits: ResolvedMetricThresholds,
  baselineP95: number | undefined,
  unit: MetricResult['unit'] = 'ms',
): string[] {
  const show = (value: number) =>
    unit === '' ? `${value}` : `${value} ${unit}`;
  const failures: string[] = [];
  if (p95 > limits.p95) {
    failures.push(`p95 ${show(p95)} > limit ${show(limits.p95)}`);
  }
  if (baselineP95 !== undefined && p95 > regressionLimit(limits, baselineP95)) {
    const delta = p95 - baselineP95;
    const over =
      baselineP95 > 0 ? `+${round((delta / baselineP95) * 100)}% ` : '';
    failures.push(
      `p95 ${over}(+${show(roundFor(unit, delta))}) over baseline ${show(roundFor(unit, baselineP95))}`,
    );
  }
  return failures;
}

/** Six decimals are far finer than the report, which shows at most 2. */
const FLOAT_SCALE = 1e6;

/**
 * The p95 above which a metric has regressed. It must be more than
 * `minDelta` and more than `p95Regression` above the baseline.
 */
function regressionLimit(
  limits: ResolvedMetricThresholds,
  baselineP95: number,
): number {
  const allowance = Math.max(
    limits.minDelta,
    (baselineP95 * limits.p95Regression) / 100,
  );
  // Rounding keeps a p95 that is exactly the allowance above the baseline
  // from failing by a float error, for example 0.7 + 0.1 is 0.7999999999999999.
  return Math.round((baselineP95 + allowance) * FLOAT_SCALE) / FLOAT_SCALE;
}

/**
 * The highest p95 that `judge` accepts: the p95 limit, or the limit from the
 * baseline when that is lower.
 */
export function p95Limit(
  limits: ResolvedMetricThresholds,
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
 * True when a run used another host than the baseline. A host that one of
 * them does not have is not a change.
 */
export function hostChanged(
  recorded: string | undefined,
  current: string | undefined,
): boolean {
  return (
    recorded !== undefined && current !== undefined && recorded !== current
  );
}

/**
 * The history and the workloads of a baseline after a run. A scenario with
 * a new workload starts a new history, because its old p95 values do not
 * tell what the new load should give. The same holds for a scenario
 * when its host is not the host of the baseline: an HTTP scenario
 * follows `baseUrl`, and a browser scenario follows `uiUrl`. The p95 of
 * another host must not blend into the mean of this one.
 */
export function addRuns(
  baseline: Baseline | undefined,
  measured: Record<string, BaselineSample>,
  baseUrl: string | undefined,
  uiUrl?: string,
): Pick<Baseline, 'history' | 'workloads'> {
  const history: Baseline['history'] = {...baseline?.history};
  const workloads: Baseline['workloads'] = {...baseline?.workloads};
  const apiMoved = hostChanged(baseline?.baseUrl, baseUrl);
  const uiMoved = hostChanged(baseline?.uiUrl, uiUrl);
  for (const [name, {workload, browser, p95}] of Object.entries(measured)) {
    const moved = browser ? uiMoved : apiMoved;
    const fresh = moved || workloadChanged(baseline, name, workload);
    const runs = fresh ? {} : history[name];
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
  const hosts = [baseline?.baseUrl, baseline?.uiUrl].filter(
    url => url !== undefined,
  );
  if (hosts.some(url => typeof url !== 'string')) {
    throw fail('has a baseUrl or uiUrl that is not a text');
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

export function round(value: number, decimals = 1): number {
  const scale = 10 ** decimals;
  return Math.round(value * scale) / scale;
}

/**
 * Rounds a metric value for display. CLS has no unit and is below 1, so it
 * needs 2 decimals: with 1, a limit of 0.25 would show as 0.3.
 */
export function roundFor(unit: MetricResult['unit'], value: number): number {
  return round(value, unit === '' ? 2 : 1);
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
    baseUrl?: string;
    uiUrl?: string;
    baseline?: Baseline;
    measured: Record<string, BaselineSample>;
    failed: boolean;
    force: boolean;
  },
): boolean {
  if (run.failed && !run.force) return false;
  const samples = Object.values(run.measured);
  // A target that no measured scenario used must not replace the stored host.
  const baseUrl = samples.some(({browser}) => !browser)
    ? run.baseUrl
    : undefined;
  const uiUrl = samples.some(({browser}) => browser) ? run.uiUrl : undefined;
  writeBaseline(pkgDir, {
    baseUrl: baseUrl ?? run.baseline?.baseUrl,
    uiUrl: uiUrl ?? run.baseline?.uiUrl,
    recordedAt: new Date().toISOString(),
    ...addRuns(run.baseline, run.measured, baseUrl, uiUrl),
  });
  return true;
}
