// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BenchmarkConfigError} from '../errors/benchmark-config.error';

/**
 * A global key, not a module variable: the benchmark file and `bench-select`
 * can load two copies of this package, and both must see the same list.
 */
const LINKS_KEY = Symbol.for('@sourceloop/benchmarking/links');

type LinkStore = {[LINKS_KEY]?: string[]};

function store(): string[] {
  const holder = globalThis as LinkStore;
  holder[LINKS_KEY] ??= [];
  return holder[LINKS_KEY];
}

/**
 * Names the source files that the benchmarks of this file depend on, so
 * `bench-select` runs the file only when one of them changes. Paths are
 * relative to the package and can be globs. Put the call at the bottom of the
 * file, below the suites. It has no effect on a benchmark run.
 *
 * A file without a call always runs.
 *
 * @throws BenchmarkConfigError for a negated (`!`) or `./` path, because
 * `path.matchesGlob` never matches them.
 *
 * @example
 * bench.links('src/services/order*.ts', 'src/repositories/order.repository.ts');
 */
export function benchLinks(...globs: string[]): void {
  const bad = globs.find(glob => glob.startsWith('!') || glob.startsWith('./'));
  if (bad !== undefined) {
    throw new BenchmarkConfigError(
      `bench.links does not accept "${bad}". Give a path relative to the package, without "./" or "!".`,
    );
  }
  store().push(...globs);
}

/**
 * Returns the links collected since the last call, and clears them.
 *
 * @internal
 */
export function takeLinks(): string[] {
  return store().splice(0);
}
