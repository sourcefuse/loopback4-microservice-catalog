// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {expect} from '@loopback/testlab';
import {
  addRun,
  addRuns,
  BASELINE_FILE,
  baselineFrom,
  exceedsMax,
  HISTORY_SIZE,
  judge,
  judgeP95,
  judgeVusers,
  p95Limit,
  readBaseline,
  saveRun,
  workloadChanged,
} from '../../../report/compare';
import {heavy} from '../../helpers';
import {OUT_DIR} from '../../../project/layout';
import {P95_TARGETS, resolveThresholds} from '../../../project/config';
import type {Baseline} from '../../../report/types';

const LIMITS = resolveThresholds({});
const ok = (p95: number) => ({count: 600, failed: 0, p95});

describe('judge', () => {
  it('passes one reporting step up (10.9 to 13.1 ms)', () => {
    expect(judge(ok(13.1), LIMITS, 10.9)).to.deepEqual([]);
  });

  it('fails a small endpoint that got four times slower (15 to 60 ms)', () => {
    expect(judge(ok(60), LIMITS, 15)).to.deepEqual([
      'p95 +300% (+45 ms) over baseline 15 ms',
    ]);
  });

  it('fails a large endpoint that got 30% slower (200 to 260 ms)', () => {
    expect(judge(ok(260), LIMITS, 200)).to.deepEqual([
      'p95 +30% (+60 ms) over baseline 200 ms',
    ]);
  });

  it('passes a large delta under the percent limit (200 to 230 ms)', () => {
    expect(judge(ok(230), LIMITS, 200)).to.deepEqual([]);
  });

  it('fails an endpoint that got no requests', () => {
    expect(judge({count: 0, failed: 0}, LIMITS, 10)).to.deepEqual([
      'no requests',
    ]);
  });

  it('passes under the default cap with no baseline', () => {
    expect(judge(ok(400), LIMITS)).to.deepEqual([]);
  });

  it('passes at the default cap', () => {
    expect(judge(ok(500), LIMITS)).to.deepEqual([]);
  });

  it('fails above the default cap with no baseline', () => {
    expect(judge(ok(501), LIMITS)).to.deepEqual(['p95 501 ms > limit 500 ms']);
  });

  it('fails above the error rate and above a cap that the endpoint sets', () => {
    const limits = resolveThresholds({p95: 300});

    expect(judge({count: 100, failed: 2, p95: 301}, limits)).to.deepEqual([
      'error rate 2% > 1%',
      'p95 301 ms > limit 300 ms',
    ]);
  });

  it('passes a p95 above the default cap when the endpoint sets a higher cap', () => {
    const limits = resolveThresholds({p95: P95_TARGETS.supportingApi});

    expect(judge(ok(900), limits)).to.deepEqual([]);
  });
});

describe('baselineFrom', () => {
  it('is the mean of the history', () => {
    expect(baselineFrom([10, 20, 60])).to.equal(30);
  });

  it('is undefined with no history', () => {
    expect(baselineFrom(undefined)).to.be.undefined();
    expect(baselineFrom([])).to.be.undefined();
  });
});

describe('addRun', () => {
  it('appends a run and keeps only the newest ones', () => {
    const full = Array.from({length: HISTORY_SIZE}, (_, i) => i + 1);

    expect(addRun(full, 99)).to.deepEqual([...full.slice(1), 99]);
  });

  it('starts a history', () => {
    expect(addRun(undefined, 12)).to.deepEqual([12]);
  });
});

describe('judgeP95 with a mean baseline', () => {
  it('shows the baseline in ms with 1 decimal', () => {
    expect(judgeP95(200, LIMITS, 124.30000000000001)).to.deepEqual([
      'p95 +60.9% (+75.7 ms) over baseline 124.3 ms',
    ]);
  });

  it('shows the baseline of CLS with 2 decimals', () => {
    const limits = {p95: 1, p95Regression: 10, minDelta: 0.05};

    expect(judgeP95(0.3, limits, 0.15000000000000002, '')).to.deepEqual([
      'p95 +100% (+0.15) over baseline 0.15',
    ]);
  });
});

describe('judgeP95 at exactly minDelta above the baseline', () => {
  it('passes a CLS that goes from 0.7 to 0.8 although 0.7 + 0.1 is 0.7999999999999999', () => {
    const limits = {p95: 1, p95Regression: 10, minDelta: 0.1};

    expect(judgeP95(0.8, limits, 0.7, '')).to.deepEqual([]);
  });
});

