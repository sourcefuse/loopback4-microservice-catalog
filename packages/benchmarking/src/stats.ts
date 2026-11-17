// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {config} from './config';

export const PERCENT = 100;

export function mean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

/**
 * Run-to-run spread of throughput samples, as a coefficient of variation in %.
 * Undefined when there are fewer than `BENCH_MIN_NOISE_HISTORY` samples or the
 * mean is not positive.
 */
export function noiseOf(history: number[]): number | undefined {
  if (history.length < config.minNoiseHistory) {
    return undefined;
  }
  const average = mean(history);
  if (!Number.isFinite(average) || average <= 0) {
    return undefined;
  }
  const variance =
    history.reduce((sum, value) => sum + (value - average) ** 2, 0) /
    (history.length - 1);
  return (Math.sqrt(variance) / average) * PERCENT;
}

export type Threshold = {
  /** The drop, in %, past which a benchmark counts as a regression. */
  threshold: number;
  /** The run-to-run spread, in %, that the threshold came from, if any. */
  noise?: number;
};

/**
 * A steady benchmark gets a tight threshold and a noisy one a loose one:
 * `BENCH_NOISE_MULTIPLIER` × its spread, clamped to
 * [`BENCH_MIN_THRESHOLD`, `BENCH_THRESHOLD`]. The noisiest history decides.
 * Without enough history, or with the multiplier at 0, it is `BENCH_THRESHOLD`.
 */
export function computeThreshold(...histories: number[][]): Threshold {
  const ceiling = config.threshold;
  const noises = histories
    .map(noiseOf)
    .filter((noise): noise is number => noise !== undefined);
  if (config.noiseMultiplier === 0 || noises.length === 0) {
    return {threshold: ceiling};
  }
  const noise = Math.max(...noises);
  const floor = Math.min(config.minThreshold, ceiling);
  const threshold = Math.min(
    ceiling,
    Math.max(floor, config.noiseMultiplier * noise),
  );
  return {threshold, noise};
}

/**
 * The throughput of one side: the mean of its runs, without the runs more than
 * `BENCH_OUTLIER_PERCENT` from their median. A plain median of a few runs jumps
 * between the two speeds of a test that runs at one of two speeds per process.
 * A plain mean lets one lucky-fast run move the result. The median always
 * stays in, so at worst this is the median.
 */
export function typicalOps(values: number[]): number {
  const middle = median(values);
  if (!Number.isFinite(middle) || middle <= 0) {
    return middle;
  }
  const limit = (config.outlierPercent / PERCENT) * middle;
  const kept = values.filter(value => Math.abs(value - middle) <= limit);
  // With an even count the median sits between two runs, and both can be too far from it.
  return kept.length > 0 ? mean(kept) : middle;
}
