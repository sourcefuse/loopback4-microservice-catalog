// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {ConfigError} from '../../../errors';
import {createSql} from '../../../context/sql';
import type {SqlConnector} from '../../../context/types';

/** A database that records what it gets. `answer` is what a query gives. */
function fakeDatabase(answer: unknown = {rows: [{n: 1}]}) {
  const opened: string[] = [];
  const queries: Array<{name: string; text: string; params?: unknown[]}> = [];
  let ended = 0;
  /** A connector that records its `name` when it opens. */
  const connector = (name: string): SqlConnector => ({
    connect: async () => {
      opened.push(name);
      return {
        query: async (text, params) => {
          queries.push({name, text, params});
          return answer as {rows: unknown[]};
        },
        end: async () => {
          ended++;
        },
      };
    },
  });
  return {connector, opened, queries, ended: () => ended};
}

describe('createSql', () => {
  it('sends the text and the params, and returns the rows', async () => {
    const db = fakeDatabase({rows: [{id: 'a'}, {id: 'b'}]});
    const {sql} = createSql({orders: db.connector('orders')}, '/p');

    const rows = await sql(
      'orders',
      'SELECT id FROM main.orders WHERE x = $1',
      [7],
    );

    expect(rows).to.deepEqual([{id: 'a'}, {id: 'b'}]);
    expect(db.queries).to.deepEqual([
      {
        name: 'orders',
        text: 'SELECT id FROM main.orders WHERE x = $1',
        params: [7],
      },
    ]);
  });

  it('opens one connection for each datasource, and uses it again', async () => {
    const db = fakeDatabase();
    const {sql} = createSql(
      {
        orders: db.connector('orders'),
        inventory: db.connector('inventory'),
      },
      '/p',
    );

    await Promise.all([
      sql('orders', 'SELECT 1'),
      sql('orders', 'SELECT 2'),
      sql('inventory', 'SELECT 3'),
    ]);

    expect(db.opened.sort()).to.deepEqual(['inventory', 'orders']);
  });

  it('runs the calls to one datasource one after another', async () => {
    let running = 0;
    let overlap = 0;
    const connector: SqlConnector = {
      connect: async () => ({
        query: async () => {
          running++;
          overlap = Math.max(overlap, running);
          await new Promise(resolve => setTimeout(resolve, 10));
          running--;
          return {rows: [{n: 1}]};
        },
        end: async () => undefined,
      }),
    };
    const {sql} = createSql({orders: connector}, '/p');

    await Promise.all([
      sql('orders', 'SELECT 1'),
      sql('orders', 'SELECT 2'),
      sql('orders', 'SELECT 3'),
    ]);

    expect(overlap).to.equal(1);
  });

  it('goes on with the next call after a call failed', async () => {
    let calls = 0;
    const connector: SqlConnector = {
      connect: async () => ({
        query: async () => {
          calls++;
          if (calls === 1) throw new Error('syntax error');
          return {rows: [{n: calls}]};
        },
        end: async () => undefined,
      }),
    };
    const {sql} = createSql({orders: connector}, '/p');

    const [first, second] = await Promise.allSettled([
      sql('orders', 'BAD'),
      sql('orders', 'SELECT 1'),
    ]);

    expect(first.status).to.equal('rejected');
    expect(second).to.deepEqual({status: 'fulfilled', value: [{n: 2}]});
  });

  it('gives the rows of the last statement when there are several', async () => {
    const db = fakeDatabase([{rows: [{n: 1}]}, {rows: [{n: 2}]}]);
    const {sql} = createSql({orders: db.connector('orders')}, '/p');

    expect(await sql('orders', 'DELETE 1; SELECT 2')).to.deepEqual([{n: 2}]);
  });

  it('lists the declared names for a datasource that is not declared', async () => {
    const db = fakeDatabase();
    const {sql} = createSql(
      {
        orders: db.connector('orders'),
        audit: db.connector('audit'),
      },
      '/p',
    );

    const err = await sql('nope', 'SELECT 1').catch((e: unknown) => e);

    expect(err).to.be.instanceOf(ConfigError);
    expect((err as Error).message).to.match(/"nope"/);
    expect((err as Error).message).to.match(/Declared: orders, audit/);
  });

  it('does not take a name of Object.prototype as a datasource', async () => {
    const {sql} = createSql({}, '/p');

    await expect(sql('toString', 'SELECT 1')).to.be.rejectedWith(ConfigError);
  });

  it('tells to add datasources to config.ts when none is declared', async () => {
    const {sql} = createSql({}, '/p');

    await expect(sql('orders', 'SELECT 1')).to.be.rejectedWith(
      /add `datasources` to config\.ts/,
    );
  });

  it('ends every connection on close, also when one failed to open', async () => {
    const db = fakeDatabase();
    const {sql, close} = createSql(
      {
        orders: db.connector('orders'),
        broken: {connect: () => Promise.reject(new Error('refused'))},
      },
      '/p',
    );
    await sql('orders', 'SELECT 1');
    await sql('broken', 'SELECT 1').catch(() => undefined);

    await close();

    expect(db.ended()).to.equal(1);
  });

  it('opens a new connection after the old one broke', async () => {
    const db = fakeDatabase();
    const breaks: Array<(err: Error) => void> = [];
    const connector: SqlConnector = {
      connect: onError => {
        breaks.push(onError);
        return db.connector('orders').connect(onError);
      },
    };
    const {sql} = createSql({orders: connector}, '/p');
    await sql('orders', 'SELECT 1');

    breaks[0](new Error('terminated by the server'));
    await sql('orders', 'SELECT 2');

    expect(db.opened).to.have.length(2);
  });

  describe('a query that fails', () => {
    /** A connector whose first query rejects with `failure`. */
    function failingOnce(failure: Error) {
      const ends: number[] = [];
      let connects = 0;
      let queries = 0;
      const connector: SqlConnector = {
        connect: async () => {
          const id = ++connects;
          return {
            query: async () => {
              if (++queries === 1) throw failure;
              return {rows: [{id}]};
            },
            end: async () => {
              ends.push(id);
              if (id === 1 && failure.message === 'Query read timeout') {
                throw new Error('end failed');
              }
            },
          };
        },
      };
      return {connector, ends, connects: () => connects};
    }

    it('drops the connection after the client timeout, and ends it', async () => {
      const db = failingOnce(new Error('Query read timeout'));
      const {sql} = createSql({orders: db.connector}, '/p');

      await expect(sql('orders', 'SELECT 1')).to.be.rejectedWith(
        'Query read timeout',
      );
      const rows = await sql('orders', 'SELECT 2');

      expect(db.connects()).to.equal(2);
      expect(db.ends).to.deepEqual([1]);
      expect(rows).to.deepEqual([{id: 2}]);
    });

    it('keeps the connection after an ordinary error', async () => {
      const db = failingOnce(new Error('syntax error at or near "SELEC"'));
      const {sql} = createSql({orders: db.connector}, '/p');

      await expect(sql('orders', 'SELEC 1')).to.be.rejectedWith(/syntax error/);
      await sql('orders', 'SELECT 2');

      expect(db.connects()).to.equal(1);
      expect(db.ends).to.deepEqual([]);
    });
  });

  it('tries to connect again after a connection failed to open', async () => {
    const db = fakeDatabase();
    let tries = 0;
    const connector: SqlConnector = {
      connect: onError =>
        ++tries === 1
          ? Promise.reject(new Error('refused'))
          : db.connector('orders').connect(onError),
    };
    const {sql} = createSql({orders: connector}, '/p');

    await expect(sql('orders', 'SELECT 1')).to.be.rejectedWith('refused');
    expect(await sql('orders', 'SELECT 1')).to.deepEqual([{n: 1}]);
  });

  it('prints each connection that fails to end', async () => {
    const lines: string[] = [];
    const {output} = await import('../../../output');
    const saved = output.err;
    output.err = (text: string) => {
      lines.push(text);
    };
    const connector: SqlConnector = {
      connect: async () => ({
        query: async () => ({rows: []}),
        end: () => Promise.reject(new Error('socket hung up')),
      }),
    };
    const {sql, close} = createSql({orders: connector}, '/p');
    await sql('orders', 'SELECT 1');

    try {
      await close();
    } finally {
      output.err = saved;
    }

    expect(lines.join('')).to.match(
      /closing a connection failed: socket hung up/,
    );
  });

  it('does not throw when the connector calls onError before connect returns', async () => {
    const db = fakeDatabase();
    const connector: SqlConnector = {
      connect: onError => {
        onError(new Error('at once'));
        return db.connector('orders').connect(onError);
      },
    };
    const {sql} = createSql({orders: connector}, '/p');

    expect(await sql('orders', 'SELECT 1')).to.deepEqual([{n: 1}]);
  });

  describe('forms of a datasource', () => {
    it('uses a bare connector and a custom one', async () => {
      const db = fakeDatabase();
      const {sql} = createSql(
        {
          bare: db.connector('bare'),
          custom: {type: 'custom', connector: db.connector('custom')},
        },
        '/p',
      );

      await sql('bare', 'SELECT 1');
      await sql('custom', 'SELECT 1');

      expect(db.opened).to.deepEqual(['bare', 'custom']);
    });

    it('maps type postgres to the pg of the project, at the first call', async () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-'));
      const {sql} = createSql(
        {orders: {type: 'postgres', url: 'postgres://u@db/x'}},
        dir,
      );

      try {
        await expect(sql('orders', 'SELECT 1')).to.be.rejectedWith(
          ConfigError,
          {
            message: /The "pg" package is not installed/,
          },
        );
      } finally {
        fs.rmSync(dir, {recursive: true});
      }
    });
  });
});
