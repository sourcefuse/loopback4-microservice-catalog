// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {ConfigError, errorMessage} from '../errors';
import {printError} from '../output';
import {postgresConnector} from './postgres';
import type {Connection, Datasource, Sql, SqlConnector} from './types';

/**
 * The message of the error that `pg` gives when its client timeout
 * (`query_timeout`) fires. The connection stays busy until the server ends
 * the statement.
 */
const CLIENT_TIMEOUT_MESSAGE = 'Query read timeout';

/** The error for a datasource that `config.ts` does not declare. */
function unknownDatasource(name: string, declared: string[]): ConfigError {
  const hint =
    declared.length === 0
      ? 'No datasource is declared: add `datasources` to config.ts'
      : `Declared: ${declared.join(', ')}`;
  return new ConfigError(`ctx.sql: there is no datasource "${name}".`, [hint]);
}

/** The connector of a datasource: one of the three forms. */
function toConnector(ds: Datasource, projectDir: string): SqlConnector {
  if ('type' in ds) {
    return ds.type === 'postgres'
      ? postgresConnector(ds, projectDir)
      : ds.connector;
  }
  return ds;
}

/**
 * Makes `sql`, and `close`, which ends every connection that `sql` opened.
 * `sql` opens one connection for each datasource, when it first needs it.
 */
export function createSql(
  declared: Record<string, Datasource>,
  projectDir: string,
) {
  const datasources: Record<string, SqlConnector> = Object.fromEntries(
    Object.entries(declared).map(([name, ds]) => [
      name,
      toConnector(ds, projectDir),
    ]),
  );
  const connections = new Map<string, Promise<Connection>>();
  /**
   * The last call of each datasource. A `pg` client runs one statement at a
   * time, and it warns when it gets a second one before the first ends. So
   * the calls to one datasource wait for each other.
   */
  const tails = new Map<string, Promise<unknown>>();

  /**
   * The connection of `name`. A connection that failed to open, or that
   * broke later, is dropped, so the next call opens a new one.
   */
  function open(name: string, connector: SqlConnector): Promise<Connection> {
    const known = connections.get(name);
    if (known !== undefined) return known;
    /*
     * A connector can call `onError` before `connect` returns. Then `opened`
     * has no value yet, and `drop` must not read it.
     */
    const made: {opened?: Promise<Connection>} = {};
    const drop = () => {
      const {opened} = made;
      if (opened !== undefined && connections.get(name) === opened) {
        connections.delete(name);
      }
    };
    const opened = (made.opened = connector.connect(err => {
      printError(
        `ctx.sql: the connection to ${name} broke: ${err.message}. The next call opens a new one.`,
      );
      drop();
    }));
    opened.catch(drop);
    connections.set(name, opened);
    return opened;
  }

  const sql: Sql = <Row>(
    name: string,
    text: string,
    params?: unknown[],
  ): Promise<Row[]> => {
    const turn = (tails.get(name) ?? Promise.resolve()).then(() =>
      run<Row>(name, text, params),
    );
    tails.set(
      name,
      turn.catch(() => undefined),
    );
    return turn;
  };

  async function run<Row>(
    name: string,
    text: string,
    params?: unknown[],
  ): Promise<Row[]> {
    const connector = Object.hasOwn(datasources, name)
      ? datasources[name]
      : undefined;
    if (connector === undefined) {
      throw unknownDatasource(name, Object.keys(datasources));
    }
    const pending = open(name, connector);
    const connection = await pending;
    let result: Awaited<ReturnType<Connection['query']>>;
    try {
      result = await connection.query(text, params);
    } catch (err) {
      if (errorMessage(err) === CLIENT_TIMEOUT_MESSAGE) {
        if (connections.get(name) === pending) connections.delete(name);
        // The server may still run the statement, so the CLI does not wait for `end`.
        Promise.resolve()
          .then(() => connection.end())
          .catch(() => undefined);
      }
      throw err;
    }
    const last = Array.isArray(result) ? result.at(-1) : result;
    return (last?.rows ?? []) as Row[];
  }

  async function close(): Promise<void> {
    const all = [...connections.values()];
    connections.clear();
    const ended = await Promise.allSettled(
      all.map(async pending => (await pending).end()),
    );
    for (const result of ended) {
      if (result.status === 'rejected') {
        printError(
          `ctx.sql: closing a connection failed: ${errorMessage(result.reason)}`,
        );
      }
    }
  }

  return {sql, close};
}
