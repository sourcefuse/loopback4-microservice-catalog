// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {type Task} from 'tinybench';
import {type PerformanceMetrics} from '../types';
import {BenchmarkError} from '../errors/benchmark.error';

/**
 * Narrows a tinybench task down to the numbers we keep.
 *
 * @throws BenchmarkError when the run produced nothing usable. That is a broken
 * benchmark rather than a slow one, so it must not read as a regression.
 */
export function toMetrics(task: Task | undefined): PerformanceMetrics {
  const result = task?.result;

  if (!result) {
    throw new BenchmarkError(
      'The benchmark produced no result. Check that the callback returns and does not hang.',
    );
  }

  if (result.aborted) {
    throw new BenchmarkError(
      'The benchmark was stopped at the Mocha time limit. Make the callback faster, or lower BENCH_ITERATIONS or BENCH_MIN_TIME.',
    );
  }

  if (result.error) {
    throw new BenchmarkError(
      `The benchmark callback threw: ${result.error.message}`,
      result.error,
    );
  }

  if (!result.throughput || !result.latency) {
    throw new BenchmarkError(
      'The benchmark result is missing throughput or latency data. This usually means every iteration failed.',
    );
  }

  return {
    throughput: {
      mean: result.throughput.mean,
      min: result.throughput.min,
      max: result.throughput.max,
    },
    latency: {
      mean: result.latency.mean,
      min: result.latency.min,
      max: result.latency.max,
    },
    samples: result.latency.samples.length,
  };
}
