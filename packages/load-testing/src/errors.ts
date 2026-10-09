// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {HttpErrorDetails} from './types';

/** How many characters of a response body go in an error message. */
export const BODY_PREVIEW_LENGTH = 200;

/**
 * Base of every error that the library throws on purpose. The CLI prints only
 * the message of such an error, and the stack of any other error.
 */
export class LoadTestError extends Error {
  override name = 'LoadTestError';
}

/**
 * A `LoadTestError` that lists the problems it found. The message has the
 * header, and each problem on its own indented line.
 */
export abstract class ProblemsError extends LoadTestError {
  /** One line for each problem. Empty when the header says it all. */
  readonly problems: string[];

  constructor(header: string, problems: string[] = [], options?: ErrorOptions) {
    super(
      problems.length > 0 ? `${header}\n  ${problems.join('\n  ')}` : header,
      options,
    );
    this.problems = problems;
  }
}

/** The config, the project layout, the target or a datasource is wrong. */
export class ConfigError extends ProblemsError {
  override name = 'ConfigError';
}

/** A scenario file, a request, a hook or a scenario name is wrong. */
export class ScenarioError extends ProblemsError {
  override name = 'ScenarioError';
}

/** A response with a 4xx or 5xx status. */
export class HttpError extends LoadTestError {
  override name = 'HttpError';
  readonly method: string;
  readonly path: string;
  readonly status: number;
  readonly statusText: string;
  readonly headers: Headers;
  readonly body: string;
  /** The body parsed, when the response said it is JSON, else `undefined`. */
  readonly data: unknown;

  constructor(details: HttpErrorDetails, options?: ErrorOptions) {
    const {method, path, status, body} = details;
    super(
      `${method} ${path} gave ${status}: ${body.slice(0, BODY_PREVIEW_LENGTH)}`,
      options,
    );
    this.method = method;
    this.path = path;
    this.status = status;
    this.statusText = details.statusText;
    this.headers = details.headers;
    this.body = body;
    this.data = details.data;
  }
}

/** The login or the refresh of the token failed. */
export class LoginError extends LoadTestError {
  override name = 'LoginError';
}

/** The run failed: the runner, a report, the baseline file or a check. */
export class RunError extends LoadTestError {
  override name = 'RunError';
}

/** The message of anything that was thrown. */
export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

/** Milliseconds in one second. */
export const MS_PER_SECOND = 1000;

/**
 * The text of the reason of a failure. A `fetch` failure often has a cause
 * with an empty message: an `AggregateError` has the texts in `errors`, and a
 * system error has them in `code`.
 */
function reasonText(reason: unknown): string {
  if (!(reason instanceof Error)) return String(reason);
  if (reason.message !== '') return reason.message;
  const inner =
    reason instanceof AggregateError
      ? [...new Set(reason.errors.map(errorMessage))]
          .filter(message => message !== '')
          .join('; ')
      : '';
  if (inner !== '') return inner;
  const {code} = reason as {code?: unknown};
  return typeof code === 'string' && code !== '' ? code : String(reason);
}

/**
 * The message for a `fetch` that rejected, and was not stopped by the caller.
 * `fetch` hides the real reason in `cause`, so this shows it. `where` is the
 * path or the URL, as in the other messages.
 */
export function fetchFailure(
  method: string,
  where: string,
  err: unknown,
  timeoutMs: number,
): string {
  if (err instanceof Error && err.name === 'TimeoutError') {
    return `${method} ${where} timed out after ${timeoutMs / MS_PER_SECOND} s`;
  }
  const reason = err instanceof Error && err.cause ? err.cause : err;
  return `${method} ${where} failed: ${reasonText(reason)}`;
}

/**
 * Runs one network step: a `fetch` or a read of a body. When the step fails
 * and `signal` (the stop signal of the caller) is aborted, it throws the
 * reason of the signal. Else it throws the error that `fail` builds from the
 * original error. `fail` must keep that error as `cause`.
 */
export async function guardedStep<T>(
  step: () => Promise<T>,
  signal: AbortSignal | undefined,
  fail: (cause: unknown) => Error,
): Promise<T> {
  try {
    return await step();
  } catch (cause) {
    if (signal?.aborted) throw signal.reason;
    throw fail(cause);
  }
}
