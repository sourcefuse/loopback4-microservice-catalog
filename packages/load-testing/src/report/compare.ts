// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {
  ResolvedMetricThresholds,
  ResolvedThresholds,
} from '../project/types';
import type {
  EndpointStats,
  HeavyApis,
  MetricResult,
  VuserCounts,
} from './types';

/** One rule for the verdict and the FAIL line: more heavy APIs than the max. */
export function exceedsMax({endpoints, max}: HeavyApis): boolean {
  return endpoints.length > max;
}

/** Returns the reasons the endpoint fails. Empty means it passes. */
export function judge(
  stats: EndpointStats,
  limits: ResolvedThresholds,
): string[] {
  if (stats.count === 0) return ['no requests'];
  const failures: string[] = [];
  const rate = errorRate(stats);
  if (rate > limits.errorRate) {
    failures.push(`error rate ${round(rate)}% > ${limits.errorRate}%`);
  }
  if (stats.p95 === undefined) return failures;
  return [...failures, ...judgeP95(stats.p95, limits)];
}

/**
 * Returns the reasons a p95 fails its limit. Empty means it passes. The
 * messages give `unit` after each value.
 */
export function judgeP95(
  p95: number,
  limits: ResolvedMetricThresholds,
  unit: MetricResult['unit'] = 'ms',
): string[] {
  const show = (value: number) =>
    unit === '' ? `${value}` : `${value} ${unit}`;
  return p95 > limits.p95
    ? [`p95 ${show(p95)} > limit ${show(limits.p95)}`]
    : [];
}

/** Returns the reasons the vusers of a scenario fail. Empty means it passes. */
export function judgeVusers(
  vusers: VuserCounts,
  limits: Pick<ResolvedThresholds, 'errorRate'>,
): string[] {
  const rate =
    vusers.started === 0 ? 0 : (vusers.failed / vusers.started) * 100;
  return rate > limits.errorRate
    ? [`vuser failure rate ${round(rate)}% > ${limits.errorRate}%`]
    : [];
}

/** Percent of the requests of an endpoint that failed. */
export function errorRate(stats: EndpointStats): number {
  return stats.count === 0 ? 0 : (stats.failed / stats.count) * 100;
}

export function round(value: number, decimals = 1): number {
  const scale = 10 ** decimals;
  return Math.round(value * scale) / scale;
}

/**
 * Rounds a metric value for display. CLS has no unit and is below 1, so it
 * needs 2 decimals: with 1, a limit of 0.25 would show as 0.3.
 */
export function roundFor(unit: MetricResult['unit'], value: number): number {
  return round(value, unit === '' ? 2 : 1);
}
