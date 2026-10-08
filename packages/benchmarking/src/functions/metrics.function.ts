// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {type Task} from 'tinybench';
import {config} from '../config';
import {type PerformanceMetrics} from '../types';
import {BenchmarkError} from '../errors/benchmark.error';

/**
 * Describes a deviation for the CI log. Presentation only, it gates nothing.
 * `regressed` comes from the gate rather than being recomputed here, so the
 * label can never disagree with the outcome of the run.
 */
export function deviationLabel(deviation: number, regressed: boolean): string {
  if (regressed) {
    return 'REGRESSION';
  }
  return deviation > config.threshold ? 'IMPROVEMENT' : 'STABLE';
}

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
