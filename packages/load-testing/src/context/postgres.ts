// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {ConfigError} from '../errors';
import {loadDriver} from './driver';
import type {
  Connection,
  PgClientConfig,
  PostgresOptions,
  SqlConnector,
} from './types';

/** Milliseconds to wait for a connection when the options set no limit. */
const DEFAULT_CONNECTION_TIMEOUT_MS = 10_000;

/**
 * Milliseconds that the client waits for a statement when the options set no
 * limit. A stuck statement must not hold the CLI for ever. This limit is on
 * the client only: the server gets no `statement_timeout` and keeps the
 * statement running. The CLI drops the connection after this limit.
 */
const DEFAULT_STATEMENT_TIMEOUT_MS = 60_000;

/** `serverUrl` with the path of `database`. Credentials and options stay. */
export function databaseUrl(serverUrl: string, database: string): string {
  const url = new URL(serverUrl);
  url.pathname = `/${database}`;
  return url.toString();
}

/** The `pg` client config for `options`. It throws when there is no target. */
export function pgClientConfig(options: PostgresOptions): PgClientConfig {
  const {url, host, database} = options;
  if (url === undefined && host === undefined) {
    throw new ConfigError('datasource of type postgres:', [
      'set `url`, for example postgres://user:secret@localhost:5432, or `host`',
    ]);
  }
  const {statementTimeoutMs} = options;
  const clientTimeoutMs = statementTimeoutMs ?? DEFAULT_STATEMENT_TIMEOUT_MS;
  const config: PgClientConfig = {
    ssl: options.ssl,
    // A database that does not answer must not hold the CLI until the OS gives up.
    connectionTimeoutMillis:
      options.connectionTimeoutMs ?? DEFAULT_CONNECTION_TIMEOUT_MS,
    /* eslint-disable @typescript-eslint/naming-convention -- `pg` names these keys */
    /* A proxy such as PgBouncer can refuse this startup parameter, so it is opt-in. */
    statement_timeout:
      statementTimeoutMs !== undefined && statementTimeoutMs > 0
        ? statementTimeoutMs
        : undefined,
    query_timeout: clientTimeoutMs > 0 ? clientTimeoutMs : undefined,
    application_name: options.applicationName,
    /* eslint-enable @typescript-eslint/naming-convention */
  };
  if (url === undefined) {
    Object.assign(config, {
      host,
      port: options.port,
      user: options.user,
      password: options.password,
      database,
    });
  } else {
    config.connectionString =
      database === undefined ? url : databaseUrl(url, database);
  }
  return Object.fromEntries(
    Object.entries(config).filter(([, value]) => value !== undefined),
  );
}

/** The part of the `pg` package that this file uses. */
type PgModule = {
  Client: new (config: PgClientConfig) => Connection & {
    on(event: 'error', listener: (err: Error) => void): unknown;
    connect(): Promise<unknown>;
  };
};

/**
 * The connector of a Postgres datasource. It opens nothing and reads no
 * environment variable here: the connection opens at the first `ctx.sql`
 * call of the datasource. It loads `pg` from `projectDir` then.
 */
export function postgresConnector(
  options: PostgresOptions,
  projectDir: string,
): SqlConnector {
  return {
    async connect(onError): Promise<Connection> {
      const pg = loadDriver<PgModule>('pg', projectDir);
      const client = new pg.Client(pgClientConfig(options));
      /* An idle drop emits `error`. Without a listener Node stops the process. */
      client.on('error', onError);
      await client.connect();
      return client;
    },
  };
}
