// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  databaseUrl,
  pgClientConfig,
  postgresConnector,
} from '../../../context/postgres';
import {ConfigError} from '../../../errors';
import {writeFakePackage} from '../../helpers';

const SERVER = 'postgres://user:secret@localhost:5432';

describe('databaseUrl', () => {
  it('puts the database in the path, and keeps the credentials and options', () => {
    expect(databaseUrl(`${SERVER}?sslmode=require`, 'orders')).to.equal(
      'postgres://user:secret@localhost:5432/orders?sslmode=require',
    );
  });

  it('replaces a database that the server URL already has', () => {
    expect(databaseUrl(`${SERVER}/postgres`, 'orders')).to.equal(
      'postgres://user:secret@localhost:5432/orders',
    );
  });
});

describe('pgClientConfig', () => {
  it('puts the database in the path of the url, and keeps user, password and query', () => {
    expect(
      pgClientConfig({
        url: 'postgres://u:secret@db:5432/postgres?sslmode=require',
        database: 'orders',
      }),
    ).to.deepEqual({
      connectionString: 'postgres://u:secret@db:5432/orders?sslmode=require',
      connectionTimeoutMillis: 10_000,
      /* eslint-disable @typescript-eslint/naming-convention -- `pg` names these keys */
      query_timeout: 60_000,
      /* eslint-enable @typescript-eslint/naming-convention */
    });
  });

  it('uses the url as it is when there is no database', () => {
    expect(pgClientConfig({url: 'postgres://u@db/x'})).to.deepEqual({
      connectionString: 'postgres://u@db/x',
      connectionTimeoutMillis: 10_000,
      /* eslint-disable @typescript-eslint/naming-convention -- `pg` names these keys */
      query_timeout: 60_000,
      /* eslint-enable @typescript-eslint/naming-convention */
    });
  });

  it('maps host, port, user, password and database', () => {
    expect(
      pgClientConfig({
        host: 'db',
        port: 6543,
        user: 'u',
        password: 'p',
        database: 'd',
      }),
    ).to.deepEqual({
      host: 'db',
      port: 6543,
      user: 'u',
      password: 'p',
      database: 'd',
      connectionTimeoutMillis: 10_000,
      /* eslint-disable @typescript-eslint/naming-convention -- `pg` names these keys */
      query_timeout: 60_000,
      /* eslint-enable @typescript-eslint/naming-convention */
    });
  });

  it('waits 10 s for a connection by default, and sets only the client limit of 60 s for a statement', () => {
    const config = pgClientConfig({url: 'postgres://db'});

    expect(config.connectionTimeoutMillis).to.equal(10_000);
    expect(config.query_timeout).to.equal(60_000);
    expect(config).to.not.have.property('statement_timeout');
  });

  it('sets both statement timeouts when statementTimeoutMs is above 0', () => {
    const config = pgClientConfig({
      url: 'postgres://db',
      statementTimeoutMs: 1500,
    });

    expect(config.statement_timeout).to.equal(1500);
    expect(config.query_timeout).to.equal(1500);
  });

  it('sets neither statement timeout when statementTimeoutMs is 0', () => {
    const config = pgClientConfig({
      url: 'postgres://db',
      statementTimeoutMs: 0,
    });

    expect(config).to.not.have.property('statement_timeout');
    expect(config).to.not.have.property('query_timeout');
  });

  it('lets connectionTimeoutMs override the default', () => {
    expect(
      pgClientConfig({url: 'postgres://db', connectionTimeoutMs: 500})
        .connectionTimeoutMillis,
    ).to.equal(500);
  });

  it('maps ssl, the timeouts and the application name', () => {
    expect(
      pgClientConfig({
        url: 'postgres://db',
        ssl: {rejectUnauthorized: false},
        connectionTimeoutMs: 1000,
        statementTimeoutMs: 2000,
        applicationName: 'load',
      }),
    ).to.deepEqual({
      connectionString: 'postgres://db',
      ssl: {rejectUnauthorized: false},
      connectionTimeoutMillis: 1000,
      /* eslint-disable @typescript-eslint/naming-convention -- `pg` names these keys */
      statement_timeout: 2000,
      query_timeout: 2000,
      application_name: 'load',
      /* eslint-enable @typescript-eslint/naming-convention */
    });
  });

  it('throws a ConfigError when there is neither url nor host', () => {
    expect(() => pgClientConfig({database: 'd'})).to.throw(ConfigError);
    expect(() => pgClientConfig({})).to.throw(/set `url`.*or `host`/);
  });
});

describe('postgresConnector', () => {
  let dir: string;
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-'));
  });
  afterEach(() => fs.rmSync(dir, {recursive: true}));

  /** A fake `pg` in the project. It records into `globalThis.pgCalls`. */
  function installFakePg() {
    writeFakePackage(
      dir,
      'pg',
      `
      const calls = (globalThis.pgCalls = []);
      class Client {
        constructor(config) { calls.push(['new', config]); }
        on(event, listener) { calls.push(['on', event, listener]); }
        async connect() { calls.push(['connect']); }
        async query(text, params) { calls.push(['query', text, params]); return {rows: []}; }
        async end() { calls.push(['end']); }
      }
      module.exports = {Client};
      `,
    );
    return () => (globalThis as unknown as {pgCalls: unknown[][]}).pgCalls;
  }

  afterEach(() => {
    delete (globalThis as unknown as {pgCalls?: unknown}).pgCalls;
  });

  it('opens nothing and reads no env when it is made', () => {
    const connector = postgresConnector(
      {url: process.env.NOT_SET_FOR_TEST},
      dir,
    );

    expect(connector.connect).to.be.a.Function();
  });

  it('gives a ConfigError at connect when there is no target', async () => {
    installFakePg();

    await expect(
      postgresConnector({}, dir).connect(() => undefined),
    ).to.be.rejectedWith(ConfigError);
  });

  it('gives the not-installed error at the first connect when the project has no pg', async () => {
    const connector = postgresConnector({url: SERVER}, dir);

    await expect(connector.connect(() => undefined)).to.be.rejectedWith(
      ConfigError,
      {
        message: `The "pg" package is not installed in ${dir}. Install it in the project: npm install --save-dev pg`,
      },
    );
  });

  it('creates the client with the config, registers the error listener, connects, and returns the client', async () => {
    const calls = installFakePg();
    const errors: Error[] = [];

    const connection = await postgresConnector({url: SERVER}, dir).connect(
      err => errors.push(err),
    );
    const listener = calls().find(call => call[0] === 'on')?.[2] as (
      err: Error,
    ) => void;
    listener(new Error('idle drop'));
    await connection.query('SELECT $1', [1]);
    await connection.end();

    expect(errors.map(err => err.message)).to.deepEqual(['idle drop']);
    expect(calls().map(call => call[0])).to.deepEqual([
      'new',
      'on',
      'connect',
      'query',
      'end',
    ]);
    expect(calls()[0][1]).to.deepEqual({
      connectionString: SERVER,
      connectionTimeoutMillis: 10_000,
      /* eslint-disable @typescript-eslint/naming-convention -- `pg` names these keys */
      query_timeout: 60_000,
      /* eslint-enable @typescript-eslint/naming-convention */
    });
    expect(calls()[1][1]).to.equal('error');
    expect(calls()[3].slice(1)).to.deepEqual(['SELECT $1', [1]]);
  });
});
