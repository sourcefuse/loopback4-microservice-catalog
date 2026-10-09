// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {HeavyEndpoint} from '../project/types';

export type EndpointStats = {
  /** Responses plus network errors. */
  count: number;
  /** Network errors plus 4xx/5xx responses. */
  failed: number;
  /** Undefined when no response arrived. */
  p95?: number;
};

/** Virtual users of one scenario run. A vuser runs the steps of a scenario one time. */
export type VuserCounts = {
  /** Count of vusers that began their run. */
  started: number;
  /** Count of vusers that ran all their steps without an error. */
  completed: number;
  /** Count of vusers whose run stopped on an error. */
  failed: number;
};

/**
 * What one engine measured in one scenario run. Every engine returns this,
 * so the report does not depend on the engine.
 */
export type Measurement = {
  endpoints: Map<string, EndpointStats>;
  /** Errors that a hook threw. They are not application errors. */
  hookErrors: number;
  vusers: VuserCounts;
  /** Seconds from the first to the last count of the run. */
  seconds: number;
};

/** The run of one scenario, as the report gets it. */
export type ScenarioRun = Measurement & {
  /** The load of the run, as `describeWorkload` says it. */
  workload: string;
  /**
   * What failed in `after` and in the cleanups. The numbers of the run are
   * still good, but the scenario fails.
   */
  problems: string[];
};

/** What the judge says about one endpoint of one scenario. */
export type EndpointResult = {
  /** Endpoint id, for example `GET /orders`. */
  id: string;
  /** Count of responses plus network errors. */
  requests: number;
  /** Requests each second over the measured time. Undefined when no time was measured. */
  perSecond?: number;
  /** 95th percentile of the response time, in milliseconds. Undefined when no response arrived. */
  p95?: number;
  /** Highest p95 that passes, in milliseconds: the p95 limit, or the limit from the baseline when that is lower. */
  p95Limit: number;
  /** Mean p95 of the baseline history, in milliseconds. Undefined when it is not compared. */
  baselineP95?: number;
  /** Percent of the requests that failed. */
  errorRate: number;
  /** Highest error rate that passes, in percent. */
  errorRateLimit: number;
  /** Why the endpoint fails. Empty means it passes. */
  failures: string[];
  /** Why a passing endpoint was not compared with a baseline, for example `no baseline`. */
  note?: string;
};

/** What the judge says about the vusers of one scenario. */
export type VuserResult = VuserCounts & {
  /** Highest percent of failed vusers that passes. */
  failedLimit: number;
  /** Why the vusers fail. Empty means they pass. */
  failures: string[];
};

/** What the judge says about one scenario. */
export type ScenarioResult = {
  name: string;
  /** The load, as `describeWorkload` says it. Empty when the scenario threw. */
  workload: string;
  /** All zero when the scenario threw. */
  vusers: VuserResult;
  /** Count of errors that a hook threw. They are not application errors. */
  hookErrors: number;
  /** What failed in `after` and in the cleanups. */
  problems: string[];
  /** The message of the error that stopped the scenario. Undefined when it ran. */
  error?: string;
  /** Says that the baseline was not compared, and why. */
  baselineNote?: string;
  /** Empty when the scenario threw. */
  endpoints: EndpointResult[];
  passed: boolean;
};

/** The heavy APIs of a package, and how many its config allows. */
export type HeavyApis = {
  /** How many are allowed: `maxHeavyApis`, 0 when it is not set. */
  max: number;
  endpoints: HeavyEndpoint[];
};

/** What a whole run gave. Plain data, with no engine names, for a `Reporter`. */
export type RunResult = {
  /** The scenarios that ended, in run order. */
  scenarios: ScenarioResult[];
  /** Names of the scenarios that a project marked as skipped. */
  skipped: string[];
  /** Endpoints of the OpenAPI spec that a scenario calls. */
  coverage: {
    /** Count of endpoints that a scenario calls. */
    covered: number;
    /** Count of endpoints in the spec. */
    total: number;
    /** The spec file, relative to the package. */
    specFile: string;
  };
  /**
   * The endpoints with a p95 limit above `P95_TARGETS.supportingApi`, and the
   * allowed count.
   */
  heavyApis: HeavyApis;
  /** False when the package has no baseline file. */
  hasBaseline: boolean;
  /**
   * True when every scenario passed, and the package has no more heavy APIs
   * than its max.
   */
  passed: boolean;
  /** True when a signal ended the run before its last scenario. */
  stopped: boolean;
};

/**
 * Gets the result of a run, once, at its end. A project sets its reporters
 * in `config.ts`. A reporter cannot change the verdict. When it throws or
 * rejects, the exit code is 1.
 */
export type Reporter = {
  /** Shown in the message when the reporter fails. */
  name: string;
  onRunEnd(result: RunResult): void | Promise<void>;
};

export type Baseline = {
  /** Where the baseline ran. For information only. */
  baseUrl: string;
  recordedAt: string;
  /**
   * The p95 of the last runs in milliseconds, oldest first, by scenario
   * name, then by endpoint id.
   */
  history: Record<string, Record<string, number[]>>;
  /**
   * The workload of each scenario in `history`, as `describeWorkload` says
   * it. A run with another workload starts a new history.
   */
  workloads: Record<string, string>;
};

/** What one scenario measured in a run. */
export type BaselineSample = {
  /** The workload of the run, as `describeWorkload` says it. */
  workload: string;
  /** p95 in milliseconds, by endpoint id. */
  p95: Record<string, number>;
};
