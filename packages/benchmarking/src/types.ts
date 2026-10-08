// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/**
 * Shape of the report file and of a single measured run. These describe what we
 * store on disk, not how the run is configured.
 */
export type MetricRange = {
  mean: number;
  min: number;
  max: number;
};

export type PerformanceMetrics = {
  throughput: MetricRange;
  latency: MetricRange;
  samples: number;
};

export type BaselineEntry = {
  history: number[];
  latest: PerformanceMetrics & {latestDeviation: number};
};

export type BaselineData = {
  [suiteName: string]: {
    [testName: string]: BaselineEntry;
  };
};