describe('judge with a baseline of 0 ms', () => {
  it('fails on the millisecond limit alone', () => {
    expect(judge(ok(15), LIMITS, 0)).to.deepEqual([
      'p95 (+15 ms) over baseline 0 ms',
    ]);
  });

  it('passes an increase below the millisecond limit', () => {
    expect(judge(ok(5), LIMITS, 0)).to.deepEqual([]);
  });
});

describe('p95Limit', () => {
  it('is the baseline plus the larger of the two allowances', () => {
    // 20% of 75 ms is 15 ms, more than the 10 ms of minDelta.
    expect(p95Limit(LIMITS, 75)).to.equal(90);
    // 20% of 15 ms is 3 ms, less than the 10 ms of minDelta.
    expect(p95Limit(LIMITS, 15)).to.equal(25);
  });

  it('is the default cap when there is no baseline', () => {
    expect(p95Limit(LIMITS)).to.equal(500);
  });

  it('is the cap that the endpoint sets when there is no baseline', () => {
    expect(p95Limit(resolveThresholds({p95: 800}))).to.equal(800);
  });

  it('is the lower of the cap and the limit from the baseline', () => {
    expect(p95Limit(resolveThresholds({p95: 80}), 75)).to.equal(80);
    // The limit from a baseline of 450 ms is 540 ms, above the default cap.
    expect(p95Limit(LIMITS, 450)).to.equal(500);
  });

  it('is the highest p95 that judge accepts', () => {
    for (const base of [0, 5, 15, 75, 200, 450]) {
      const limit = p95Limit(LIMITS, base);

      expect(judge(ok(limit), LIMITS, base)).to.deepEqual([]);
      expect(judge(ok(limit + 0.1), LIMITS, base)).to.have.length(1);
    }
  });
});

describe('judgeVusers', () => {
  it('passes when no more than the error rate of the vusers failed', () => {
    const vusers = {started: 200, completed: 198, failed: 2};

    expect(judgeVusers(vusers, LIMITS)).to.deepEqual([]);
  });

  it('fails above the error rate', () => {
    const vusers = {started: 180, completed: 176, failed: 4};

    expect(judgeVusers(vusers, LIMITS)).to.deepEqual([
      'vuser failure rate 2.2% > 1%',
    ]);
  });

  it('passes when no vuser started, because the endpoints then fail', () => {
    const vusers = {started: 0, completed: 0, failed: 0};

    expect(judgeVusers(vusers, LIMITS)).to.deepEqual([]);
  });
});

const baselineOf = (
  history: Baseline['history'],
  workloads: Baseline['workloads'],
): Baseline => ({
  baseUrl: 'http://app',
  recordedAt: '2026-10-05',
  history,
  workloads,
});

describe('workloadChanged', () => {
  const baseline = baselineOf(
    {s: {'GET /a': [10]}},
    {s: '3 vusers/s for 60 s'},
  );

  it('is false for the same workload', () => {
    expect(workloadChanged(baseline, 's', '3 vusers/s for 60 s')).to.be.false();
  });

  it('is true for another workload', () => {
    expect(workloadChanged(baseline, 's', '5 vusers/s for 60 s')).to.be.true();
  });

  it('is false for a scenario that the baseline does not know', () => {
    expect(
      workloadChanged(baseline, 'new', '5 vusers/s for 60 s'),
    ).to.be.false();
  });

  it('is false with no baseline', () => {
    expect(
      workloadChanged(undefined, 's', '5 vusers/s for 60 s'),
    ).to.be.false();
  });
});

