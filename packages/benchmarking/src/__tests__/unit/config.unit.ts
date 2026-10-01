// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {config} from '../../config';
import {BenchmarkConfigError} from '../../errors';

const BENCH_ENV_KEYS = [
  'BENCH_OPS_TO_TRACK',
  'BENCH_ITERATIONS',
  'BENCH_WARMUP',
  'BENCH_THRESHOLD',
  'BENCH_MIN_SAMPLES',
  'BENCH_REPORT_FILE',
  'BENCH_FORCE_BASELINE',
  'BENCH_UPDATE_BASELINE',
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
    expect(config.opsToTrack).to.equal(10);
    expect(config.iterations).to.equal(10);
    expect(config.threshold).to.equal(40);
    expect(config.minSamples).to.equal(3);
    expect(config.warmup).to.be.true();
    expect(config.updateBaseline).to.be.false();
    expect(config.isCI).to.be.false();
    expect(config.forceBaseline).to.be.false();
    expect(config.reportFile).to.equal('./.bench/report.json');
  });

  it('reads a variable set after the module was imported', () => {
    process.env.BENCH_ITERATIONS = '25';
    expect(config.iterations).to.equal(25);
  });

  it('caps the minimum sample count at the window size', () => {
    process.env.BENCH_OPS_TO_TRACK = '2';
    process.env.BENCH_MIN_SAMPLES = '9';
    // A floor above the window would leave the gate building a baseline for
    // ever, because the window can never hold that many samples.
    expect(config.minSamples).to.equal(2);
  });

  it('lowers the default minimum to fit a small window', () => {
    process.env.BENCH_OPS_TO_TRACK = '2';
    expect(config.minSamples).to.equal(2);
  });

  it('clamps a value above the allowed maximum', () => {
    process.env.BENCH_ITERATIONS = '5000';
    process.env.BENCH_OPS_TO_TRACK = '250';
    expect(config.iterations).to.equal(1000);
    expect(config.opsToTrack).to.equal(100);
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
    expect(config.iterations).to.equal(10);
    expect(config.threshold).to.equal(40);
  });

  it('falls back to the default rather than reading a partial number', () => {
    process.env.BENCH_ITERATIONS = '10abc';
    expect(config.iterations).to.equal(10);

    process.env.BENCH_ITERATIONS = '7.5';
    expect(config.iterations).to.equal(10);
  });

  it('reads exponent notation as the whole number it means', () => {
    process.env.BENCH_ITERATIONS = '1e2';
    expect(config.iterations).to.equal(100);
  });

  it('falls back to the default when a value is blank', () => {
    process.env.BENCH_ITERATIONS = '   ';
    process.env.BENCH_THRESHOLD = '';
    expect(config.iterations).to.equal(10);
    expect(config.threshold).to.equal(40);
  });

  it('accepts a fractional threshold', () => {
    process.env.BENCH_THRESHOLD = '7.5';
    expect(config.threshold).to.equal(7.5);
  });

  it('disables warmup only for the exact string "false"', () => {
    process.env.BENCH_WARMUP = 'false';
    expect(config.warmup).to.be.false();

    process.env.BENCH_WARMUP = '0';
    expect(config.warmup).to.be.true();
  });

  it('enables baseline writes only for the exact string "1"', () => {
    process.env.BENCH_UPDATE_BASELINE = 'true';
    expect(config.updateBaseline).to.be.false();

    process.env.BENCH_UPDATE_BASELINE = '1';
    expect(config.updateBaseline).to.be.true();
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
