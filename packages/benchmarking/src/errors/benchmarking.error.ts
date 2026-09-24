// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/**
 * Base for every error thrown by `@sourceloop/benchmarking`. Subclasses inherit
 * the correct `name` from `new.target`, so it cannot drift from the class name.
 */
export class BenchmarkingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
