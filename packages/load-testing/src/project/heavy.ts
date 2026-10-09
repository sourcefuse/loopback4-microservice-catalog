// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {P95_TARGETS} from './config';
import type {HeavyEndpoint, LoadedScenario} from './types';

/**
 * Finds the heavy APIs: the endpoint ids whose p95 limit is above
 * `P95_TARGETS.supportingApi`. The input is every loaded scenario, also the
 * ones that a run skips, so that a skip cannot hide a heavy API. An id counts
 * once, with its highest limit, in the order of its first appearance.
 */
export function findHeavyEndpoints(loaded: LoadedScenario[]): HeavyEndpoint[] {
  const highest = new Map<string, number>();
  for (const {endpoints} of loaded) {
    for (const [id, {p95}] of endpoints) {
      if (p95 > P95_TARGETS.supportingApi) {
        highest.set(id, Math.max(p95, highest.get(id) ?? 0));
      }
    }
  }
  return [...highest].map(([id, p95]) => ({id, p95}));
}
