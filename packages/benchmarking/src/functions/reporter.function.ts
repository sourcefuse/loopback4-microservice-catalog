// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import {dirname} from 'node:path';
import {config} from '../config';
import {describeError} from '../describe-error';
import {type BaselineData, type PerformanceMetrics} from '../types';
import {BenchmarkingError} from '../errors/benchmarking.error';
import {ReporterError} from '../errors/reporter.error';

const PERCENT = 100;

function readBaseline(): BaselineData {
  if (!existsSync(config.reportFile)) {
    return {};
  }
  try {
    return JSON.parse(readFileSync(config.reportFile, 'utf-8')) as BaselineData;
  } catch (error) {
    // A corrupt file must not block the run. Say so loudly though: a silent
    // fresh start turns the gate off for the next few runs.
    console.info(
      `Baseline file "${config.reportFile}" is unreadable, starting a fresh history: ${describeError(error)}`,
    );
    return {};
  }
}

/**
 * Replaces the file in one step, so an interrupted run cannot leave a truncated
 * baseline behind. A truncated file parses as empty and would silently drop
 * every recorded history.
 */
function writeBaseline(data: BaselineData): void {
  mkdirSync(dirname(config.reportFile), {recursive: true});
  const temporary = `${config.reportFile}.tmp`;
  try {
    writeFileSync(temporary, JSON.stringify(data, null, 2));
    renameSync(temporary, config.reportFile);
  } catch (error) {
    rmSync(temporary, {force: true});
    throw error;
  }
}

/**
 * Picks the window to store. A regressed run is held out of the history, so a
 * bad merge cannot drag the rolling average down. `BENCH_FORCE_BASELINE` is the
 * way back: it restarts the window from the run that failed.
 */
function nextHistory(
  recent: number[],
  throughput: number,
  regressed: boolean,
): number[] {
  if (regressed && config.forceBaseline) {
    return [throughput];
  }
  if (regressed) {
    return recent;
  }
  return [...recent, throughput].slice(-config.opsToTrack);
}

function mean(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export type ReporterResult = {
  /** Percentage change of this run against the baseline average. */
  deviation: number;
  /** True while the history holds fewer samples than `BENCH_MIN_SAMPLES`. */
  buildingBaseline: boolean;
  /** Recorded runs in the window this run was compared against. */
  recorded: number;
  /**
   * True when this run dropped further below the baseline than the threshold
   * allows. The caller fails the test on it, and the history is held back for
   * the same reason, so both decisions are made here and cannot drift apart.
   */
  regressed: boolean;
};

/**
 * Compares a run against the recorded history and records the new sample.
 *
 * The history is a rolling window of throughput means rather than a single
 * previous run, because one CI sample is far too noisy to gate on.
 *
 * When a run regresses the history is held as it is, so a bad merge cannot drag
 * the rolling average down and quietly widen the accepted range. This is our own
 * choice, not a pattern copied from another tool. `BENCH_FORCE_BASELINE=1`
 * restarts the window from a regressed run, which is the escape hatch after a
 * deliberate trade-off.
 */
export function reporter(
  suite: string,
  test: string,
  metrics: PerformanceMetrics,
): ReporterResult {
  try {
    const baseline = readBaseline();
    const history = baseline[suite]?.[test]?.history ?? [];
    const recent = Array.isArray(history)
      ? history.slice(-config.opsToTrack)
      : [];

    const buildingBaseline = recent.length < config.minSamples;
    // An empty window gives NaN, which falls through the same guard that
    // catches a zero average.
    const average = mean(recent);
    const rawDeviation =
      ((metrics.throughput.mean - average) / average) * PERCENT;
    const deviation = Number.isFinite(rawDeviation) ? rawDeviation : 0;

    const regressed = !buildingBaseline && deviation < -config.threshold;

    if (config.updateBaseline) {
      baseline[suite] = {
        ...baseline[suite],
        [test]: {
          history: nextHistory(recent, metrics.throughput.mean, regressed),
          latest: {...metrics, latestDeviation: deviation},
        },
      };
      writeBaseline(baseline);
    }

    return {deviation, buildingBaseline, regressed, recorded: recent.length};
  } catch (error) {
    // A bad setting is the caller's problem and already says so. Only wrap the
    // failures that are really about reading or writing the baseline.
    if (error instanceof BenchmarkingError) {
      throw error;
    }
    throw new ReporterError(suite, test, error);
  }
}
