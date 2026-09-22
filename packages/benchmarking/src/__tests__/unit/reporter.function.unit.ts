// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import type {BaselineData, PerformanceMetrics} from '../../types';
import {BenchmarkConfigError, ReporterError} from '../../errors';
import {reporter} from '../../functions/reporter.function';

const SUITE = 'orders';
const TEST = 'creates an order';

function metricsWithThroughput(throughputMean: number): PerformanceMetrics {
  return {
    throughput: {
      mean: throughputMean,
      min: throughputMean,
      max: throughputMean,
    },
    latency: {mean: 1, min: 1, max: 1},
    samples: 10,
  };
}

describe('reporter', () => {
  const savedEnv = new Map<string, string | undefined>();
  let workDir: string;
  let reportFile: string;

  function setEnv(key: string, value: string | undefined) {
    if (!savedEnv.has(key)) {
      savedEnv.set(key, process.env[key]);
    }
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  function writeHistory(history: number[]) {
    const data: BaselineData = {
      [SUITE]: {
        [TEST]: {
          history,
          latest: {
            ...metricsWithThroughput(history.at(-1) ?? 0),
            latestDeviation: 0,
          },
        },
      },
    };
    writeFileSync(reportFile, JSON.stringify(data));
  }

  function readReport(): BaselineData {
    return JSON.parse(readFileSync(reportFile, 'utf-8')) as BaselineData;
  }

  beforeEach(() => {
    workDir = mkdtempSync(join(tmpdir(), 'benchmarking-'));
    reportFile = join(workDir, 'report.json');
    setEnv('BENCH_REPORT_FILE', reportFile);
    setEnv('BENCH_UPDATE_BASELINE', '1');
    setEnv('BENCH_THRESHOLD', '40');
    setEnv('BENCH_MIN_SAMPLES', '3');
    setEnv('BENCH_OPS_TO_TRACK', '10');
    setEnv('BENCH_FORCE_BASELINE', undefined);
  });

  afterEach(() => {
    for (const [key, value] of savedEnv) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
    savedEnv.clear();
    rmSync(workDir, {recursive: true, force: true});
  });

  describe('while the baseline is still building', () => {
    it('reports the first ever run as building, with no deviation', () => {
      const result = reporter(SUITE, TEST, metricsWithThroughput(100));

      expect(result.buildingBaseline).to.be.true();
      expect(result.deviation).to.equal(0);
    });

    it('keeps reporting as building below the minimum sample count', () => {
      writeHistory([100, 100]);

      const result = reporter(SUITE, TEST, metricsWithThroughput(10));

      expect(result.buildingBaseline).to.be.true();
    });

    it('records the sample even though it does not gate', () => {
      writeHistory([100, 100]);

      reporter(SUITE, TEST, metricsWithThroughput(10));

      expect(readReport()[SUITE][TEST].history).to.eql([100, 100, 10]);
    });

    it('stops reporting as building once the minimum is reached', () => {
      writeHistory([100, 100, 100]);

      const result = reporter(SUITE, TEST, metricsWithThroughput(100));

      expect(result.buildingBaseline).to.be.false();
    });
  });

  describe('deviation', () => {
    it('is zero for a run matching the baseline average', () => {
      writeHistory([100, 100, 100]);

      const result = reporter(SUITE, TEST, metricsWithThroughput(100));

      expect(result.deviation).to.equal(0);
    });

    it('is positive for a faster run', () => {
      writeHistory([100, 100, 100]);

      const result = reporter(SUITE, TEST, metricsWithThroughput(150));

      expect(result.deviation).to.equal(50);
    });

    it('is negative for a slower run', () => {
      writeHistory([100, 100, 100]);

      const result = reporter(SUITE, TEST, metricsWithThroughput(75));

      expect(result.deviation).to.equal(-25);
    });

    it('averages the window rather than using the last run', () => {
      writeHistory([50, 100, 150]);

      const result = reporter(SUITE, TEST, metricsWithThroughput(100));

      expect(result.deviation).to.equal(0);
    });

    it('only looks at the most recent BENCH_OPS_TO_TRACK samples', () => {
      setEnv('BENCH_OPS_TO_TRACK', '3');
      writeHistory([1000, 1000, 100, 100, 100]);

      const result = reporter(SUITE, TEST, metricsWithThroughput(100));

      expect(result.deviation).to.equal(0);
    });

    it('falls back to zero when the baseline average is zero', () => {
      writeHistory([0, 0, 0]);

      const result = reporter(SUITE, TEST, metricsWithThroughput(100));

      expect(result.deviation).to.equal(0);
    });
  });

  describe('history updates', () => {
    it('appends a passing run', () => {
      writeHistory([100, 100, 100]);

      reporter(SUITE, TEST, metricsWithThroughput(110));

      expect(readReport()[SUITE][TEST].history).to.eql([100, 100, 100, 110]);
    });

    it('drops the oldest sample past the window size', () => {
      setEnv('BENCH_OPS_TO_TRACK', '3');
      writeHistory([100, 200, 300]);

      reporter(SUITE, TEST, metricsWithThroughput(400));

      expect(readReport()[SUITE][TEST].history).to.eql([200, 300, 400]);
    });

    it('holds the window when a run regresses', () => {
      writeHistory([100, 100, 100]);

      reporter(SUITE, TEST, metricsWithThroughput(10));

      expect(readReport()[SUITE][TEST].history).to.eql([100, 100, 100]);
    });

    it('restarts from the regressed run when forced', () => {
      setEnv('BENCH_FORCE_BASELINE', '1');
      writeHistory([100, 100, 100]);

      reporter(SUITE, TEST, metricsWithThroughput(10));

      expect(readReport()[SUITE][TEST].history).to.eql([10]);
    });

    it('leaves a passing run untouched by the force flag', () => {
      setEnv('BENCH_FORCE_BASELINE', '1');
      writeHistory([100, 100, 100]);

      reporter(SUITE, TEST, metricsWithThroughput(110));

      expect(readReport()[SUITE][TEST].history).to.eql([100, 100, 100, 110]);
    });
  });

  describe('the regression flag', () => {
    it('stays down for a run that is faster than the baseline', () => {
      writeHistory([100, 100, 100]);

      expect(
        reporter(SUITE, TEST, metricsWithThroughput(150)).regressed,
      ).to.be.false();
    });

    it('stays down for a drop inside the threshold', () => {
      writeHistory([100, 100, 100]);

      expect(
        reporter(SUITE, TEST, metricsWithThroughput(61)).regressed,
      ).to.be.false();
    });

    it('stays down for a drop landing exactly on the threshold', () => {
      writeHistory([100, 100, 100]);

      expect(
        reporter(SUITE, TEST, metricsWithThroughput(60)).regressed,
      ).to.be.false();
    });

    it('goes up for a drop past the threshold', () => {
      writeHistory([100, 100, 100]);

      expect(
        reporter(SUITE, TEST, metricsWithThroughput(59)).regressed,
      ).to.be.true();
    });

    it('stays down while the baseline is still building', () => {
      writeHistory([100]);

      expect(
        reporter(SUITE, TEST, metricsWithThroughput(1)).regressed,
      ).to.be.false();
    });

    it('follows a threshold changed at run time', () => {
      writeHistory([100, 100, 100]);
      setEnv('BENCH_THRESHOLD', '10');

      expect(
        reporter(SUITE, TEST, metricsWithThroughput(85)).regressed,
      ).to.be.true();
    });

    it('records the latest metrics alongside the history', () => {
      writeHistory([100, 100, 100]);

      reporter(SUITE, TEST, metricsWithThroughput(150));

      const latest = readReport()[SUITE][TEST].latest;
      expect(latest.latestDeviation).to.equal(50);
      expect(latest.throughput.mean).to.equal(150);
    });
  });

  describe('file handling', () => {
    it('writes nothing unless BENCH_UPDATE_BASELINE is set', () => {
      setEnv('BENCH_UPDATE_BASELINE', undefined);
      writeHistory([100, 100, 100]);

      reporter(SUITE, TEST, metricsWithThroughput(150));

      expect(readReport()[SUITE][TEST].history).to.eql([100, 100, 100]);
    });

    it('creates the report directory when it is missing', () => {
      const nested = join(workDir, 'nested', 'deep', 'report.json');
      setEnv('BENCH_REPORT_FILE', nested);

      reporter(SUITE, TEST, metricsWithThroughput(100));

      expect(existsSync(nested)).to.be.true();
    });

    it('keeps other suites in the file', () => {
      writeFileSync(
        reportFile,
        JSON.stringify({
          billing: {
            'charges a card': {
              history: [5],
              latest: {...metricsWithThroughput(5), latestDeviation: 0},
            },
          },
        }),
      );

      reporter(SUITE, TEST, metricsWithThroughput(100));

      expect(readReport().billing['charges a card'].history).to.eql([5]);
    });

    it('keeps other tests in the same suite', () => {
      writeFileSync(
        reportFile,
        JSON.stringify({
          [SUITE]: {
            'reads an order': {
              history: [5],
              latest: {...metricsWithThroughput(5), latestDeviation: 0},
            },
          },
        }),
      );

      reporter(SUITE, TEST, metricsWithThroughput(100));

      expect(readReport()[SUITE]['reads an order'].history).to.eql([5]);
    });

    it('starts fresh when the file holds invalid JSON', () => {
      writeFileSync(reportFile, 'not json at all');

      const result = reporter(SUITE, TEST, metricsWithThroughput(100));

      expect(result.buildingBaseline).to.be.true();
      expect(readReport()[SUITE][TEST].history).to.eql([100]);
    });

    it('starts fresh when the history is not an array', () => {
      writeFileSync(
        reportFile,
        JSON.stringify({[SUITE]: {[TEST]: {history: 'corrupt'}}}),
      );

      const result = reporter(SUITE, TEST, metricsWithThroughput(100));

      expect(result.deviation).to.equal(0);
      expect(readReport()[SUITE][TEST].history).to.eql([100]);
    });

    it('leaves no temporary file behind after a write', () => {
      reporter(SUITE, TEST, metricsWithThroughput(100));

      expect(existsSync(`${reportFile}.tmp`)).to.be.false();
    });

    it('wraps a write failure in a ReporterError naming the test', () => {
      setEnv('BENCH_REPORT_FILE', join(workDir, 'report.json', 'nope.json'));
      writeFileSync(reportFile, '{}');

      expect(() => reporter(SUITE, TEST, metricsWithThroughput(100))).to.throw(
        ReporterError,
      );
      expect(() => reporter(SUITE, TEST, metricsWithThroughput(100))).to.throw(
        /orders\/creates an order/,
      );
    });

    it('passes a bad setting through instead of calling it an I/O failure', () => {
      setEnv('BENCH_REPORT_FILE', '../escape/report.json');

      expect(() => reporter(SUITE, TEST, metricsWithThroughput(100))).to.throw(
        BenchmarkConfigError,
      );
    });
  });
});
