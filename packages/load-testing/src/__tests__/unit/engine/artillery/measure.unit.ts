// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {expect} from '@loopback/testlab';
import {readRun} from '../../../../engine/artillery/measure';
import {HOOK_ERROR_PREFIX} from '../../../../engine/artillery/processor';
import {RunError} from '../../../../errors';
import report from '../../../fixtures/report.json';

describe('readRun', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-'));
  after(() => fs.rmSync(dir, {recursive: true}));

  /** Writes `content` as the report file of Artillery, and reads the run from it. */
  const readOf = (content: unknown, ids: string[] = []) => {
    const file = path.join(dir, 'report.json');
    fs.writeFileSync(file, JSON.stringify(content));
    return readRun(file, ids);
  };
  const aggregate = (extra: object) => ({
    aggregate: {counters: {}, summaries: {}, ...extra},
  });

  /*
   * `report` was recorded from Artillery 2.0.34 against a stub server:
   * /missing answers 404, /boom drops the connection.
   */
  it('counts responses and errors per endpoint and reads p95', () => {
    const ids = ['GET /items', 'GET /items/{id}', 'GET /missing', 'GET /boom'];

    expect([...readOf(report, ids).endpoints]).to.deepEqual([
      ['GET /items', {count: 10, failed: 0, p95: 2}],
      ['GET /items/{id}', {count: 10, failed: 0, p95: 1}],
      ['GET /missing', {count: 10, failed: 10, p95: 0}],
      ['GET /boom', {count: 10, failed: 10, p95: undefined}],
    ]);
  });

  it('gives zero requests for an endpoint that never ran', () => {
    const run = readOf(report, ['GET /never']);

    expect(run.endpoints.get('GET /never')).to.deepEqual({
      count: 0,
      failed: 0,
      p95: undefined,
    });
  });

  it('reads the vusers that started, that completed and that failed', () => {
    // In the recorded run, every vuser failed and none finished.
    expect(readOf(report).vusers).to.deepEqual({
      started: 10,
      completed: 0,
      failed: 10,
    });
  });

  it('counts a template error of a capture or of beforeEach as a hook error', () => {
    const counters = {
      [`errors.${HOOK_ERROR_PREFIX}capture: x`]: 2,
      [`errors.${HOOK_ERROR_PREFIX}beforeEach: x`]: 1,
    };

    expect(readOf(aggregate({counters})).hookErrors).to.equal(3);
  });

  it('counts the errors of hooks apart from the errors of endpoints', () => {
    const counters = {[`errors.${HOOK_ERROR_PREFIX}beforeEach: boom`]: 3};

    expect(readOf(aggregate({counters})).hookErrors).to.equal(3);
    expect(readOf(report).hookErrors).to.equal(0);
  });

  it('is the time from the first to the last count', () => {
    const times = {firstCounterAt: 1000, lastCounterAt: 61500};

    expect(readOf(aggregate(times)).seconds).to.equal(60.5);
  });

  it('is 0 seconds when the run counted nothing', () => {
    expect(readOf(report).seconds).to.equal(0);
  });

  it('names the file when Artillery wrote no result', () => {
    expect(() => readOf({})).to.throw(/report.json has no aggregate/);
  });

  it('reads a run in which no response came (real Artillery 2.0.34, closed port)', () => {
    /*
     * Recorded: 1 vuser against http://127.0.0.1:9. The report has `summaries`
     * (empty) and `counters`, so `readRun` needs no default for either.
     */
    const run = readOf(
      {
        aggregate: {
          counters: {
            'vusers.created_by_name.0': 1,
            'vusers.created': 1,
            'http.requests': 1,
            'plugins.metrics-by-endpoint.GET /x.errors.ECONNREFUSED': 1,
            'errors.ECONNREFUSED': 1,
            'vusers.failed': 1,
          },
          summaries: {},
        },
      },
      ['GET /x'],
    );

    expect(run.endpoints.get('GET /x')).to.deepEqual({
      count: 1,
      failed: 1,
      p95: undefined,
    });
    expect(run.vusers).to.deepEqual({started: 1, completed: 0, failed: 1});
  });

  describe('a report that Artillery did not write well', () => {
    it('names the report when the file is missing', () => {
      const file = path.join(dir, 'none.json');

      expect(() => readRun(file, [])).to.throw(RunError, {
        message: `Artillery wrote no valid report: ${file}`,
      });
    });

    it('names the report when the JSON is cut short', () => {
      const file = path.join(dir, 'cut.json');
      fs.writeFileSync(file, '{"aggregate": {"counters": {');

      expect(() => readRun(file, [])).to.throw(RunError, {
        message: `Artillery wrote no valid report: ${file}`,
      });
    });

    for (const text of ['null', '5', '[]', '"x"']) {
      it(`names the report when the JSON is ${text}, not an object`, () => {
        const file = path.join(dir, 'odd.json');
        fs.writeFileSync(file, text);

        expect(() => readRun(file, [])).to.throw(RunError, {
          message: `Artillery wrote no valid report: ${file}`,
        });
      });
    }

    it('keeps the reason as the cause', () => {
      const file = path.join(dir, 'none.json');

      try {
        readRun(file, []);
        throw new Error('readRun did not throw');
      } catch (err) {
        expect((err as RunError).cause).to.be.instanceOf(Error);
      }
    });

    it('counts no requests when the aggregate has no counters and no summaries', () => {
      const run = readOf({aggregate: {}}, ['GET /a']);

      expect(run.endpoints.get('GET /a')).to.deepEqual({
        count: 0,
        failed: 0,
        p95: undefined,
      });
      expect(run.hookErrors).to.equal(0);
      expect(run.vusers).to.deepEqual({started: 0, completed: 0, failed: 0});
    });
  });
});
