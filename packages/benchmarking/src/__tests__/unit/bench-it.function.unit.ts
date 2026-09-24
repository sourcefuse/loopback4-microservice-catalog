// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {PerformanceRegressionError} from '../../errors';
import {benchIt, resultLine} from '../../functions/bench-it.function';
import type {BaselineData, PerformanceMetrics} from '../../types';

/**
 * `benchIt` registers a real Mocha test, so we declare one inside a nested
 * suite and drive its callback by hand. The registered test never runs on its
 * own: the `benchmark:` prefix is what `npm test` filters out.
 */
let declared: Mocha.Test;
describe('orders', () => {
  describe('writes', () => {
    declared = benchIt('sample operation', async () => {
      await Promise.resolve();
    });
  });
});

const SUITE_KEY = 'orders > writes';

/** Mocha context stub, enough for the two calls the callback makes. */
function givenContext() {
  const timeouts: number[] = [];
  return {
    timeouts,
    ctx: {timeout: (ms: number) => timeouts.push(ms), test: declared},
  };
}

async function run(context: object): Promise<void> {
  const fn = declared.fn as (this: object) => Promise<void>;
  await fn.call(context);
}

function givenMetrics(): PerformanceMetrics {
  return {
    throughput: {mean: 1234.5678, min: 1000, max: 1500},
    latency: {mean: 0.81, min: 0.7, max: 0.9},
    samples: 12,
  };
}

describe('benchIt', () => {
  const saved = {...process.env};
  let workDir: string;
  let reportFile: string;

  const readReport = () =>
    JSON.parse(readFileSync(reportFile, 'utf-8')) as BaselineData;

  function seedUnreachableBaseline() {
    writeFileSync(
      reportFile,
      JSON.stringify({
        [SUITE_KEY]: {
          'sample operation': {
            history: [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
          },
        },
      }),
    );
  }

  beforeEach(() => {
    workDir = mkdtempSync(join(tmpdir(), 'benchmarking-bench-it-'));
    reportFile = join(workDir, 'report.json');
    process.env.BENCH_REPORT_FILE = reportFile;
    process.env.BENCH_UPDATE_BASELINE = '1';
    process.env.BENCH_ITERATIONS = '2';
    process.env.BENCH_MIN_SAMPLES = '1';
    delete process.env.BENCH_FORCE_BASELINE;
    delete process.env.CI;
  });

  afterEach(() => {
    rmSync(workDir, {recursive: true, force: true});
    process.env = {...saved};
  });

  it('prefixes the title so a normal test run skips it', () => {
    expect(declared.title).to.equal('benchmark: sample operation');
  });

  it('allows more time than the Mocha default', async () => {
    const {ctx, timeouts} = givenContext();

    await run(ctx);

    // 5000 base, plus 2000 for each of the 2 iterations and the warmup.
    expect(timeouts).to.eql([11000]);
  });

  it('files the history under the joined suite title path', async () => {
    const {ctx} = givenContext();

    await run(ctx);

    expect(readReport()[SUITE_KEY]['sample operation'].history).to.have.length(
      1,
    );
  });

  it('records a sample and passes while the baseline is building', async () => {
    // A drop this far below the seeded baseline would fail the gate, but the
    // window holds 2 of the 5 samples the gate waits for.
    seedUnreachableBaseline();
    process.env.BENCH_MIN_SAMPLES = '5';
    const {ctx} = givenContext();

    await run(ctx);

    expect(readReport()[SUITE_KEY]['sample operation'].history).to.have.length(
      3,
    );
  });

  it('fails the test when throughput drops past the threshold', async () => {
    seedUnreachableBaseline();
    const {ctx} = givenContext();

    await expect(run(ctx)).to.be.rejectedWith(PerformanceRegressionError);
  });

  it('holds the baseline when a run regresses', async () => {
    seedUnreachableBaseline();
    const {ctx} = givenContext();

    await expect(run(ctx)).to.be.rejectedWith(PerformanceRegressionError);

    expect(readReport()[SUITE_KEY]['sample operation'].history).to.eql([
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
    ]);
  });
});

describe('resultLine', () => {
  const saved = {...process.env};

  afterEach(() => {
    process.env = {...saved};
  });

  it('says how many more samples a new benchmark needs', () => {
    process.env.BENCH_MIN_SAMPLES = '5';

    const line = resultLine('creates an order', givenMetrics(), {
      deviation: 0,
      buildingBaseline: true,
      regressed: false,
      recorded: 2,
    });

    expect(line).to.equal(
      '  creates an order: building baseline, 1234.57 ops/s, 2 of 5 runs recorded',
    );
  });

  it('reports the deviation with throughput and latency', () => {
    const line = resultLine('creates an order', givenMetrics(), {
      deviation: -12.3456,
      buildingBaseline: false,
      regressed: false,
      recorded: 10,
    });

    expect(line).to.equal(
      '  creates an order: STABLE -12.35%, 1234.57 ops/s, 0.810 ms latency over 12 samples',
    );
  });

  it('labels a regression as one', () => {
    const line = resultLine('creates an order', givenMetrics(), {
      deviation: -80,
      buildingBaseline: false,
      regressed: true,
      recorded: 10,
    });

    expect(line).to.match(/^ {2}creates an order: REGRESSION -80\.00%/);
  });
});
