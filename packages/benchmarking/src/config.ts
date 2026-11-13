// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BenchmarkConfigError} from './errors/benchmark-config.error';

/**
 * 30 rather than 10, so the mean of a run averages out a single GC or
 * scheduler pause.
 */
const DEFAULT_ITERATIONS = 30;
/**
 * A test that takes microseconds per call was timed for well under a
 * millisecond with a fixed iteration count, and varied by up to 24% between
 * processes on CI. 200 ms of samples brought that under 3%.
 */
const DEFAULT_MIN_TIME_MS = 200;
/** Long enough for V8 to optimise a fast callback before it is measured. */
const DEFAULT_WARMUP_TIME_MS = 100;
/**
 * The most a head build may fall short of the base build, in %. Same-machine
 * comparisons caught planted slowdowns of 20% and more, with no false alarm.
 */
const DEFAULT_THRESHOLD = 15;
const DEFAULT_NOISE_MULTIPLIER = 4;
const DEFAULT_MIN_THRESHOLD = 10;
/** The fewest runs that give a usable spread estimate. */
const DEFAULT_MIN_NOISE_HISTORY = 3;
/**
 * Single lucky-fast runs on CI were 64% from the median of their side. Tests
 * that run at one of two speeds per process had speeds up to 33% apart, and
 * both speeds must stay in the mean.
 */
const DEFAULT_OUTLIER_PERCENT = 40;

const MAX_ITERATIONS = 1000;
const MAX_TIME_MS = 10_000;
const MAX_PERCENT = 100;
const MAX_NOISE_HISTORY = 100;
const MAX_OUTLIER_PERCENT = 1000;

/**
 * Every property is `readonly`, because the live object is built from getters.
 * An assignment would be silently dropped at run time, so we make it a compile
 * error instead.
 */
export type BenchmarkConfig = {
  readonly iterations: number;
  readonly minTime: number;
  readonly warmup: boolean;
  readonly warmupTime: number;
  readonly threshold: number;
  readonly noiseMultiplier: number;
  readonly minThreshold: number;
  readonly minNoiseHistory: number;
  readonly outlierPercent: number;
  readonly reportFile: string;
  readonly isCI: boolean;
};

/**
 * Reads a number and clamps it to the range. `Number` is used rather than
 * `parseInt`, because `parseInt` reads `1e3` as 1 and `10abc` as 10. We would
 * rather fall back to the default than run with a number the caller did not
 * mean.
 */
function readNumber(
  value: string | undefined,
  fallback: number,
  min: number,
  max: number,
  wholeOnly = true,
): number {
  if (!value?.trim()) {
    return fallback;
  }
  const parsed = Number(value);
  const valid = wholeOnly ? Number.isInteger(parsed) : Number.isFinite(parsed);
  if (!valid) {
    return fallback;
  }
  return Math.min(Math.max(parsed, min), max);
}

function readPercent(value: string | undefined, fallback: number): number {
  return readNumber(value, fallback, 0, MAX_PERCENT, false);
}

/**
 * Rejects any path containing `..`, to stop a traversal out of the project.
 * Absolute paths pass: these variables are set by the developer who already
 * controls the process.
 */
function readPath(value: string | undefined, fallback: string): string {
  // Trimmed, because a path pasted into a CI `env:` block often carries a
  // trailing newline, and that would create a directory named after it.
  const path = value?.trim() ?? '';
  const resolved = path || fallback;
  if (resolved.includes('..')) {
    throw new BenchmarkConfigError(
      `Path traversal detected in "${resolved}". Use a path inside the project.`,
    );
  }
  return resolved;
}

/**
 * Live view of the benchmark settings. Every property is a getter, so
 * `process.env` is read at access time rather than at import time. That is what
 * lets a test set a variable after the module is already loaded.
 */
export const config: BenchmarkConfig = {
  get iterations(): number {
    return readNumber(
      process.env.BENCH_ITERATIONS,
      DEFAULT_ITERATIONS,
      1,
      MAX_ITERATIONS,
    );
  },
  get minTime(): number {
    return readNumber(
      process.env.BENCH_MIN_TIME,
      DEFAULT_MIN_TIME_MS,
      0,
      MAX_TIME_MS,
    );
  },
  get warmup(): boolean {
    return process.env.BENCH_WARMUP !== 'false';
  },
  get warmupTime(): number {
    return readNumber(
      process.env.BENCH_WARMUP_TIME,
      DEFAULT_WARMUP_TIME_MS,
      0,
      MAX_TIME_MS,
    );
  },
  get threshold(): number {
    return readPercent(process.env.BENCH_THRESHOLD, DEFAULT_THRESHOLD);
  },
  get noiseMultiplier(): number {
    return readNumber(
      process.env.BENCH_NOISE_MULTIPLIER,
      DEFAULT_NOISE_MULTIPLIER,
      0,
      MAX_PERCENT,
      false,
    );
  },
  get minThreshold(): number {
    return readPercent(process.env.BENCH_MIN_THRESHOLD, DEFAULT_MIN_THRESHOLD);
  },
  /** At least 2, because a spread needs two runs. */
  get minNoiseHistory(): number {
    return readNumber(
      process.env.BENCH_MIN_NOISE_HISTORY,
      DEFAULT_MIN_NOISE_HISTORY,
      2,
      MAX_NOISE_HISTORY,
    );
  },
  get outlierPercent(): number {
    return readNumber(
      process.env.BENCH_OUTLIER_PERCENT,
      DEFAULT_OUTLIER_PERCENT,
      0,
      MAX_OUTLIER_PERCENT,
      false,
    );
  },
  get reportFile(): string {
    return readPath(process.env.BENCH_REPORT_FILE, './.bench/report.json');
  },
  get isCI(): boolean {
    return process.env.CI === 'true';
  },
};
