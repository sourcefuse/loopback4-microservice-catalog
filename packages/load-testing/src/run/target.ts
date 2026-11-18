// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {setTimeout as sleep} from 'node:timers/promises';
import {REQUEST_TIMEOUT_MS} from '../context/api';
import {
  BODY_PREVIEW_LENGTH,
  ConfigError,
  errorMessage,
  fetchFailure,
  guardedStep,
  LoginError,
  MS_PER_SECOND,
} from '../errors';
import {BASE_URL_ENV, UI_URL_ENV} from '../project/layout';
import {print} from '../output';
import {readUsers, USERS_FILE_ENV} from './users';
import type {Login, PoolUser, Session, Target, TargetNeeds} from './types';

const AUTH_URL_ENV = 'LOAD_TESTS_AUTH_SERVICE_URL';
/** The first HTTP status of a redirect. */
const FIRST_REDIRECT_STATUS = 300;
/** The last HTTP status of a redirect. */
const LAST_REDIRECT_STATUS = 399;

/** Needed only when `LOAD_TESTS_USERS_FILE` is set. */
const LOGIN_ENV = ['LOAD_TESTS_CLIENT_ID', 'LOAD_TESTS_CLIENT_SECRET'] as const;

/**
 * Reads the target from the environment. `needs` says which URLs the
 * scenarios of the run need.
 * `LOAD_TESTS_BASE_URL` is required for the API, and `LOAD_TESTS_UI_URL` for
 * the web app. When `LOAD_TESTS_USERS_FILE` is set, the other login variables
 * and the API URL are required too. When it is not set, the run has no login.
 * `apis` maps a name to the variable that holds the URL of another backend.
 * The run needs these variables when it needs the API.
 */
export function readTarget(
  env: NodeJS.ProcessEnv,
  needs: TargetNeeds,
  apis: Record<string, string> = {},
): Target {
  checkOldAuthUrl(env);
  const hasLogin = !!env[USERS_FILE_ENV];
  const needsApi = needs.api || hasLogin;
  const missing = [
    ...new Set([
      ...(needsApi ? [BASE_URL_ENV, ...Object.values(apis)] : []),
      ...(needs.ui ? [UI_URL_ENV] : []),
      ...(hasLogin ? LOGIN_ENV : []),
    ]),
  ].filter(name => !env[name]);
  if (missing.length > 0) throw new ConfigError(`Set ${missing.join(', ')}`);
  // The check above makes every required value a non-empty string.
  const get = (name: string) => env[name] as string;
  const ui = needs.ui ? {uiUrl: urlOf(UI_URL_ENV, get(UI_URL_ENV))} : {};
  if (!needsApi) return ui;
  const baseUrl = urlOf(BASE_URL_ENV, get(BASE_URL_ENV));
  return {
    ...ui,
    baseUrl,
    // An empty variable counts as not set, as CI often leaves one empty.
    authUrl: env.LOAD_TESTS_AUTH_SERVICE_URL
      ? urlOf(AUTH_URL_ENV, env.LOAD_TESTS_AUTH_SERVICE_URL)
      : baseUrl,
    apiUrls: Object.fromEntries(
      Object.entries(apis).map(([name, variable]) => [
        name,
        urlOf(variable, get(variable)),
      ]),
    ),
    ...(hasLogin && {
      login: {
        users: readUsers(get(USERS_FILE_ENV)),
        clientId: get('LOAD_TESTS_CLIENT_ID'),
        clientSecret: get('LOAD_TESTS_CLIENT_SECRET'),
      },
    }),
  };
}

/** Stops a run that sets only the old name of `LOAD_TESTS_AUTH_SERVICE_URL`. */
function checkOldAuthUrl(env: NodeJS.ProcessEnv): void {
  if (env.LOAD_TESTS_AUTH_URL && !env.LOAD_TESTS_AUTH_SERVICE_URL) {
    throw new ConfigError(
      'LOAD_TESTS_AUTH_URL is now LOAD_TESTS_AUTH_SERVICE_URL. Rename the variable.',
    );
  }
}

/** Sends one call of the login. `loginAll` passes a version that waits on a 429. */
type Send = (
  call: () => Promise<Record<string, string | undefined>>,
) => Promise<Record<string, string | undefined>>;

/**
 * Logs in with the two-step ARC login. `signal` stops the requests. `send`
 * wraps each of the two calls, so that a retry repeats only the call that
 * failed.
 */
