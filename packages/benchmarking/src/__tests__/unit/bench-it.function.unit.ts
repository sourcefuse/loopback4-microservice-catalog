// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {BenchmarkConfigError, ReporterError} from '../../errors';
import {benchIt, resultLine} from '../../functions/bench-it.function';
import type {PerformanceMetrics, RunFile} from '../../types';

/**
 * `benchIt` registers a real Mocha test, so we declare some inside a nested
 * suite and drive their callbacks by hand. The registered tests never run on
 * their own: the `benchmark:` prefix is what `npm test` filters out.
 */
const hookCalls: string[] = [];
let declared: Mocha.Test;
let withOptions: Mocha.Test;
describe('orders', () => {
  describe('writes', () => {
    declared = benchIt('sample operation', async () => {
      await Promise.resolve();
    });
    withOptions = benchIt(
      'hooked operation',
      async () => {
        hookCalls.push('run');
      },
      {
        iterations: 3,
        beforeAll: () => {
          hookCalls.push('beforeAll');
        },
        beforeEach: () => {
          hookCalls.push('beforeEach');
        },
        afterEach: () => {
          hookCalls.push('afterEach');
        },
        afterAll: () => {
          hookCalls.push('afterAll');
        },
      },
    );
  });
});

const SUITE_KEY = 'orders > writes';

/** Mocha context stub, enough for the two calls the callback makes. */
function givenContext(test = declared) {
  const timeouts: number[] = [];
  return {timeouts, ctx: {timeout: (ms: number) => timeouts.push(ms), test}};
}

async function run(test = declared): Promise<number[]> {
  const {ctx, timeouts} = givenContext(test);
  const fn = test.fn as (this: object) => Promise<void>;
  await fn.call(ctx);
  return timeouts;
}

describe('benchIt', () => {
  const saved = {...process.env};
  let workDir: string;
  let reportFile: string;

  const readReport = () =>
    JSON.parse(readFileSync(reportFile, 'utf-8')) as RunFile;

  beforeEach(() => {
    workDir = mkdtempSync(join(tmpdir(), 'benchmarking-bench-it-'));
    reportFile = join(workDir, 'report.json');
    process.env.BENCH_REPORT_FILE = reportFile;
    process.env.BENCH_ITERATIONS = '2';
    process.env.BENCH_MIN_TIME = '0';
    process.env.BENCH_WARMUP_TIME = '0';
    delete process.env.CI;
    hookCalls.length = 0;
  });

  afterEach(() => {
    rmSync(workDir, {recursive: true, force: true});
    process.env = {...saved};
  });

  it('prefixes the title so a normal test run skips it', () => {
    expect(declared.title).to.equal('benchmark: sample operation');
  });

  it('sets the Mocha time limit from the iterations and the minimum time', async () => {
    process.env.BENCH_MIN_TIME = '10';

    const timeouts = await run();

    // 5000 base, 2000 for each of the 2 iterations and the warm-up, and 300
    // for each ms of minimum time.
    expect(timeouts).to.eql([14000]);
  });

  it('appends the throughput of each run under the suite title path', async () => {
    await run();
    await run();

    const history = readReport()[SUITE_KEY]['sample operation'].history;
    expect(history).to.have.length(2);
    expect(history[0]).to.be.above(0);
  });

  it('keeps only the history in the run file', async () => {
    await run();

    expect(Object.keys(readReport()[SUITE_KEY]['sample operation'])).to.eql([
      'history',
    ]);
  });

  it('runs the hooks around each iteration', async () => {
    process.env.BENCH_WARMUP = 'false';

    await run(withOptions);

    expect(hookCalls).to.eql([
      'beforeAll',
      ...Array(3).fill(['beforeEach', 'run', 'afterEach']).flat(),
      'afterAll',
    ]);
  });

  it('runs all hooks in the warm-up phase too', async () => {
    await run(withOptions);

    const warmup = ['beforeAll', 'beforeEach', 'run', 'afterEach', 'afterAll'];
    expect(hookCalls.slice(0, warmup.length)).to.eql(warmup);
    expect(hookCalls.filter(call => call === 'beforeAll')).to.have.length(2);
    expect(hookCalls.filter(call => call === 'afterAll')).to.have.length(2);
  });

  it('lets one benchmark set its own iteration count', async () => {
    process.env.BENCH_WARMUP = 'false';

    const timeouts = await run(withOptions);

    expect(hookCalls.filter(call => call === 'run')).to.have.length(3);
    // 5000 base and 2000 for each of the 3 iterations and the warm-up
    expect(timeouts).to.eql([13000]);
  });

  it('rejects an iteration count below 1', () => {
    expect(() => benchIt('bad', async () => {}, {iterations: 0})).to.throw(
      BenchmarkConfigError,
    );
  });

  it('stops instead of replacing an unreadable run file', async () => {
    writeFileSync(reportFile, '{not json');

    await expect(run()).to.be.rejectedWith(ReporterError);
    expect(readFileSync(reportFile, 'utf-8')).to.equal('{not json');
  });
});

describe('resultLine', () => {
  it('reports throughput and latency', () => {
    const metrics: PerformanceMetrics = {
      throughput: {mean: 1234.5678, min: 1000, max: 1500},
      latency: {mean: 0.81, min: 0.7, max: 0.9},
      samples: 12,
    };

    expect(resultLine('creates an order', metrics)).to.equal(
      '  creates an order: 1234.57 ops/s, 0.810 ms latency over 12 samples',
    );
  });
});
