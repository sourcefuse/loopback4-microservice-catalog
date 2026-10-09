// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {BaselineSample, ScenarioResult} from '../report/types';
/** The application under test, and how to log in to it, if at all. */
export type Target = {
  baseUrl: string;
  /** Serves `/auth/login` and `/auth/token`. */
  authUrl: string;
  /** Undefined when `LOAD_TESTS_USERNAME` is not set: the run has no login. */
  login?: Login;
};

/** What the two-step ARC login needs. */
export type Login = {
  username: string;
  password: string;
  clientId: string;
  clientSecret: string;
};

export type Session = {
  accessToken: string;
  refreshToken: string;
};

/** What the scenarios of a run gave. */
export type Outcome = {
  /** The result of each scenario that ended, in run order. */
  scenarios: ScenarioResult[];
  /** What each scenario measured, by scenario name. */
  measured: Record<string, BaselineSample>;
  /** The error of the signal that stopped the run, if one did. */
  stopped?: unknown;
};
