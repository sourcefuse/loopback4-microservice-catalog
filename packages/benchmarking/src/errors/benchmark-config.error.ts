// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BenchmarkingError} from './benchmarking.error';

/**
 * Thrown when an environment variable holds a value that cannot be accepted,
 * eg. a path traversal attempt in `BENCH_REPORT_FILE`.
 */
export class BenchmarkConfigError extends BenchmarkingError {}
