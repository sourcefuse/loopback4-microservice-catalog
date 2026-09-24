// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {bench} from '../../functions';
import type {BaselineData} from '../../types';

bench.describe('the package itself', () => {
  let workDir: string;
  let reportFile: string;
  const saved = {...process.env};

  // Scoped to this suite so a combined run cannot inherit these settings, and
  // so loading the file without running it leaves no temporary directory.
  before(() => {
    workDir = mkdtempSync(join(tmpdir(), 'benchmarking-self-'));
    reportFile = join(workDir, 'report.json');
    process.env.BENCH_ITERATIONS = '2';
    process.env.BENCH_REPORT_FILE = reportFile;
    process.env.BENCH_UPDATE_BASELINE = '1';
  });

  after(() => {
    // The benchmark below asserts nothing on its own, so the proof that the
    // whole path ran is the sample it left behind.
    const report = JSON.parse(
      readFileSync(reportFile, 'utf-8'),
    ) as BaselineData;
    // The suite key keeps the prefix that bench.describe adds to the title.
    const entry =
      report['benchmark: the package itself']['measures an async callback'];
    expect(entry.history).to.have.length(1);
    expect(entry.latest.throughput.mean).to.be.above(0);

    process.env = {...saved};
    rmSync(workDir, {recursive: true, force: true});
  });

  bench.it('measures an async callback', async () => {
    await Promise.resolve();
  });
});
