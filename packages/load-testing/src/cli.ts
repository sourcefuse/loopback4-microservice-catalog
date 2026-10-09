// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import path from 'node:path';
import {parseArgs} from 'node:util';
import {Cancellation} from './run/cancel';
import {readBaseline} from './report/compare';
import {baselineUrlNote, saveBaselineIfAsked} from './run/baseline';
import {withFreshToken} from './run/session';
import {resolveThresholds} from './project/config';
import {execute, runScenarios} from './run/execute';
import {prepare} from './run/prepare';
import {errorMessage, LoadTestError} from './errors';
import {judgeRun} from './report/report';
import {consoleReporter} from './report/console';
import type {Reporter, RunResult} from './report/types';
import {SPEC_FILE} from './project/spec';
import {labelOf} from './scenario/label';
import {artillery} from './engine/artillery';
import {refresh} from './run/target';
import {ignoreOutputErrors, print, printError} from './output';

const USAGE = `Usage:
  load-testing run <package-dir>       Run the scenarios, compare with the baseline

Environment:
  LOAD_TESTS_BASE_URL       Application under test (required)
  LOAD_TESTS_AUTH_URL       Serves /auth/login and /auth/token (default: LOAD_TESTS_BASE_URL)
  LOAD_TESTS_USERNAME       Set it to log in. Then these are required too:
  LOAD_TESTS_PASSWORD, LOAD_TESTS_CLIENT_ID, LOAD_TESTS_CLIENT_SECRET
                            Required when LOAD_TESTS_USERNAME is set
  LOAD_TESTS_UPDATE_BASELINE=1  Add this run to the baseline history
  LOAD_TESTS_FORCE_BASELINE=1   Add it even when the run failed`;

async function run(
  pkgDir: string,
  cancel: Cancellation,
  env: NodeJS.ProcessEnv,
): Promise<number> {
  const prepared = await prepare(pkgDir, env, cancel.signal);
  const {target, config, skipped, endpointCoverage, heavyEndpoints} = prepared;
  const baseline = readBaseline(pkgDir);
  const note = baselineUrlNote(baseline, target.baseUrl);
  if (note !== undefined) print(note);
  const engine = config.engine ?? artillery();
  const outcome = await runScenarios(
    prepared.scenarios,
    withFreshToken(
      target,
      prepared.session,
      refresh,
      (loaded, token) =>
        execute(loaded, {
          pkgDir,
          config,
          engine,
          target,
          token,
          signal: cancel.signal,
        }),
      cancel.signal,
    ),
    {
      baseline,
      vuserLimits: resolveThresholds(config.thresholds?.default ?? {}),
      signal: cancel.signal,
    },
  );
  const result = judgeRun(outcome.scenarios, {
    skipped: skipped.map(({scenario}) => labelOf(scenario)),
    coverage: {
      covered: endpointCoverage.covered,
      total: endpointCoverage.total,
      specFile: SPEC_FILE,
    },
    heavyApis: {
      endpoints: heavyEndpoints,
      max: config.maxHeavyApis ?? 0,
    },
    hasBaseline: baseline !== undefined,
    stopped: outcome.stopped !== undefined,
  });
  const reportersOk = await runReporters(
    config.reporters ?? [consoleReporter()],
    result,
  );
  if (outcome.stopped !== undefined) throw outcome.stopped;
  const passed = result.passed && reportersOk;
  saveBaselineIfAsked(
    {
      pkgDir,
      baseUrl: target.baseUrl,
      baseline,
      outcome,
      passed,
    },
    env,
    {print, printError},
  );
  return passed ? 0 : 1;
}

/**
 * Calls the reporters one after another. A reporter that fails does not
 * stop the next ones. Returns false when one failed.
 */
async function runReporters(
  reporters: Reporter[],
  result: RunResult,
): Promise<boolean> {
  let ok = true;
  for (const reporter of reporters) {
    try {
      await reporter.onRunEnd(result);
    } catch (err) {
      printError(`reporter ${reporter.name} failed: ${errorMessage(err)}`);
      ok = false;
    }
  }
  return ok;
}

/**
 * Runs the command line and returns the exit code. It never rejects. It reads
 * the target, the login and the flags of the CLI from `env`, so a test passes
 * its own. The default engine does not read `env`. It builds the environment
 * of Artillery from `process.env`, and passes only the names of its allow-list
 * (see `artilleryEnv`), the base URL and the token of the run.
 */
export async function main(
  args: string[],
  env: NodeJS.ProcessEnv = process.env,
): Promise<number> {
  ignoreOutputErrors();
  try {
    return await dispatch(args, env);
  } catch (err) {
    if (isUsageError(err)) {
      // A wrong option is a mistake of the user, not a bug: no stack.
      printError(`${err.message}\n\n${USAGE}`);
    } else {
      printError(err instanceof LoadTestError ? err.message : errorStack(err));
    }
    return 1;
  }
}

/** True for the error that `parseArgs` throws for a bad command line. */
function isUsageError(err: unknown): err is Error {
  return (
    err instanceof Error &&
    String((err as NodeJS.ErrnoException).code).startsWith('ERR_PARSE_ARGS_')
  );
}

/** The stack of an error that the library did not throw, so a bug is easy to find. */
function errorStack(err: unknown): string {
  return err instanceof Error ? (err.stack ?? String(err)) : String(err);
}

async function dispatch(
  args: string[],
  env: NodeJS.ProcessEnv,
): Promise<number> {
  const {values, positionals} = parseArgs({
    args,
    allowPositionals: true,
    options: {help: {type: 'boolean', short: 'h'}},
  });
  if (values.help) {
    print(USAGE);
    return 0;
  }
  const [command, pkg] = positionals;
  if (command !== 'run' || !pkg) {
    printError(USAGE);
    return 1;
  }
  const cancel = new Cancellation();
  try {
    return await run(path.resolve(pkg), cancel, env);
  } catch (err) {
    if (cancel.exitCode === undefined) throw err;
    printError('\nCancelled.');
    return cancel.exitCode;
  } finally {
    cancel.dispose();
  }
}
