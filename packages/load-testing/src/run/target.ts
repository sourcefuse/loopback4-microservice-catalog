// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {REQUEST_TIMEOUT_MS} from '../context/api';
import {
  BODY_PREVIEW_LENGTH,
  ConfigError,
  fetchFailure,
  guardedStep,
  LoginError,
  MS_PER_SECOND,
} from '../errors';
import type {Login, Session, Target} from './types';

const BASE_URL_ENV = 'LOAD_TESTS_BASE_URL';
const AUTH_URL_ENV = 'LOAD_TESTS_AUTH_URL';
/** The first HTTP status of a redirect. */
const FIRST_REDIRECT_STATUS = 300;
/** The last HTTP status of a redirect. */
const LAST_REDIRECT_STATUS = 399;

/** Needed only when `LOAD_TESTS_USERNAME` is set. */
const LOGIN_ENV = [
  'LOAD_TESTS_PASSWORD',
  'LOAD_TESTS_CLIENT_ID',
  'LOAD_TESTS_CLIENT_SECRET',
] as const;

/**
 * Reads the target from the environment. `LOAD_TESTS_BASE_URL` is always
 * required. When `LOAD_TESTS_USERNAME` is set, the other login variables are
 * required too. When it is not set, the run has no login.
 */
export function readTarget(env: NodeJS.ProcessEnv): Target {
  const hasLogin = !!env.LOAD_TESTS_USERNAME;
  const missing = [BASE_URL_ENV, ...(hasLogin ? LOGIN_ENV : [])].filter(
    name => !env[name],
  );
  if (missing.length > 0) throw new ConfigError(`Set ${missing.join(', ')}`);
  // The check above makes every required value a non-empty string.
  const get = (name: string) => env[name] as string;
  const baseUrl = urlOf(BASE_URL_ENV, get(BASE_URL_ENV));
  return {
    baseUrl,
    // An empty variable counts as not set, as CI often leaves one empty.
    authUrl: env.LOAD_TESTS_AUTH_URL
      ? urlOf(AUTH_URL_ENV, env.LOAD_TESTS_AUTH_URL)
      : baseUrl,
    ...(hasLogin && {
      login: {
        username: get('LOAD_TESTS_USERNAME'),
        password: get('LOAD_TESTS_PASSWORD'),
        clientId: get('LOAD_TESTS_CLIENT_ID'),
        clientSecret: get('LOAD_TESTS_CLIENT_SECRET'),
      },
    }),
  };
}

/**
 * Logs in with the two-step ARC login. `signal` stops the requests.
 */
export async function login(
  target: Target & {login: Login},
  signal?: AbortSignal,
): Promise<Session> {
  const {username, password, clientId, clientSecret} = target.login;
  const {code} = await postJson(
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
  );
  if (!code) throw new LoginError('POST /auth/login gave no code');
  return toSession(
    'POST /auth/token',
    await postJson(`${target.authUrl}/auth/token`, {code, clientId}, {signal}),
  );
}

/**
 * Seconds. `refresh` keeps a token that is younger than this. Two refreshes
 * in one second give the same token, and the auth service then revokes the
 * token that the second refresh gives.
 */
const MIN_REFRESH_AGE_SECONDS = 60;

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
  const issued = issuedAt(session.accessToken);
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
  );
}

/**
 * The `iat` claim of a JWT, in seconds. Undefined when the token is not a JWT
 * or has no `iat`: the caller then refreshes.
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

function toSession(call: string, body: Record<string, unknown>): Session {
  const {accessToken, refreshToken} = body;
  if (typeof accessToken !== 'string' || accessToken === '') {
    throw new LoginError(`${call} gave no accessToken`);
  }
  if (typeof refreshToken !== 'string' || refreshToken === '') {
    throw new LoginError(`${call} gave no refreshToken`);
  }
  return {accessToken, refreshToken};
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
 * the password. The URL also goes to messages and to `baseline.json`. The
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
