// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/**
 * Where the CLI writes. Everything it prints goes through `output`, so that a
 * test can replace the two functions and read what the CLI printed.
 */
export const output = {
  out: (text: string): void => {
    process.stdout.write(text);
  },
  err: (text: string): void => {
    process.stderr.write(text);
  },
};

/** Prints a line on the standard output. */
export function print(line = ''): void {
  output.out(`${line}\n`);
}

/** Prints a line on the standard error output. */
export function printError(line: string): void {
  output.err(`${line}\n`);
}

let outputErrorsIgnored = false;

/**
 * The codes of a write error that means the terminal or the pipe is gone.
 * Any other code, such as a full disk, is a real fault.
 */
const GONE_OUTPUT_CODES: readonly string[] = [
  'EPIPE',
  'EIO',
  'ERR_STREAM_DESTROYED',
];

/**
 * Adds an `error` listener to stdout and stderr, once for each process.
 * After SIGHUP the terminal is gone and each write fails. An `error` event
 * with no listener would end the process in the middle of the cleanups that
 * the SIGHUP handling protects. The listener ignores only the codes of
 * `GONE_OUTPUT_CODES`. It throws any other error, as Node does with no
 * listener.
 */
export function ignoreOutputErrors(): void {
  if (outputErrorsIgnored) return;
  outputErrorsIgnored = true;
  process.stdout.on('error', ignoreGoneOutput);
  process.stderr.on('error', ignoreGoneOutput);
}

function ignoreGoneOutput(err: NodeJS.ErrnoException): void {
  if (err.code === undefined || !GONE_OUTPUT_CODES.includes(err.code)) {
    throw err;
  }
}
