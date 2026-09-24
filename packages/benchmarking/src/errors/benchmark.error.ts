// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BenchmarkingError} from './benchmarking.error';

/**
 * Thrown when a tinybench run gives unusable results: no result at all, a
 * task-level error, or missing throughput/latency data. Callers can catch this
 * class to tell harness failures apart from a real regression.
 */
export class BenchmarkError extends BenchmarkingError {
  /**
   * Carries the error the benchmark callback threw, so its stack survives.
   * A declared field rather than the ES2022 `ErrorOptions`, because the
   * inherited tsconfig pins `lib` to es2020.
   */
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
  }
}
