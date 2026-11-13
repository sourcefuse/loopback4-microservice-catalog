// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {describeError} from '../describe-error';
import {BenchmarkingError} from './benchmarking.error';

/**
 * Thrown when a run cannot be recorded in the run file. The original
 * failure stays available on `cause`.
 *
 * `cause` is a declared field instead of the ES2022 `ErrorOptions` argument
 * because the inherited tsconfig pins `lib: ["es2020"]`, which predates that
 * constructor overload.
 */
export class ReporterError extends BenchmarkingError {
  constructor(
    suite: string,
    test: string,
    public readonly cause: unknown,
  ) {
    super(
      `Failed to report benchmark data for "${suite}/${test}": ${describeError(cause)}`,
    );
  }
}
