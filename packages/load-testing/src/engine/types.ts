// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {Measurement} from '../report/types';
import type {Phase} from '../scenario/types';
import type {LoadTestConfig, Scenario, Vars} from '../types';

/** What an engine gets for one run of one scenario. */
export type EngineRun = {
  /** The package folder. The engine may write files under its `.out` folder. */
  pkgDir: string;
  /** The scenario to run. `before` has already run. */
  scenario: Scenario;
  /** The config of the package. The engine reads its own options from it. */
  config: LoadTestConfig;
  /**
   * The load of the scenario, as the neutral layer merged it: the phases of
   * the scenario, or the ones of the config. The engine runs them one after
   * another.
   */
  phases: Phase[];
  /** What `before` put in `vars`. The requests of the scenario can read it. */
  runVars: Vars;
  /** Ids of the endpoints to measure, for example `GET /orders`. */
  endpointIds: string[];
  /**
   * The application under test, for example `http://localhost:3000`: the
   * API for a scenario of `load.it`, and the web app for a scenario of
   * `load.browser`.
   */
  baseUrl: string;
  /**
   * Access tokens of the pool users. Empty when no login is set, or when the
   * scenario does not use `token()`. The engine gives each virtual user one of
   * them for the requests that use `token()`, and only for them.
   */
  tokens: string[];
  /** Stops the load. The engine must stop its work and then throw. */
  signal: AbortSignal;
  /** True to print all the output of the load. The default is a short form. */
  verbose?: boolean;
};

/**
 * Runs the load of a scenario. The default is `artillery()`. To write an
 * engine, return an object of this type, and set it as `engine` in config.ts.
 */
export type Engine = {
  /** Name for messages, for example `artillery`. */
  readonly name: string;
  /**
   * Runs the load, and returns what it measured: one entry in `endpoints`
   * for each id of `endpointIds` that got a request. It throws `ScenarioError`
   * when it cannot run the scenario, and `RunError` when the load fails.
   */
  run(input: EngineRun): Promise<Measurement>;
};
