// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {Scenario, Thresholds} from '../types';

/**
 * `Thresholds` with the library defaults filled in, so that every field has
 * a value.
 */
export type ResolvedThresholds = Required<Thresholds>;

export type LoadedScenario = {
  scenario: Scenario;
  /** Thresholds by endpoint id. When requests repeat an id, a later one wins. */
  endpoints: Map<string, ResolvedThresholds>;
};

/** An endpoint whose p95 limit is above `P95_TARGETS.supportingApi`. */
export type HeavyEndpoint = {
  /** Endpoint id, for example `GET /orders`. */
  id: string;
  /** Highest p95 limit of the id over all scenarios, in milliseconds. */
  p95: number;
};

export type Coverage = {
  /** Declared endpoint ids that the spec does not have. */
  unknown: string[];
  covered: number;
  total: number;
};
