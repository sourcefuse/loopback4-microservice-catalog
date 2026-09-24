// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Bench} from 'tinybench';
import {config} from '../config';
import {type PerformanceMetrics} from '../types';
import {PerformanceRegressionError} from '../errors/performance-regression.error';
import {deviationLabel, toMetrics} from './metrics.function';
import {reporter, type ReporterResult} from './reporter.function';

const THROUGHPUT_PRECISION = 2;
const LATENCY_PRECISION = 3;
const TIMEOUT_BASE_MS = 5000;
const TIMEOUT_PER_ITERATION_MS = 2000;

/**
 * Builds the one line we print per benchmark. Kept apart from the printing so
 * the wording can be asserted without capturing the console.
 *
 * @internal
 */
export function resultLine(
  test: string,
  metrics: PerformanceMetrics,
  result: ReporterResult,
): string {
  const throughput = metrics.throughput.mean.toFixed(THROUGHPUT_PRECISION);
  const latency = metrics.latency.mean.toFixed(LATENCY_PRECISION);

  if (result.buildingBaseline) {
    // Counts recorded runs, not the iterations inside this one. Those are two
    // different numbers and reading one as the other is misleading.
    return `  ${test}: building baseline, ${throughput} ops/s, ${result.recorded} of ${config.minSamples} runs recorded`;
  }

  const label = deviationLabel(result.deviation, result.regressed);
  return `  ${test}: ${label} ${result.deviation.toFixed(THROUGHPUT_PRECISION)}%, ${throughput} ops/s, ${latency} ms latency over ${metrics.samples} samples`;
}

/**
 * Declares a single benchmark and fails the test when throughput regresses past
 * the threshold. Reach it through {@link bench.it}.
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
 */
export function benchIt(
  title: string,
  callback: () => Promise<unknown>,
): Mocha.Test {
  return it(`benchmark: ${title}`, async function () {
    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    this.timeout(
      TIMEOUT_BASE_MS + (config.iterations + 1) * TIMEOUT_PER_ITERATION_MS,
    );
    // The full title path keys the history, so renaming a suite or a benchmark
    // orphans its samples and starts a new baseline. Mocha always gives a
    // running test a parent, the root suite at the very least.
    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    const suite = this.test!.parent!.titlePath().join(' > ');

    const bench = new Bench({
      iterations: config.iterations,
      warmup: config.warmup,
      warmupIterations: 1,
      warmupTime: 0,
      // `0` drops the time based stopping rule, so the iteration count alone
      // decides when the run ends. See tinylibs/tinybench#83.
      time: 0,
    });

    bench.add(title, callback);
    await bench.run();

    const metrics = toMetrics(bench.tasks[0]);
    const result = reporter(suite, title, metrics);

    if (config.isCI) {
      console.info(resultLine(title, metrics, result));
    }

    if (result.regressed) {
      throw new PerformanceRegressionError(result.deviation, config.threshold);
    }
  });
}
