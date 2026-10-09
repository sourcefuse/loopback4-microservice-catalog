// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {ChildProcess} from 'node:child_process';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {readRun} from './measure';
import {ConfigError, RunError} from '../../errors';
import type {Measurement} from '../../report/types';

/**
 * The Artillery CLI. It is a dependency of this library, so it is found from
 * the library only. It is found at the first run and not at import, so that
 * a project with its own engine loads nothing.
 */
export function artilleryBin(): string {
  try {
    // The package exports only its main file, which is dist/lib/index.js.
    return path.join(require.resolve('artillery'), '../../../bin/run');
  } catch {
    throw new ConfigError(
      'artillery is missing from @sourceloop/load-testing: reinstall the package',
    );
  }
}

/** How long a command that was told to stop may take before it gets SIGKILL. */
const STOP_GRACE_MS = 10_000;

/** The commands that run now. */
const running = new Set<ChildProcess>();

/** True after the first command has set the one `exit` listener. */
let exitHandlerSet = false;

/**
 * The process can end while a command runs, for example on a second signal.
 * The command must not go on and load the target then.
 */
function killRunningOnExit(): void {
  for (const child of running) child.kill('SIGKILL');
}

type Exit = {
  code: number | null;
  /** The signal that ended the command, if one did. */
  signal: NodeJS.Signals | null;
};

/**
 * Runs a command, and resolves with its exit when it ends. When `signal`
 * aborts, the command gets SIGTERM, and SIGKILL after `graceMs`. The promise
 * then rejects with the reason of the signal, but only after the command has
 * exited. So the caller can remove the data of the command without a late
 * request of the command making the data again.
 */
export function runCommand(
  command: string,
  args: string[],
  {
    env,
    signal,
    graceMs = STOP_GRACE_MS,
  }: {env: NodeJS.ProcessEnv; signal?: AbortSignal; graceMs?: number},
): Promise<Exit> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {env, stdio: 'inherit'});
    running.add(child);
    if (!exitHandlerSet) {
      exitHandlerSet = true;
      process.on('exit', killRunningOnExit);
    }
    let killTimer: NodeJS.Timeout | undefined;
    const stop = () => {
      child.kill('SIGTERM');
      killTimer = setTimeout(() => child.kill('SIGKILL'), graceMs);
    };
    const settled = () => {
      running.delete(child);
      clearTimeout(killTimer);
      signal?.removeEventListener('abort', stop);
    };
    if (signal?.aborted) stop();
    else signal?.addEventListener('abort', stop, {once: true});
    child.on('error', err => {
      settled();
      reject(err);
    });
    child.on('exit', (code, endedBy) => {
      settled();
      if (signal?.aborted) reject(signal.reason);
      else resolve({code, signal: endedBy});
    });
  });
}

/**
 * `signal` stops Artillery: the run waits until Artillery has exited, and
 * then fails. Artillery runs its workers as threads of its own process, so
 * this stops all the load.
 */
export async function runArtillery(
  scriptPath: string,
  ids: string[],
  env: NodeJS.ProcessEnv,
  signal?: AbortSignal,
): Promise<Measurement> {
  const reportPath = scriptPath.replace(/\.json$/, '.report.json');
  // A run that writes no report must not reuse the previous one.
  fs.rmSync(reportPath, {force: true});
  const args = [artilleryBin(), 'run', '--output', reportPath, scriptPath];
  const exit = await runCommand(process.execPath, args, {
    // Artillery sends anonymous usage data unless this is set.
    env: {...env, ARTILLERY_DISABLE_TELEMETRY: 'true'},
    signal,
  });
  if (exit.code !== 0) {
    const how = exit.signal ?? `code ${exit.code}`;
    throw new RunError(`Artillery stopped with ${how}: ${scriptPath}`);
  }
  return readRun(reportPath, ids);
}
