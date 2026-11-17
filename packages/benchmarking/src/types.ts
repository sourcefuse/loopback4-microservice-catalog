// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export type MetricRange = {
  mean: number;
  min: number;
  max: number;
};

/** The numbers of one measured run of one benchmark. */
export type PerformanceMetrics = {
  throughput: MetricRange;
  latency: MetricRange;
  samples: number;
};

/**
 * What a run file holds: the mean throughput, in ops/s, of each run of each
 * benchmark, by the suite title path and the benchmark title. Only
 * `bench-compare` reads it, so the package does not export the type.
 */
export type RunFile = {
  [suite: string]: {
    [test: string]: {history: number[]};
  };
};
