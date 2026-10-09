// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {ApiClient} from '../context/api';
import {Cleanup} from '../context/cleanup';
import {errorMessage} from '../errors';
import {failedScenario, judgeScenario} from '../report/report';
import {labelOf} from '../scenario/label';
import {createSql} from '../context/sql';
import {claimsOf} from './target';
import {defaultTokenCheck} from './tokenCheck';
import {usesToken} from '../scenario/token';
import type {Engine} from '../engine/types';
import type {LoadTestConfig, RunContext, Scenario, Vars} from '../types';
import {describeWorkload, phasesOf} from '../scenario/workload';
import {print, printError} from '../output';
import type {LoadedScenario, ResolvedThresholds} from '../project/types';
import type {Outcome, Target} from './types';
import type {Baseline, ScenarioRun} from '../report/types';

/**
 * Runs the scenarios one after another, and judges each. A scenario that
 * fails gets a failed result, and the next one still runs. A signal stops the
 * loop: the outcome then has the results of the scenarios that ended.
 */
export async function runScenarios(
  scenarios: LoadedScenario[],
  runOne: (loaded: LoadedScenario) => Promise<ScenarioRun>,
  options: {
    baseline?: Baseline;
    vuserLimits: ResolvedThresholds;
    signal: AbortSignal;
  },
): Promise<Outcome> {
  const {signal, ...limits} = options;
  const outcome: Outcome = {scenarios: [], measured: {}};
  for (const loaded of scenarios) {
    // A signal that came while the last scenario cleaned up must not start the next one.
    if (signal.aborted) break;
    const name = labelOf(loaded.scenario);
    print(`\nScenario: ${name}`);
    try {
      addJudged(outcome, loaded, await runOne(loaded), limits);
    } catch (err) {
      if (signal.aborted) return {...outcome, stopped: err};
      outcome.scenarios.push(failedScenario(name, err));
    }
  }
  // Also a signal that came while the last scenario ran `after` or its cleanups.
  return signal.aborted ? {...outcome, stopped: signal.reason} : outcome;
}

/** Judges the run of one scenario, and adds the result to the outcome. */
function addJudged(
  outcome: Outcome,
  loaded: LoadedScenario,
  ran: ScenarioRun,
  limits: {baseline?: Baseline; vuserLimits: ResolvedThresholds},
): void {
  const judged = judgeScenario(loaded, ran, limits);
  outcome.scenarios.push(judged.result);
  if (Object.keys(judged.p95).length > 0) {
    outcome.measured[labelOf(loaded.scenario)] = {
      workload: ran.workload,
      p95: judged.p95,
    };
  }
}

type ExecuteOptions = {
  pkgDir: string;
  config: LoadTestConfig;
  /** Runs the load. */
  engine: Engine;
  target: Target;
  /** Access token of the login user. Undefined when the run has no login. */
  token?: string;
  /** Stops `before` at its next request, and stops the load. */
  signal: AbortSignal;
};

/**
 * Runs one scenario: `before`, the load, and `after`. `after` and the
 * cleanups run even when `before` or the load failed, or a signal came. When
 * the run itself failed, its error is thrown, and a failure of `after` or of
 * a cleanup is logged. Otherwise such a failure is in `problems` of the
 * result.
 */
export async function execute(
  {scenario, endpoints}: LoadedScenario,
  {pkgDir, config, engine, target, token, signal}: ExecuteOptions,
): Promise<ScenarioRun> {
  const cleanup = new Cleanup();
  const database = createSql(config.datasources ?? {}, pkgDir);
  /*
   * A signal stops the requests of `before`. It must not stop the cleanups,
   * and a cleanup that `before` registered uses the client of `before`. So
   * the client asks for its signal at each request, and `before` gives the
   * signal back when it ends.
   */
  let beforeSignal: AbortSignal | undefined = signal;
  const ctx: RunContext = {
    token,
    claims: token === undefined ? {} : claimsOf(token),
    api: new ApiClient(target.baseUrl, {signal: () => beforeSignal}),
    sql: database.sql,
    defer: cleanup.defer,
  };
  const vars: Vars = {};
  let run: Omit<ScenarioRun, 'problems'> | undefined;
  let failure: unknown;
  try {
    try {
      await scenario.before?.(ctx, vars);
    } finally {
      beforeSignal = undefined;
    }
    signal.throwIfAborted();
    const phases = phasesOf(scenario, config);
    const needsToken = token !== undefined && usesToken(scenario);
    if (needsToken) {
      const check =
        scenario.tokenCheck ?? config.tokenCheck ?? defaultTokenCheck;
      check({token, claims: claimsOf(token), phases});
    }
    const ran = await engine.run({
      pkgDir,
      scenario,
      config,
      phases,
      runVars: vars,
      endpointIds: [...endpoints.keys()],
      baseUrl: target.baseUrl,
      token: needsToken ? token : undefined,
      signal,
    });
    // A signal can cut the load short and leave a partial report.
    signal.throwIfAborted();
    run = {...ran, workload: describeWorkload(phases)};
  } catch (err) {
    failure = err;
  }
  const problems = await finish(scenario, {
    ctx,
    vars,
    cleanup,
    closeSql: database.close,
  });
  if (run === undefined) {
    for (const problem of problems) {
      printError(`${labelOf(scenario)}: ${problem}`);
    }
    throw failure;
  }
  return {...run, problems};
}

/**
 * Runs `after`, then the cleanups, then closes the SQL connections. A step
 * that fails does not stop the next step. Returns what failed, as messages.
 */
async function finish(
  scenario: Scenario,
  {
    ctx,
    vars,
    cleanup,
    closeSql,
  }: {
    ctx: RunContext;
    vars: Vars;
    cleanup: Cleanup;
    closeSql: () => Promise<void>;
  },
): Promise<string[]> {
  const problems: string[] = [];
  try {
    await scenario.after?.(ctx, vars);
  } catch (err) {
    problems.push(`after failed: ${errorMessage(err)}`);
  }
  for (const err of await cleanup.run()) {
    problems.push(`cleanup failed: ${errorMessage(err)}`);
  }
  await closeSql();
  return problems;
}