describe('addRuns', () => {
  const before = baselineOf(
    {s: {'GET /a': [10, 12]}, other: {'GET /b': [5]}},
    {s: '3 vusers/s for 60 s', other: '1 vusers/s for 60 s'},
  );
  const URL = before.baseUrl;

  it('adds the p95 of a run to the history of its scenario', () => {
    const after = addRuns(
      before,
      {
        s: {
          workload: '3 vusers/s for 60 s',
          browser: false,
          p95: {'GET /a': 14},
        },
      },
      URL,
    );

    expect(after.history.s).to.deepEqual({'GET /a': [10, 12, 14]});
  });

  it('starts a new history for the scenarios of the run when the host changed', () => {
    const after = addRuns(
      before,
      {
        s: {
          workload: '3 vusers/s for 60 s',
          browser: false,
          p95: {'GET /a': 14},
        },
      },
      'http://other.example',
    );

    expect(after.history.s).to.deepEqual({'GET /a': [14]});
    expect(after.workloads.s).to.equal('3 vusers/s for 60 s');
  });

  it('keeps the history of a scenario that did not run, when the host changed', () => {
    const after = addRuns(
      before,
      {
        s: {
          workload: '3 vusers/s for 60 s',
          browser: false,
          p95: {'GET /a': 14},
        },
      },
      'http://other.example',
    );

    expect(after.history.other).to.deepEqual({'GET /b': [5]});
  });

  it('starts a new history when the workload changed', () => {
    const after = addRuns(
      before,
      {
        s: {
          workload: '5 vusers/s for 60 s',
          browser: false,
          p95: {'GET /a': 14},
        },
      },
      URL,
    );

    expect(after.history.s).to.deepEqual({'GET /a': [14]});
    expect(after.workloads.s).to.equal('5 vusers/s for 60 s');
  });

  it('keeps the scenarios that did not run', () => {
    const after = addRuns(
      before,
      {
        s: {
          workload: '3 vusers/s for 60 s',
          browser: false,
          p95: {'GET /a': 14},
        },
      },
      URL,
    );

    expect(after.history.other).to.deepEqual({'GET /b': [5]});
    expect(after.workloads.other).to.equal('1 vusers/s for 60 s');
  });

  describe('of a run of browser scenarios, with no API', () => {
    const page = {
      page: {
        workload: '3 vusers/s for 60 s',
        browser: true,
        p95: {'browser.step.save': 900},
      },
    };
    const withUi = {
      ...baselineOf(
        {page: {'browser.step.save': [800]}},
        {
          page: '3 vusers/s for 60 s',
        },
      ),
      uiUrl: 'http://ui',
    };

    it('adds to the history on the same web app', () => {
      const after = addRuns(withUi, page, undefined, 'http://ui');

      expect(after.history.page).to.deepEqual({
        'browser.step.save': [800, 900],
      });
    });

    it('starts a new history when the web app changed', () => {
      const after = addRuns(withUi, page, undefined, 'http://other-ui');

      expect(after.history.page).to.deepEqual({'browser.step.save': [900]});
    });
  });

  describe('of a baseline with an API and a web app', () => {
    const both = {
      ...baselineOf(
        {api: {'GET /a': [10]}, page: {'browser.step.save': [800]}},
        {api: 'w', page: 'w'},
      ),
      uiUrl: 'http://ui',
    };
    const run = {
      api: {workload: 'w', browser: false, p95: {'GET /a': 14}},
      page: {workload: 'w', browser: true, p95: {'browser.step.save': 900}},
    };

    it('keeps the history of the browser scenarios when only the API changed', () => {
      const after = addRuns(both, run, 'http://other.example', 'http://ui');

      expect(after.history.api).to.deepEqual({'GET /a': [14]});
      expect(after.history.page).to.deepEqual({
        'browser.step.save': [800, 900],
      });
    });

    it('keeps the history of the HTTP scenarios when only the web app changed', () => {
      const after = addRuns(both, run, URL, 'http://other-ui');

      expect(after.history.api).to.deepEqual({'GET /a': [10, 14]});
      expect(after.history.page).to.deepEqual({'browser.step.save': [900]});
    });
  });

  it('starts a baseline', () => {
    const after = addRuns(
      undefined,
      {s: {workload: 'w', browser: false, p95: {'GET /a': 14}}},
      URL,
    );

    expect(after).to.deepEqual({
      history: {s: {'GET /a': [14]}},
      workloads: {s: 'w'},
    });
  });
});

