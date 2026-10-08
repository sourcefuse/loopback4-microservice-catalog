// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BenchmarkConfigError} from './errors/benchmark-config.error';

const DEFAULT_OPS_TO_TRACK = 10;
const DEFAULT_ITERATIONS = 10;
const DEFAULT_THRESHOLD = 40;
const DEFAULT_MIN_SAMPLES = 3;

const MAX_OPS_TO_TRACK = 100;
const MAX_ITERATIONS = 1000;
const MIN_THRESHOLD = 0;
const MAX_THRESHOLD = 100;

/**
 * Every property is `readonly`, because the live object is built from getters.
 * An assignment would be silently dropped at run time, so we make it a compile
 * error instead.
 */
export type BenchmarkConfig = {
  readonly opsToTrack: number;
  readonly iterations: number;
  readonly warmup: boolean;
  readonly threshold: number;
  readonly minSamples: number;
  readonly updateBaseline: boolean;
  readonly reportFile: string;
  readonly isCI: boolean;
  readonly forceBaseline: boolean;
};

/**
 * Reads a whole number. `Number` is used rather than `parseInt`, because
 * `parseInt` reads `1e3` as 1 and `10abc` as 10. We would rather fall back to
 * the default than run with a number the caller did not mean.
 */
function readInt(
  value: string | undefined,
  fallback: number,
  min: number,
  max: number,
): number {
  if (!value?.trim()) {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    return fallback;
  }
  return Math.min(Math.max(parsed, min), max);
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
  get opsToTrack(): number {
    return readInt(
      process.env.BENCH_OPS_TO_TRACK,
      DEFAULT_OPS_TO_TRACK,
      1,
      MAX_OPS_TO_TRACK,
    );
  },
  get iterations(): number {
    return readInt(
      process.env.BENCH_ITERATIONS,
      DEFAULT_ITERATIONS,
      1,
      MAX_ITERATIONS,
    );
  },
  get warmup(): boolean {
    return process.env.BENCH_WARMUP !== 'false';
  },
  get threshold(): number {
    const raw = process.env.BENCH_THRESHOLD;
    const parsed = Number(raw ?? '');
    if (!raw?.trim() || !Number.isFinite(parsed)) {
      return DEFAULT_THRESHOLD;
    }
    return Math.min(Math.max(parsed, MIN_THRESHOLD), MAX_THRESHOLD);
  },
  /**
   * Capped at `opsToTrack`, because the window never holds more than that many
   * samples. A higher floor would leave the gate building a baseline forever.
   */
  get minSamples(): number {
    const ceiling = this.opsToTrack;
    return readInt(
      process.env.BENCH_MIN_SAMPLES,
      Math.min(DEFAULT_MIN_SAMPLES, ceiling),
      1,
      ceiling,
    );
  },
  get updateBaseline(): boolean {
    return process.env.BENCH_UPDATE_BASELINE === '1';
  },
  get reportFile(): string {
    return readPath(process.env.BENCH_REPORT_FILE, './.bench/report.json');
  },
  get isCI(): boolean {
    return process.env.CI === 'true';
  },
  get forceBaseline(): boolean {
    return process.env.BENCH_FORCE_BASELINE === '1';
  },
};
