// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  BODY_PREVIEW_LENGTH,
  fetchFailure,
  guardedStep,
  HttpError,
  RunError,
} from '../errors';
import type {Api, ApiClientOptions, ApiOptions, HeaderValues} from './types';

/** How long one request of `ctx.api` or of the login can take. */
export const REQUEST_TIMEOUT_MS = 60_000;

type Payload = NonNullable<RequestInit['body']>;

const CONTENT_TYPE = 'content-type';

/** The body parsed, if the response says it is JSON and the text parses. */
function jsonData(res: Response, text: string): unknown {
  if (!res.headers.get(CONTENT_TYPE)?.includes('json')) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

/** Sets each header, or removes it when the value is `undefined`. */
function applyHeaders(target: Headers, values: HeaderValues = {}): void {
  for (const [name, value] of Object.entries(values)) {
    if (value === undefined) target.delete(name);
    else target.set(name, value);
  }
}

/** The path with `query` added. It keeps a query that the path has. */
function withQuery(path: string, query: ApiOptions['query'] = {}): string {
  const params = new URLSearchParams();
  for (const [name, value] of Object.entries(query)) {
    if (value !== undefined) params.append(name, String(value));
  }
  const extra = params.toString();
  if (extra === '') return path;
  return `${path}${path.includes('?') ? '&' : '?'}${extra}`;
}

/**
 * True for a body that `fetch` sends as it is, and for which `fetch` sets
 * the content type itself (when it has one).
 */
function isRawBody(body: unknown): body is Payload {
  return (
    typeof body === 'string' ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body)
  );
}

/**
 * Returns the body as `fetch` sends it. A raw body (see `isRawBody`) goes as
 * it is. Any other body goes as JSON, and gets the JSON content type when the
 * caller set no content type.
 */
function prepareBody(body: unknown, headers: Headers): Payload | undefined {
  if (body === undefined || isRawBody(body)) return body;
  if (!headers.has(CONTENT_TYPE)) {
    headers.set(CONTENT_TYPE, 'application/json');
  }
  return JSON.stringify(body);
}

/** The HTTP client of `ctx.api`. See `Api` for the methods. */
export class ApiClient implements Api {
  private readonly baseUrl: string;
  private readonly options: ApiClientOptions;

  constructor(baseUrl: string, options: ApiClientOptions = {}) {
    this.baseUrl = baseUrl;
    this.options = options;
  }

  get<T = unknown>(path: string, options?: ApiOptions): Promise<T> {
    return this.json<T>('GET', path, undefined, options);
  }

  post<T = unknown>(
    path: string,
    body?: unknown,
    options?: ApiOptions,
  ): Promise<T> {
    return this.json<T>('POST', path, body, options);
  }

  patch<T = unknown>(
    path: string,
    body?: unknown,
    options?: ApiOptions,
  ): Promise<T> {
    return this.json<T>('PATCH', path, body, options);
  }

  put<T = unknown>(
    path: string,
    body?: unknown,
    options?: ApiOptions,
  ): Promise<T> {
    return this.json<T>('PUT', path, body, options);
  }

  delete<T = unknown>(path: string, options?: ApiOptions): Promise<T> {
    return this.json<T>('DELETE', path, undefined, options);
  }

  async raw(
    method: string,
    path: string,
    body?: unknown,
    options?: ApiOptions,
  ): Promise<Response> {
    const res = await this.send(method, path, body, options);
    if (!res.ok) throw await this.errorOf(method, res, path, options);
    return res;
  }

  with({headers}: {headers: HeaderValues}): Api {
    const merged = new Headers();
    applyHeaders(merged, this.defaultHeaders());
    applyHeaders(merged, headers);
    return new ApiClient(this.baseUrl, {
      ...this.options,
      token: undefined,
      headers: Object.fromEntries(merged),
    });
  }

  /** The headers of the client: the token, then `headers`. */
  private defaultHeaders(): HeaderValues {
    const {token, headers} = this.options;
    return {
      ...(token !== undefined && {authorization: `Bearer ${token}`}),
      ...headers,
    };
  }

  private async send(
    method: string,
    path: string,
    body: unknown,
    options: ApiOptions = {},
  ): Promise<Response> {
    if (!path.startsWith('/')) {
      throw new RunError(`${method} ${path}: the path must start with "/"`);
    }
    const headers = new Headers();
    applyHeaders(headers, this.defaultHeaders());
    applyHeaders(headers, options.headers);
    const payload = prepareBody(body, headers);
    const timeoutMs = this.timeoutOf(options);
    const timeout = AbortSignal.timeout(timeoutMs);
    const signal = this.options.signal?.();
    const where = withQuery(path, options.query);
    return guardedStep(
      () =>
        fetch(`${this.baseUrl}${where}`, {
          method,
          headers,
          body: payload,
          signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
        }),
      signal,
      this.failure(method, where, timeoutMs),
    );
  }

  private timeoutOf(options: ApiOptions = {}): number {
    return options.timeoutMs ?? this.options.timeoutMs ?? REQUEST_TIMEOUT_MS;
  }

  /** The builder of the error for a failed network step. */
  private failure(
    method: string,
    where: string,
    timeoutMs: number,
  ): (cause: unknown) => RunError {
    return cause =>
      new RunError(fetchFailure(method, where, cause, timeoutMs), {cause});
  }

  /**
   * Never throws. When the body cannot be read (a timeout or an abort in the
   * read), the caller still sees the status, with an empty body.
   */
  private async errorOf(
    method: string,
    res: Response,
    path: string,
    options?: ApiOptions,
  ): Promise<HttpError> {
    const body = await res.text().catch(() => '');
    return new HttpError({
      method,
      path: withQuery(path, options?.query),
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      body,
      data: jsonData(res, body),
    });
  }

  private async json<T>(
    method: string,
    path: string,
    body: unknown,
    options?: ApiOptions,
  ): Promise<T> {
    const res = await this.raw(method, path, body, options);
    const where = withQuery(path, options?.query);
    const text = await guardedStep(
      () => res.text(),
      this.options.signal?.(),
      this.failure(method, where, this.timeoutOf(options)),
    );
    if (text === '') return undefined as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new RunError(
        `${method} ${where} gave ${res.status} with a body that is not JSON: ${text.slice(0, BODY_PREVIEW_LENGTH)}. To read such a body, use ctx.api.raw().`,
      );
    }
  }
}
