// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import path from 'node:path';
import {parseArgs} from 'node:util';
import {Cancellation} from './run/cancel';
import {withFreshPool} from './run/session';
import {resolveThresholds} from './project/config';
import {execute, runScenarios} from './run/execute';
import {coverageOf, loadPackage, prepare} from './run/prepare';
import {clearSelection, printSelection, writeSelection} from './changes/report';
import {describeThrown, errorMessage, LoadTestError} from './errors';
import {judgeRun} from './report/report';
import {consoleReporter} from './report/console';
import type {Reporter, RunResult} from './report/types';
import {labelOf} from './scenario/label';
import {phaseSeconds, phasesOf} from './scenario/workload';
import {artillery} from './engine/artillery';
import {refresh} from './run/target';
import {ignoreOutputErrors, print, printError} from './output';

const USAGE = `Usage:
  load-testing run <package-dir>       Run the scenarios
  load-testing run <package-dir> --since <ref>
                                       Run only the scenarios that the changes since <ref> affect.
                                       A scenario says what it covers with the option covers.
  load-testing run <package-dir> --verbose
                                       Print the full output of Artillery. By default the output is
                                       short: the first failed checks of a scenario, and the rest
                                       in .out/<scenario>.log.

Environment:
  LOAD_TESTS_BASE_URL       API under test (required for load.it scenarios, the login, and
                            browser scenarios with before or after)
  LOAD_TESTS_UI_URL         Web app under test (required for load.browser scenarios)
  LOAD_TESTS_AUTH_SERVICE_URL
                            Serves /auth/login and /auth/token (default: LOAD_TESTS_BASE_URL)
  <variables of apis>       The URL of each backend that \`apis\` in config.ts names, for
                            ctx.apis.<name> (required when the run needs the API)
  LOAD_TESTS_USERS_FILE     Path of a JSON file with the pool of test users:
                            [{"username": "...", "password": "..."}]. Set it to log in.
  LOAD_TESTS_CLIENT_ID, LOAD_TESTS_CLIENT_SECRET
                            Required when LOAD_TESTS_USERS_FILE is set
  LOAD_TESTS_VERBOSE        Any value but 0 or false: the same as --verbose
  LOAD_TESTS_GIT            Absolute path of the git program for --since (default: git of PATH)`;

async function run(
  pkgDir: string,
  cancel: Cancellation,
  env: NodeJS.ProcessEnv,
  since?: string,
  verbose = false,
): Promise<number> {
  clearSelection(pkgDir);
  const found = loadPackage(pkgDir, env, since);
  if (found.selection) {
    printSelection(found.selection);
    writeSelection(pkgDir, found.selection);
    // Nothing to run: no login, no hook, no Artillery.
    if (found.selection.nothingSelected) return 0;
  }
  const prepared = await prepare(pkgDir, env, cancel.signal, found);
  const {target, config, skipped, endpointCoverage, heavyEndpoints} = prepared;
  const engine = config.engine ?? artillery();
  const outcome = await runScenarios(
    prepared.scenarios,
    withFreshPool(
      target,
      prepared.sessions,
      refresh,
      (loaded, pool) =>
        execute(loaded, {
          pkgDir,
          config,
          engine,
          target,
          pool,
          signal: cancel.signal,
          verbose,
        }),
      ({scenario}) => phaseSeconds(phasesOf(scenario, config)),
      cancel.signal,
    ),
    {
      vuserLimits: resolveThresholds(config.thresholds?.default ?? {}),
      signal: cancel.signal,
    },
  );
  const result = judgeRun(outcome.scenarios, {
    skipped: skipped.map(({scenario}) => labelOf(scenario)),
    coverage: coverageOf(endpointCoverage),
    heavyApis: {
      endpoints: heavyEndpoints,
      max: config.maxHeavyApis ?? 0,
    },
    stopped: outcome.stopped !== undefined,
  });
  const judged = result.passed;
  const reportersOk = await runReporters(
    config.reporters ?? [consoleReporter()],
    result,
  );
  if (outcome.stopped !== undefined) throw outcome.stopped;
  return judged && reportersOk ? 0 : 1;
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

/** A command line that the CLI does not accept, for example an extra argument. */
class UsageError extends Error {}

/** True for a bad command line: an error of `parseArgs`, or a `UsageError`. */
function isUsageError(err: unknown): err is Error {
  return (
    err instanceof UsageError ||
    (err instanceof Error &&
      String((err as NodeJS.ErrnoException).code).startsWith('ERR_PARSE_ARGS_'))
  );
}

/** The stack of an error that the library did not throw, so a bug is easy to find. */
function errorStack(err: unknown): string {
  return err instanceof Error
    ? (err.stack ?? err.message)
    : describeThrown(err);
}

async function dispatch(
  args: string[],
  env: NodeJS.ProcessEnv,
): Promise<number> {
  const {values, positionals} = parseArgs({
    args,
    allowPositionals: true,
    options: {
      help: {type: 'boolean', short: 'h'},
      since: {type: 'string'},
      verbose: {type: 'boolean'},
    },
  });
  if (values.help) {
    print(USAGE);
    return 0;
  }
  const [command, pkg, ...extra] = positionals;
  // `parseArgs` cannot say this: it must accept the command and the package.
  if (extra.length > 0) {
    throw new UsageError(`Unexpected argument '${extra[0]}'`);
  }
  if (values.since !== undefined && command !== 'run') {
    throw new UsageError('--since works only with the run command');
  }
  if (command !== 'run' || !pkg) {
    printError(USAGE);
    return 1;
  }
  const cancel = new Cancellation();
  try {
    const verbose =
      values.verbose === true ||
      !['', '0', 'false'].includes(
        (env.LOAD_TESTS_VERBOSE ?? '').trim().toLowerCase(),
      );
    return await run(path.resolve(pkg), cancel, env, values.since, verbose);
  } catch (err) {
    if (cancel.exitCode === undefined) throw err;
    printError('\nCancelled.');
    return cancel.exitCode;
  } finally {
    cancel.dispose();
  }
}
