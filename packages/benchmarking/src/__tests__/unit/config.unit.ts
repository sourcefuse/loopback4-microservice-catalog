// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {config} from '../../config';
import {BenchmarkConfigError} from '../../errors';

const BENCH_ENV_KEYS = [
  'BENCH_ITERATIONS',
  'BENCH_MIN_TIME',
  'BENCH_WARMUP',
  'BENCH_WARMUP_TIME',
  'BENCH_THRESHOLD',
  'BENCH_NOISE_MULTIPLIER',
  'BENCH_MIN_THRESHOLD',
  'BENCH_MIN_NOISE_HISTORY',
  'BENCH_OUTLIER_PERCENT',
  'BENCH_REPORT_FILE',
  'CI',
] as const;

describe('config', () => {
  const saved = new Map<string, string | undefined>();

  beforeEach(() => {
    for (const key of BENCH_ENV_KEYS) {
      saved.set(key, process.env[key]);
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const [key, value] of saved) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
    saved.clear();
  });

  it('falls back to defaults when nothing is set', () => {
    expect(config.iterations).to.equal(30);
    expect(config.minTime).to.equal(200);
    expect(config.warmup).to.be.true();
    expect(config.warmupTime).to.equal(100);
    expect(config.threshold).to.equal(15);
    expect(config.noiseMultiplier).to.equal(4);
    expect(config.minThreshold).to.equal(10);
    expect(config.minNoiseHistory).to.equal(3);
    expect(config.outlierPercent).to.equal(40);
    expect(config.isCI).to.be.false();
    expect(config.reportFile).to.equal('./.bench/report.json');
  });

  it('reads a variable set after the module was imported', () => {
    process.env.BENCH_ITERATIONS = '25';
    expect(config.iterations).to.equal(25);
  });

  it('needs at least two runs to measure noise', () => {
    process.env.BENCH_MIN_NOISE_HISTORY = '1';
    expect(config.minNoiseHistory).to.equal(2);
  });

  it('clamps a value above the allowed maximum', () => {
    process.env.BENCH_ITERATIONS = '5000';
    process.env.BENCH_MIN_TIME = '20000';
    process.env.BENCH_OUTLIER_PERCENT = '5000';
    expect(config.iterations).to.equal(1000);
    expect(config.minTime).to.equal(10000);
    expect(config.outlierPercent).to.equal(1000);
  });

  it('clamps a value below the allowed minimum', () => {
    process.env.BENCH_ITERATIONS = '0';
    process.env.BENCH_THRESHOLD = '-15';
    expect(config.iterations).to.equal(1);
    expect(config.threshold).to.equal(0);
  });

  it('falls back to the default when a value is not a number', () => {
    process.env.BENCH_ITERATIONS = 'ten';
    process.env.BENCH_THRESHOLD = 'high';
    expect(config.iterations).to.equal(30);
    expect(config.threshold).to.equal(15);
  });

  it('falls back to the default rather than reading a partial number', () => {
    process.env.BENCH_ITERATIONS = '10abc';
    expect(config.iterations).to.equal(30);

    process.env.BENCH_ITERATIONS = '7.5';
    expect(config.iterations).to.equal(30);
  });

  it('reads exponent notation as the whole number it means', () => {
    process.env.BENCH_ITERATIONS = '1e2';
    expect(config.iterations).to.equal(100);
  });

  it('falls back to the default when a value is blank', () => {
    process.env.BENCH_ITERATIONS = '   ';
    process.env.BENCH_THRESHOLD = '';
    expect(config.iterations).to.equal(30);
    expect(config.threshold).to.equal(15);
  });

  it('accepts fractional percentages and multipliers', () => {
    process.env.BENCH_THRESHOLD = '7.5';
    process.env.BENCH_MIN_THRESHOLD = '2.5';
    process.env.BENCH_NOISE_MULTIPLIER = '3.5';
    expect(config.threshold).to.equal(7.5);
    expect(config.minThreshold).to.equal(2.5);
    expect(config.noiseMultiplier).to.equal(3.5);
  });

  it('disables warmup only for the exact string "false"', () => {
    process.env.BENCH_WARMUP = 'false';
    expect(config.warmup).to.be.false();

    process.env.BENCH_WARMUP = '0';
    expect(config.warmup).to.be.true();
  });

  it('rejects a report path that escapes the project', () => {
    process.env.BENCH_REPORT_FILE = '../../etc/report.json';
    expect(() => config.reportFile).to.throw(BenchmarkConfigError);
    expect(() => config.reportFile).to.throw(/Path traversal detected/);
  });

  it('accepts a report path inside the project', () => {
    process.env.BENCH_REPORT_FILE = './reports/bench.json';
    expect(config.reportFile).to.equal('./reports/bench.json');
  });
});