export async function login(
  target: Target & {login: Login},
  {username, password}: PoolUser,
  signal?: AbortSignal,
  send: Send = call => call(),
): Promise<Session> {
  const {clientId, clientSecret} = target.login;
  const {code} = await send(() =>
    postJson(
      `${target.authUrl}/auth/login`,
      {
        username,
        password,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: clientId,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_secret: clientSecret,
      },
      {signal},
    ),
  );
  if (!code) throw new LoginError('POST /auth/login gave no code');
  return toSession(
    'POST /auth/token',
    await send(() =>
      postJson(`${target.authUrl}/auth/token`, {code, clientId}, {signal}),
    ),
    username,
  );
}

/**
 * Logs in every user of the pool, one after another. The server limits the
 * login by the address of the client, so a 429 is not an error: the wait of
 * `Retry-After` comes first, and then the call that got it is sent again. All
 * waits of the run together are limited by `waitSeconds`. A failure names the
 * user. `wait` is the sleep, which a test can replace.
 */
export async function loginAll(
  target: Target & {login: Login},
  waitSeconds: number,
  signal?: AbortSignal,
  wait: (ms: number, signal?: AbortSignal) => Promise<unknown> = (ms, s) =>
    sleep(ms, undefined, {signal: s}),
): Promise<Session[]> {
  let left = waitSeconds;
  const sessions: Session[] = [];
  for (const user of target.login.users) {
    const send: Send = async call => {
      for (;;) {
        try {
          return await call();
        } catch (err) {
          if (!(err instanceof RateLimited) || signal?.aborted) throw err;
          if (err.waitSeconds > left) {
            throw new LoginError(
              `the server asks to wait ${err.waitSeconds} s, which passes loginWaitSeconds (${waitSeconds} s)`,
              {cause: err},
            );
          }
          left -= err.waitSeconds;
          print(
            `Login of ${user.username} gave 429, waiting ${err.waitSeconds} s`,
          );
          await guardedStep(
            () => wait(err.waitSeconds * MS_PER_SECOND, signal),
            signal,
            cause => new LoginError('the wait was cut short', {cause}),
          );
        }
      }
    };
    try {
      sessions.push(await login(target, user, signal, send));
      print(
        `Logged in ${user.username} (${sessions.length}/${target.login.users.length})`,
      );
    } catch (err) {
      if (signal?.aborted) throw err;
      throw new LoginError(
        `login of user ${user.username} failed: ${errorMessage(err)}`,
        {cause: err},
      );
    }
  }
  return sessions;
}

/**
 * Seconds. `refresh` keeps a token that is younger than this. Two refreshes
 * in one second give the same token, and the auth service then revokes the
 * token that the second refresh gives.
 */
const MIN_REFRESH_AGE_SECONDS = 60;

/**
 * When this process got each session, in seconds. `refresh` uses it for a
 * token that has no `iat` claim, such as an opaque token, so that the minimum
 * age holds for every token.
 */
const obtainedAt = new WeakMap<Session, number>();

/**
 * Gets a new session, unless the access token is less than a minute old. An
 * access token lives 900 s and a run can take longer, so the CLI calls this
 * before each scenario and does not log in again. `signal` stops the request.
 */
export async function refresh(
  target: Target,
  session: Session,
  signal?: AbortSignal,
): Promise<Session> {
  const issued = issuedAt(session.accessToken) ?? obtainedAt.get(session);
  if (
    issued !== undefined &&
    Date.now() / MS_PER_SECOND - issued < MIN_REFRESH_AGE_SECONDS
  ) {
    return session;
  }
  return toSession(
    'POST /auth/token-refresh',
    await postJson(
      `${target.authUrl}/auth/token-refresh`,
      {refreshToken: session.refreshToken},
      {bearer: session.accessToken, signal},
    ),
    session.username,
  );
}

/**
 * The `iat` claim of a JWT, in seconds. Undefined when the token is not a JWT
 * or has no `iat`: the caller then uses the time that it got the session.
 */
function issuedAt(token: string): number | undefined {
  const {iat} = claimsOf(token);
  return typeof iat === 'number' ? iat : undefined;
}

/**
 * Seconds until the access token expires, from its `exp` claim. Undefined
 * when the token is not a JWT or has no `exp`.
 */
export function secondsLeft(token: string): number | undefined {
  const {exp} = claimsOf(token);
  return typeof exp === 'number' ? exp - Date.now() / MS_PER_SECOND : undefined;
}

