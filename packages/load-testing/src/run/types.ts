// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {BaselineSample, ScenarioResult} from '../report/types';
/**
 * The application under test, and how to log in to it, if at all. The URLs
 * of the API are undefined when no scenario of the run sends requests or has
 * a `before` or `after` hook, and the run has no login.
 */
export type Target = (
  | {
      baseUrl: string;
      /** Serves `/auth/login` and `/auth/token`. */
      authUrl: string;
      /** The URL of each backend that `apis` in `config.ts` names, by its name. */
      apiUrls: Record<string, string>;
      /** Undefined when `LOAD_TESTS_USERNAME` is not set: the run has no login. */
      login?: Login;
    }
  | {
      baseUrl?: undefined;
      authUrl?: undefined;
      apiUrls?: undefined;
      login?: undefined;
    }
) & {
  /** The web app under test. Undefined when no browser scenario runs. */
  uiUrl?: string;
};

/** The URLs that the scenarios of a run need. */
export type TargetNeeds = {
  /**
   * True when a scenario of the run sends requests to the API, or has a
   * `before` or `after` hook: the API client of a hook uses the base URL.
   */
  api: boolean;
  /** True when a scenario of the run opens the web app. */
  ui: boolean;
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
