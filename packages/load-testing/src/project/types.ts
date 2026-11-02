// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {MetricThresholds, Scenario, Thresholds, WebVital} from '../types';

/**
 * `Thresholds` with the library defaults filled in, so that every field has
 * a value.
 */
export type ResolvedThresholds = Required<Thresholds>;

/** `MetricThresholds` with every field set. */
export type ResolvedMetricThresholds = Required<MetricThresholds>;

/** The limits of a browser scenario, after the merge of all levels. */
export type BrowserLimits = {
  /** Limits of each step that `steps` does not name. */
  step: ResolvedMetricThresholds;
  /** Limits by step name. A step named here must have samples. */
  steps: Record<string, ResolvedMetricThresholds>;
  /** Limits by Web Vital. A Web Vital that is off is not here. */
  vitals: Partial<Record<WebVital, ResolvedMetricThresholds>>;
  /** Limits of the flow total. Undefined when no limit gates it. */
  flow?: ResolvedMetricThresholds;
};

export type LoadedScenario = {
  scenario: Scenario;
  /** Thresholds by endpoint id. When requests repeat an id, a later one wins. */
  endpoints: Map<string, ResolvedThresholds>;
  /** The limits of a browser scenario. Undefined for an HTTP scenario. */
  browser?: BrowserLimits;
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
