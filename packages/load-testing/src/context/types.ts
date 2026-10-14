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

/**
 * Runs one SQL statement on a datasource that `config.ts` declares in
 * `datasources`. `params` fill `$1`, `$2`, ... in `text`. A call with several
 * statements and no `params` gives the rows of the last one.
 */
export type Sql = <Row = Record<string, unknown>>(
  datasource: string,
  text: string,
  params?: unknown[],
) => Promise<Row[]>;

/**
 * How a datasource opens ONE connection. Use it for any database other than
 * Postgres: put it in `datasources` of `config.ts` as it is, or as
 * `{type: 'custom', connector}`.
 *
 * To write one, return an object with `connect`. The library calls it
 * once for each datasource, when a test first uses it, and keeps the
 * connection. Do not open anything when you create the connector: `config.ts`
 * is loaded for each command.
 */
export type SqlConnector = {
  /**
   * Opens the connection. Call `onError` with the error of a connection that
   * breaks later (for example an idle drop): the library then drops the
   * connection and opens a new one at the next call. Without a listener for
   * such an error, Node can stop the process.
   */
  connect(onError: (err: Error) => void): Promise<Connection>;
};

/** One open connection of a datasource. */
export type Connection = {
  /**
   * Runs `text`. A text with several statements can give one result for each
   * statement: the library takes the rows of the last.
   */
  query(text: string, params?: unknown[]): Promise<QueryResult | QueryResult[]>;
  /** Closes the connection. */
  end(): Promise<void>;
};

/** The result of one statement. */
export type QueryResult = {rows: unknown[]};

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

/** Options of a Postgres datasource. Set `url`, or `host`. */
export type PostgresOptions = {
  /**
   * Connection URL, for example `postgres://user:secret@localhost:5432`. Its
   * user, password and query (for example `?sslmode=require`) stay.
   */
  url?: string;
  /** Used when there is no `url`. */
  host?: string;
  /** Used when there is no `url`. Default 5432. */
  port?: number;
  /** Used when there is no `url`. */
  user?: string;
  /** Used when there is no `url`. */
  password?: string;
  /**
   * The database. With `url`, it replaces the path of the URL. So one server
   * URL can serve many datasources.
   */
  database?: string;
  /** `true` for TLS with the default settings, or the options of `tls`. */
  ssl?: boolean | Record<string, unknown>;
  /**
   * Milliseconds. How long to wait for the connection to open. The default
   * is 10 000 ms.
   */
  connectionTimeoutMs?: number;
  /**
   * Milliseconds. The client waits at most this long for a statement. The
   * default is 60 000 ms. By default only the client stops waiting: the
   * server keeps the statement running, unless you set this option to a
   * number above 0. Then the server cancels the statement. After the client
   * timeout the CLI drops the connection, and the next call opens a new one.
   * A proxy that refuses the `statement_timeout` startup parameter (such as
   * PgBouncer) needs the option unset. The value 0 turns both limits off.
   */
  statementTimeoutMs?: number;
  /** Shown in `pg_stat_activity`. */
  applicationName?: string;
};

/**
 * The part of the `pg` client config that this file sets. It is local, so
 * that the types of `pg` stay out of the exports.
 */
export type PgClientConfig = {
  connectionString?: string;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  ssl?: boolean | Record<string, unknown>;
  connectionTimeoutMillis?: number;
  /* eslint-disable @typescript-eslint/naming-convention -- `pg` names these keys */
  statement_timeout?: number;
  query_timeout?: number;
  application_name?: string;
  /* eslint-enable @typescript-eslint/naming-convention */
};

/**
 * A Postgres datasource: `{type: 'postgres', url: process.env.DB_URL}`.
 * Set `url`, or `host`. The library connects with the `pg` package of your
 * project, so install it there: `npm install --save-dev pg`.
 */
export type PostgresDatasource = {type: 'postgres'} & PostgresOptions;

/**
 * A datasource that you connect yourself, for any database other than
 * Postgres: `{type: 'custom', connector}`. The `connector` opens ONE
 * connection, see `SqlConnector`.
 */
export type CustomDatasource = {type: 'custom'; connector: SqlConnector};

/**
 * One entry of `datasources` in `config.ts`. Use `{type: 'postgres', ...}`
 * for Postgres (the project must install `pg`: `npm install --save-dev pg`).
 * Use `{type: 'custom', connector}`, or the bare `connector`, for any other
 * database.
 */
export type Datasource = PostgresDatasource | CustomDatasource | SqlConnector;
