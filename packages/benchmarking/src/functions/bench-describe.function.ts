// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/**
 * Declares a benchmark suite. Reach it through {@link bench.describe}.
 *
 * The title is prefixed with `benchmark:` so a normal `npm test` can skip
 * every benchmark with `--grep 'benchmark:' --invert`.
 *
 * @param title - Suite name, without the prefix.
 * @param callback - Suite body. It must be synchronous, as Mocha collects the
 * tests inside it while the file is loaded.
 */
export function benchDescribe(
  title: string,
  callback: () => void,
): Mocha.Suite {
  return describe(`benchmark: ${title}`, callback);
}
