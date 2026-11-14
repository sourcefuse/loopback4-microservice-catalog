// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Bench, type FnOptions} from 'tinybench';
import {config} from '../config';
import {BenchmarkConfigError} from '../errors/benchmark-config.error';
import {type PerformanceMetrics} from '../types';
import {toMetrics} from './metrics.function';
import {recordRun} from './recorder.function';

const THROUGHPUT_PRECISION = 2;
const LATENCY_PRECISION = 3;
const TIMEOUT_BASE_MS = 5000;
/** Budget per iteration, warm-up included. */
const TIMEOUT_PER_ITERATION_MS = 2000;
/**
 * Budget per ms of `BENCH_MIN_TIME`. A fast benchmark reaches the minimum time
 * with thousands of iterations, and its hooks run for each one, outside the
 * measured time.
 */
const TIMEOUT_PER_MIN_TIME_MS = 300;

/**
 * Hooks that tinybench runs around the callback, outside the measured time.
 * `beforeEach` and `afterEach` run around every iteration. All four hooks also
 * run in the warm-up phase, so `beforeAll` and `afterAll` run twice when
 * warm-up is on. Each hook gets the mode, `'warmup'` or `'run'`.
 */
export type BenchHooks = Pick<
  FnOptions,
  'beforeAll' | 'beforeEach' | 'afterEach' | 'afterAll'
>;

/** Hooks, plus settings for this benchmark only. */
export type BenchOptions = BenchHooks & {
  /**
   * Measured iterations for this benchmark, instead of `BENCH_ITERATIONS`.
   * Derive it from `config.iterations`, for example `config.iterations * 3`,
   * so that `BENCH_ITERATIONS` still scales it.
   */
  iterations?: number;
};

/**
 * Builds the one line we print per benchmark. Kept apart from the printing so
 * the wording can be asserted without capturing the console.
 *
 * @internal
 */
export function resultLine(test: string, metrics: PerformanceMetrics): string {
  const throughput = metrics.throughput.mean.toFixed(THROUGHPUT_PRECISION);
  const latency = metrics.latency.mean.toFixed(LATENCY_PRECISION);
  return `  ${test}: ${throughput} ops/s, ${latency} ms latency over ${metrics.samples} samples`;
}

/**
 * The Mocha time limit for one benchmark.
 *
 * @internal
 */
export function timeoutFor(iterations: number): number {
  return (
    TIMEOUT_BASE_MS +
    (iterations + 1) * TIMEOUT_PER_ITERATION_MS +
    config.minTime * TIMEOUT_PER_MIN_TIME_MS
  );
}

/**
 * Declares a single benchmark. It measures the callback and appends its mean
 * throughput to `BENCH_REPORT_FILE`. It does not fail on a slow result:
 * `bench-compare` decides that from the runs of two builds. Reach it through
 * {@link bench.it}.
 *
 * The callback must be declared `async`. tinybench detects a plain function
 * that returns a promise by calling it once before measuring, which adds an
 * extra unmeasured run.
 *
 * The callback should cover one logical operation. Concurrency and volume are
 * yours to set up: with a `Promise.all` body, `throughput.mean` counts batches
 * per second, not requests per second.
 *
 * @param title - Benchmark name, without the prefix.
 * @param callback - The operation to measure.
 * @param options - Hooks outside the measured time, and `iterations`.
 */
export function benchIt(
  title: string,
  callback: () => Promise<unknown>,
  options: BenchOptions = {},
): Mocha.Test {
  const {iterations: ownIterations, ...hooks} = options;
  if (
    ownIterations !== undefined &&
    !(Number.isInteger(ownIterations) && ownIterations >= 1)
  ) {
    throw new BenchmarkConfigError(
      `iterations of "${title}" must be a whole number of 1 or more, not ${ownIterations}`,
    );
  }
  return it(`benchmark: ${title}`, async function () {
    const iterations = ownIterations ?? config.iterations;
    const timeout = timeoutFor(iterations);
    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    this.timeout(timeout);
    // The full title path keys the runs, so renaming a suite or a benchmark
    // starts a new entry. Mocha always gives a running test a parent, the root
    // suite at the very least.
    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    const suite = this.test!.parent!.titlePath().join(' > ');

    const bench = new Bench({
      iterations,
      // Measurement stops when both `iterations` and this many ms are reached,
      // so a fast callback still gets enough samples for a steady mean.
      time: config.minTime,
      warmup: config.warmup,
      // Warm-up stops when both one iteration and this many ms are reached, so
      // V8 can optimise a fast callback before it is measured.
      warmupIterations: 1,
      warmupTime: config.warmupTime,
      // Mocha fails the test at its time limit but cannot stop the callback.
      // This signal stops tinybench at the same moment.
      signal: AbortSignal.timeout(timeout),
    });

    bench.add(title, callback, hooks);
    await bench.run();

    const metrics = toMetrics(bench.tasks[0]);
    recordRun(suite, title, metrics.throughput.mean);

    if (config.isCI) {
      console.info(resultLine(title, metrics));
    }
  });
}
