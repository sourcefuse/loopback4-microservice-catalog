// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BenchmarkingError} from './benchmarking.error';

const DECIMAL_PRECISION = 2;

/**
 * Thrown when a run drops further below the baseline than the configured
 * threshold allows. Deviation and threshold stay available as fields, so
 * callers do not have to parse the message.
 */
export class PerformanceRegressionError extends BenchmarkingError {
  constructor(
    public readonly deviation: number,
    public readonly threshold: number,
  ) {
    super(
      `Performance regression detected: deviation of ${deviation.toFixed(DECIMAL_PRECISION)}% exceeds the threshold of -${threshold}%`,
    );
  }
}