/** The claims of a JWT. Empty when the token is not a JWT. */
export function claimsOf(token: string): Record<string, unknown> {
  try {
    const claims: unknown = JSON.parse(
      Buffer.from(token.split('.')[1] ?? '', 'base64url').toString(),
    );
    return typeof claims === 'object' && claims !== null
      ? (claims as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function toSession(
  call: string,
  body: Record<string, unknown>,
  username: string,
): Session {
  const {accessToken, refreshToken} = body;
  if (typeof accessToken !== 'string' || accessToken === '') {
    throw new LoginError(`${call} gave no accessToken`);
  }
  if (typeof refreshToken !== 'string' || refreshToken === '') {
    throw new LoginError(`${call} gave no refreshToken`);
  }
  const session = {username, accessToken, refreshToken};
  obtainedAt.set(session, Date.now() / MS_PER_SECOND);
  return session;
}

/** Names the origin of the location, never the whole location: it can hold a secret. */
function redirectMessage(url: string, res: Response): string {
  const location = res.headers.get('location');
  let to = '';
  if (location) {
    try {
      to = ` to ${new URL(location, url).origin}`;
    } catch {
      // A location that is not a URL has no origin to show.
    }
  }
  return (
    `POST ${url} gave ${res.status}, a redirect${to}. ` +
    'The login does not follow redirects, so the password goes only to the URL that we set. ' +
    `Set ${AUTH_URL_ENV} to the final URL.`
  );
}

const TOO_MANY_REQUESTS = 429;
/** How long to wait on a 429 that has no usable `Retry-After`. One minute is the usual window of a rate limit. */
const DEFAULT_WAIT_SECONDS = 60;
/** The shortest wait. A `Retry-After` of 0 would else make a loop that never ends and never uses the wait limit. */
const MIN_WAIT_SECONDS = 1;

/** The server limits the calls of this client. `waitSeconds` is how long it asks to wait. */
class RateLimited extends LoginError {
  constructor(
    message: string,
    readonly waitSeconds: number,
  ) {
    super(message);
  }
}

/** The `Retry-After` header in seconds. A date or a missing header gives the default. */
function waitSecondsOf(res: Response): number {
  const header = res.headers.get('retry-after')?.trim();
  const seconds = header ? Number(header) : Number.NaN;
  return Number.isFinite(seconds) && seconds >= 0
    ? Math.max(MIN_WAIT_SECONDS, Math.ceil(seconds))
    : DEFAULT_WAIT_SECONDS;
}

type PostOptions = {bearer?: string; signal?: AbortSignal};

async function postJson(
  url: string,
  body: object,
  {bearer, signal}: PostOptions = {},
): Promise<Record<string, string | undefined>> {
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const guard = <T>(step: () => Promise<T>): Promise<T> =>
    guardedStep(
      step,
      signal,
      cause =>
        new LoginError(fetchFailure('POST', url, cause, REQUEST_TIMEOUT_MS), {
          cause,
        }),
    );
  const res = await guard(() =>
    fetch(url, {
      method: 'POST',
      redirect: 'manual',
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
      headers: {
        'content-type': 'application/json',
        ...(bearer && {authorization: `Bearer ${bearer}`}),
      },
      body: JSON.stringify(body),
    }),
  );
  if (
    res.status >= FIRST_REDIRECT_STATUS &&
    res.status <= LAST_REDIRECT_STATUS
  ) {
    throw new LoginError(redirectMessage(url, res));
  }
  const text = await guard(() => res.text());
  if (res.status === TOO_MANY_REQUESTS) {
    throw new RateLimited(
      `POST ${url} gave 429: ${text.slice(0, BODY_PREVIEW_LENGTH)}`,
      waitSecondsOf(res),
    );
  }
  if (!res.ok) {
    throw new LoginError(
      `POST ${url} gave ${res.status}: ${text.slice(0, BODY_PREVIEW_LENGTH)}`,
    );
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (cause) {
    throw new LoginError(
      `POST ${url} gave ${res.status} with a body that is not JSON`,
      {cause},
    );
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new LoginError(
      `POST ${url} gave ${res.status} with a body that is not a JSON object`,
    );
  }
  return parsed as Record<string, string | undefined>;
}

const HTTP_SCHEMES = new Set(['http:', 'https:']);

/**
 * The URL without a slash at the end. A value that is not an http or https
 * URL is a ConfigError. The scheme is checked too, because `localhost:3000`
 * is a valid URL with the scheme `localhost:`. A URL with a user or a
 * password is a ConfigError too: `fetch` refuses it, and its message shows
 * the password. The URL also goes to messages. The
 * messages here do not show the value, because a URL can hold a password.
 */
function urlOf(name: string, value: string): string {
  const url = parse(value);
  if (!url || !HTTP_SCHEMES.has(url.protocol)) {
    throw new ConfigError(
      `${name} is not an http or https URL, for example http://localhost:3000`,
    );
  }
  if (url.username !== '' || url.password !== '') {
    throw new ConfigError(`${name} must not hold a user or a password`);
  }
  return trimSlash(value);
}

/** The parsed URL. Undefined when the value is not a URL. */
function parse(value: string): URL | undefined {
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}

function trimSlash(url: string): string {
  let trimmed = url;
  while (trimmed.endsWith('/')) trimmed = trimmed.slice(0, -1);
  return trimmed;
}
