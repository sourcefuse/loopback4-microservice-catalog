// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/** Options of one request of `ctx.api`. */
export type ApiOptions = {
  /**
   * Headers for this request. They replace a header of the client that has
   * the same name. A value of `undefined` removes that header, for example
   * `{authorization: undefined}` sends the request with no token.
   */
  headers?: Record<string, string | undefined>;
  /**
   * Query parameters. Each value goes through `String()`: it is never
   * JSON-encoded. A value of `undefined` is skipped. They are added to a
   * query that the path has already.
   */
  query?: Record<string, string | number | boolean | undefined>;
  /** Milliseconds. A request that takes longer stops. Default 60 s. */
  timeoutMs?: number;
};

/**
 * HTTP client for `before` and `after`. It adds the base URL to each path. A
 * path must start with "/", or the call throws a `RunError`.
 *
 * The body of a request:
 * - `undefined`: no body.
 * - `FormData`, `URLSearchParams`, `Blob`, `ArrayBuffer`, a typed array or a
 *   string: sent as it is. The library sets no content type for these, so
 *   `fetch` sets one that fits (a `FormData` needs its boundary), or you set
 *   one in `options.headers`.
 * - Anything else: sent as JSON with `content-type: application/json`,
 *   unless you set a content type.
 *
 * `get`, `post`, `put`, `patch` and `delete` give the body of the response
 * parsed as JSON. A response with no body gives `undefined`, so ask for
 * `<void>` there. A body that is not JSON throws a `RunError`: use `raw()`
 * for it. A 4xx or 5xx status throws an `HttpError`.
 */
export type Api = {
  get<T = unknown>(path: string, options?: ApiOptions): Promise<T>;
  post<T = unknown>(
    path: string,
    body?: unknown,
    options?: ApiOptions,
  ): Promise<T>;
  patch<T = unknown>(
    path: string,
    body?: unknown,
    options?: ApiOptions,
  ): Promise<T>;
  put<T = unknown>(
    path: string,
    body?: unknown,
    options?: ApiOptions,
  ): Promise<T>;
  delete<T = unknown>(path: string, options?: ApiOptions): Promise<T>;
  /**
   * Sends a request and gives the `Response`, so that you can read a Blob, a
   * stream or a header. A 4xx or 5xx status throws an `HttpError`.
   */
  raw(
    method: string,
    path: string,
    body?: unknown,
    options?: ApiOptions,
  ): Promise<Response>;
  /**
   * Gives a new client with the same base URL, timeout and signal, that adds
   * `headers` to each request. Use it for a token:
   * `ctx.api.with({headers: {authorization: `Bearer ${token}`}})`.
   */
  with(options: {headers: Record<string, string | undefined>}): Api;
};

export type HeaderValues = Record<string, string | undefined>;

/** What the constructor of `ApiClient` takes. */
export type ApiClientOptions = {
  /** Sent as `Authorization: Bearer <token>` with each request. */
  token?: string;
  /** Sent with each request. A value of `undefined` sends nothing. */
  headers?: HeaderValues;
  /** Milliseconds. A request that takes longer stops. Default 60 s. */
  timeoutMs?: number;
  /**
   * Gives the signal that stops a request: the requests that are open, and
   * new ones. It is asked at the start of each request, so the owner of the
   * client can stop using a signal later.
   */
  signal?: () => AbortSignal | undefined;
};