describe('saveRun', () => {
  const measured = {s: {workload: 'w', browser: false, p95: {'GET /a': 14}}};
  const browserMeasured = {
    s: {workload: 'w', browser: true, p95: {'browser.flow.s': 900}},
  };
  let pkgDir: string;

  beforeEach(() => {
    pkgDir = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-'));
    fs.mkdirSync(path.join(pkgDir, OUT_DIR), {recursive: true});
  });

  afterEach(() => fs.rmSync(pkgDir, {recursive: true}));

  it('keeps a failed run out of the baseline', () => {
    const run = {baseUrl: 'http://app', measured, failed: true, force: false};

    expect(saveRun(pkgDir, run)).to.be.false();
    expect(readBaseline(pkgDir)).to.be.undefined();
  });

  it('keeps the API of the baseline after a run of browser scenarios only', () => {
    saveRun(pkgDir, {
      baseUrl: 'http://api',
      measured,
      failed: false,
      force: false,
    });

    saveRun(pkgDir, {
      uiUrl: 'http://ui',
      baseline: readBaseline(pkgDir),
      measured: browserMeasured,
      failed: false,
      force: false,
    });

    expect(readBaseline(pkgDir)).to.containDeep({
      baseUrl: 'http://api',
      uiUrl: 'http://ui',
    });
  });

  it('keeps the web app of the baseline after a run of HTTP scenarios only', () => {
    saveRun(pkgDir, {
      uiUrl: 'http://ui',
      measured: browserMeasured,
      failed: false,
      force: false,
    });

    saveRun(pkgDir, {
      baseUrl: 'http://api',
      baseline: readBaseline(pkgDir),
      measured,
      failed: false,
      force: false,
    });

    expect(readBaseline(pkgDir)).to.containDeep({
      baseUrl: 'http://api',
      uiUrl: 'http://ui',
    });
  });

  it('saves no baseUrl after a run of browser scenarios only, although the run has a target', () => {
    saveRun(pkgDir, {
      baseUrl: 'http://api',
      uiUrl: 'http://ui',
      measured: browserMeasured,
      failed: false,
      force: false,
    });

    expect(readBaseline(pkgDir)?.baseUrl).to.be.undefined();
    expect(readBaseline(pkgDir)?.uiUrl).to.equal('http://ui');
  });

  it('saves no uiUrl after a run of HTTP scenarios only, although the run has a target', () => {
    saveRun(pkgDir, {
      baseUrl: 'http://api',
      uiUrl: 'http://ui',
      measured,
      failed: false,
      force: false,
    });

    expect(readBaseline(pkgDir)?.baseUrl).to.equal('http://api');
    expect(readBaseline(pkgDir)?.uiUrl).to.be.undefined();
  });

  it('reads a baseline of browser scenarios only, which has no baseUrl', () => {
    fs.writeFileSync(
      path.join(pkgDir, OUT_DIR, 'baseline.json'),
      JSON.stringify({history: {}, workloads: {}, uiUrl: 'http://ui'}),
    );

    expect(readBaseline(pkgDir)?.uiUrl).to.equal('http://ui');
  });

  it('makes the folder of the baseline when it is missing', () => {
    fs.rmSync(path.join(pkgDir, OUT_DIR), {recursive: true});
    const run = {baseUrl: 'http://app', measured, failed: false, force: false};

    expect(saveRun(pkgDir, run)).to.be.true();
    expect(readBaseline(pkgDir)?.workloads).to.deepEqual({s: 'w'});
  });

  it('names the baseline file when it is not valid JSON', () => {
    fs.writeFileSync(path.join(pkgDir, OUT_DIR, 'baseline.json'), '{"his');

    expect(() => readBaseline(pkgDir)).to.throw(
      /baseline.json is not valid JSON. Delete it, and record a new one./,
    );
  });

  it('stops at a baseline with a history and no host', () => {
    fs.writeFileSync(
      path.join(pkgDir, OUT_DIR, 'baseline.json'),
      JSON.stringify({history: {list: {GET: [100]}}, workloads: {}}),
    );

    expect(() => readBaseline(pkgDir)).to.throw(
      /baseline.json has no baseUrl and no uiUrl/,
    );
  });

  it('reads an empty baseline with no host', () => {
    fs.writeFileSync(
      path.join(pkgDir, OUT_DIR, 'baseline.json'),
      JSON.stringify({history: {}, workloads: {}}),
    );

    expect(readBaseline(pkgDir)).to.deepEqual({history: {}, workloads: {}});
  });

  it('stops at a baseline file with no workloads', () => {
    fs.writeFileSync(
      path.join(pkgDir, OUT_DIR, 'baseline.json'),
      JSON.stringify({history: {}}),
    );

    expect(() => readBaseline(pkgDir)).to.throw(
      /baseline.json has no history or no workloads/,
    );
  });

  for (const [name, file] of [
    ['a history that is a list', {history: [], workloads: {}}],
    ['workloads that are a list', {history: {}, workloads: []}],
  ] as Array<[string, object]>) {
    it(`stops at a baseline with ${name}`, () => {
      fs.writeFileSync(
        path.join(pkgDir, OUT_DIR, 'baseline.json'),
        JSON.stringify(file),
      );

      expect(() => readBaseline(pkgDir)).to.throw(
        /baseline.json has no history or no workloads/,
      );
    });
  }

  it('reads a baseline that has no baseUrl and no uiUrl', () => {
    fs.writeFileSync(
      path.join(pkgDir, OUT_DIR, 'baseline.json'),
      JSON.stringify({history: {}, workloads: {}}),
    );

    expect(readBaseline(pkgDir)).to.deepEqual({history: {}, workloads: {}});
  });

  it('stops at a baseline with a baseUrl or a uiUrl that is not a text', () => {
    for (const hosts of [
      {baseUrl: 5},
      {baseUrl: null},
      {baseUrl: 'http://api', uiUrl: 5},
    ]) {
      fs.writeFileSync(
        path.join(pkgDir, OUT_DIR, 'baseline.json'),
        JSON.stringify({history: {}, workloads: {}, ...hosts}),
      );

      expect(() => readBaseline(pkgDir)).to.throw(
        `${BASELINE_FILE} has a baseUrl or uiUrl that is not a text. Delete it, and record a new one.`,
      );
    }
  });

  it('stops at a baseline whose endpoints of a scenario are a list', () => {
    fs.writeFileSync(
      path.join(pkgDir, OUT_DIR, 'baseline.json'),
      JSON.stringify({history: {s: []}, workloads: {}}),
    );

    expect(() => readBaseline(pkgDir)).to.throw(
      /baseline.json has a history that is not a list of numbers/,
    );
  });

  it('stops at a baseline whose history has no list of numbers', () => {
    const bad = [
      {history: {s: {'GET /a': '12'}}, workloads: {s: 'w'}},
      {history: {s: {'GET /a': [1, 'x']}}, workloads: {s: 'w'}},
      {history: {s: {'GET /a': [null]}}, workloads: {s: 'w'}},
      {history: {s: 5}, workloads: {s: 'w'}},
      {history: {s: {'GET /a': [1]}}, workloads: {s: 7}},
    ];
    for (const baseline of bad) {
      fs.writeFileSync(
        path.join(pkgDir, OUT_DIR, 'baseline.json'),
        JSON.stringify(baseline),
      );

      expect(() => readBaseline(pkgDir)).to.throw(
        /baseline.json .*Delete it, and record a new one./,
      );
    }
  });

  it('writes the file whole, and leaves no temporary file of its own, and does not touch a file named baseline.json.tmp', () => {
    const run = {baseUrl: 'http://app', measured, failed: false, force: false};
    const sentinel = path.join(pkgDir, OUT_DIR, 'baseline.json.tmp');
    fs.mkdirSync(path.join(pkgDir, OUT_DIR), {recursive: true});
    fs.writeFileSync(sentinel, 'sentinel of another run');

    saveRun(pkgDir, run);

    expect(fs.readFileSync(sentinel, 'utf8')).to.equal(
      'sentinel of another run',
    );

    const file = path.join(pkgDir, OUT_DIR, 'baseline.json');
    expect(JSON.parse(fs.readFileSync(file, 'utf8')).workloads).to.deepEqual({
      s: 'w',
    });
    expect(fs.readdirSync(path.join(pkgDir, OUT_DIR)).sort()).to.deepEqual([
      'baseline.json',
      'baseline.json.tmp',
    ]);
  });

  it('leaves no .tmp file, and throws the error, when the rename fails', () => {
    // A folder in the place of the file makes the rename fail.
    const folder = path.join(pkgDir, OUT_DIR, 'baseline.json');
    fs.mkdirSync(folder);
    const run = {baseUrl: 'http://app', measured, failed: false, force: false};

    expect(() => saveRun(pkgDir, run)).to.throw(Error, {
      code: /^(EISDIR|ENOTDIR|EEXIST|EPERM)$/,
    });
    expect(fs.readdirSync(path.join(pkgDir, OUT_DIR))).to.deepEqual([
      'baseline.json',
    ]);
  });

  it('adds a failed run when forced', () => {
    const run = {baseUrl: 'http://app', measured, failed: true, force: true};

    expect(saveRun(pkgDir, run)).to.be.true();
    expect(readBaseline(pkgDir)?.history).to.deepEqual({s: {'GET /a': [14]}});
  });
});

describe('exceedsMax', () => {
  it('is true when the count is above the max', () => {
    expect(exceedsMax(heavy(3, 2))).to.be.true();
  });

  it('is false when the count is equal to the max', () => {
    expect(exceedsMax(heavy(2, 2))).to.be.false();
  });

  it('is false when the count is below the max', () => {
    expect(exceedsMax(heavy(1, 2))).to.be.false();
  });
});
