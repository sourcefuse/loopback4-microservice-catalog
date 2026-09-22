// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {benchDescribe} from './bench-describe.function';
import {benchIt} from './bench-it.function';

/**
 * The only way in. The two functions behind it stay unexported on purpose, so
 * there is one name for each idea rather than two.
 *
 * It mirrors Mocha, so a benchmark file reads like any other test file:
 *
 * ```ts
 * import {bench} from '@sourceloop/benchmarking';
 *
 * bench.describe('order service', () => {
 *   bench.it('creates an order', async () => {
 *     await service.create(fixture);
 *   });
 * });
 * ```
 */
export const bench = {
  describe: benchDescribe,
  it: benchIt,
} as const;
