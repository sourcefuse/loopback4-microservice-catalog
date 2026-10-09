// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {BASELINE_FILE} from '../../../report/compare';
import {baselineUrlNote, saveBaselineIfAsked} from '../../../run/baseline';
import type {Outcome} from '../../../run/types';
import type {Baseline} from '../../../report/types';

describe('saveBaselineIfAsked', () => {
  let pkgDir: string;
  let printed: string[];
  let errors: string[];
  const output = {
    print: (line: string) => printed.push(line),
    printError: (line: string) => errors.push(line),
  };
  const outcome: Outcome = {
    scenarios: [],
    measured: {s: {workload: '1 vuser/s for 1 s', p95: {'GET /a': 5}}},
  };
  const run = (passed: boolean) => ({
    pkgDir,
    baseUrl: 'http://app',
    outcome,
    passed,
  });
  const saved = () => fs.existsSync(path.join(pkgDir, BASELINE_FILE));

  beforeEach(() => {
    pkgDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lt-baseline-'));
    printed = [];
    errors = [];
  });
  afterEach(() => fs.rmSync(pkgDir, {recursive: true}));

  it('saves nothing when LOAD_TESTS_UPDATE_BASELINE is not 1', () => {
    saveBaselineIfAsked(run(true), {}, output);

    expect(saved()).to.be.false();
    expect(printed).to.deepEqual([]);
    expect(errors).to.deepEqual([]);
  });

  it('saves a passed run, and says so', () => {
    saveBaselineIfAsked(run(true), {LOAD_TESTS_UPDATE_BASELINE: '1'}, output);

    expect(saved()).to.be.true();
    expect(printed.join('')).to.match(/Saved /);
  });

  it('keeps a failed run out, and says how to force it', () => {
    saveBaselineIfAsked(run(false), {LOAD_TESTS_UPDATE_BASELINE: '1'}, output);

    expect(saved()).to.be.false();
    expect(errors.join('')).to.match(/LOAD_TESTS_FORCE_BASELINE=1/);
  });

  it('saves a failed run when LOAD_TESTS_FORCE_BASELINE is 1', () => {
    saveBaselineIfAsked(
      run(false),
      {LOAD_TESTS_UPDATE_BASELINE: '1', LOAD_TESTS_FORCE_BASELINE: '1'},
      output,
    );

    expect(saved()).to.be.true();
  });
});

describe('baselineUrlNote', () => {
  const baseline: Baseline = {
    baseUrl: 'http://old',
    recordedAt: '2026-01-01T00:00:00.000Z',
    history: {},
    workloads: {},
  };

  it('names both URLs when they differ', () => {
    expect(baselineUrlNote(baseline, 'http://new')).to.equal(
      'The baseline is from http://old, not http://new.',
    );
  });

  it('says nothing for the same URL, or for no baseline', () => {
    expect(baselineUrlNote(baseline, 'http://old')).to.be.undefined();
    expect(baselineUrlNote(undefined, 'http://new')).to.be.undefined();
  });
});
