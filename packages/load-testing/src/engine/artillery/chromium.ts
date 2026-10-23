// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {execFile} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {promisify} from 'node:util';
import {ConfigError} from '../../errors';

const execFileAsync = promisify(execFile);

/** How long Chromium may take to start before the check fails. */
const START_TIMEOUT_MS = 60_000;

/**
 * The variable that carries the launch options to the child. They can hold
 * a secret, such as a proxy password, and the arguments of a process show in
 * `ps`. The environment does not.
 */
const LAUNCH_OPTIONS_ENV = 'LOAD_TESTS_LAUNCH_OPTIONS';

/**
 * Starts and closes headless Chromium with the Playwright that Artillery
 * uses, in a child process with `env`, the environment of Artillery. It
 * starts Chromium with `launchOptions`, the ones that the Artillery script
 * of the scenario gets, so a custom `executablePath` is checked and not the
 * default build. A check of the files is not enough, because headless mode
 * uses its own build of Chromium. Throws a `ConfigError` with the install
 * command for that version of Playwright when Chromium does not start.
 * `signal` stops the check. `timeoutMs` is a parameter only so that a test
 * does not wait for the full time.
 */
export async function checkChromium(
  env: NodeJS.ProcessEnv,
  launchOptions: Record<string, unknown> = {},
  signal?: AbortSignal,
  timeoutMs = START_TIMEOUT_MS,
): Promise<void> {
  const dir = playwrightDir();
  const {version} = JSON.parse(
    fs.readFileSync(path.join(dir, 'package.json'), 'utf8'),
  ) as {version: string};
  // The child deletes the variable before the launch, so Chromium does not
  // inherit a secret of the options. It writes only the first line of the
  // error, without the stack.
  const start = String.raw`const loadTestsOptions = JSON.parse(process.env.${LAUNCH_OPTIONS_ENV});
delete process.env.${LAUNCH_OPTIONS_ENV};
require(${JSON.stringify(dir)}).chromium.launch(loadTestsOptions).then(
  browser => browser.close(),
  err => { process.stderr.write(String(err.message).split('\n')[0]); process.exit(1); },
);`;
  try {
    await execFileAsync(process.execPath, ['-e', start], {
      env: {...env, [LAUNCH_OPTIONS_ENV]: JSON.stringify(launchOptions)},
      signal,
      timeout: timeoutMs,
      // Playwright catches SIGTERM and waits for a Chromium that does not answer.
      killSignal: 'SIGKILL',
    });
  } catch (err) {
    if (signal?.aborted) throw signal.reason;
    const {stderr, killed} = err as {stderr?: string; killed?: boolean};
    const detail = killed
      ? `Chromium did not start in ${timeoutMs / 1000} s.`
      : stderr;
    throw new ConfigError(
      `Chromium does not start with Playwright ${version}, the version that Artillery uses. Install it with \`npx playwright@${version} install chromium\`. On a new Linux machine, add --with-deps.`,
      detail ? [detail] : [],
    );
  }
}

/** The folder of the Playwright that the Playwright engine of Artillery loads. */
function playwrightDir(): string {
  return path.dirname(
    require.resolve('playwright/package.json', {
      paths: [path.dirname(require.resolve('artillery'))],
    }),
  );
}
