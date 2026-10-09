// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {consoleReporter} from '../../../report/console';
import {output} from '../../../output';
import type {RunResult, ScenarioResult} from '../../../report/types';

const SCENARIO: ScenarioResult = {
  name: 'browse orders',
  workload: '10 vusers/s for 10 s',
  vusers: {
    started: 100,
    completed: 100,
    failed: 0,
    failedLimit: 1,
    failures: [],
  },
  hookErrors: 0,
  problems: [],
  endpoints: [
    {
      id: 'GET /orders',
      requests: 100,
      perSecond: 10,
      p95: 30,
      p95Limit: 25,
      baselineP95: 15,
      errorRate: 0,
      errorRateLimit: 1,
      failures: ['p95 +100% (+15 ms) over baseline 15 ms'],
    },
    {
      id: 'GET /orders/{id}',
      requests: 50,
      p95: 8.26,
      p95Limit: 500,
      errorRate: 0,
      errorRateLimit: 1,
      failures: [],
      note: 'no baseline',
    },
  ],
  passed: false,
};

const RESULT: RunResult = {
  scenarios: [SCENARIO],
  skipped: ['later'],
  coverage: {covered: 2, total: 5, specFile: 'src/openapi.json'},
  hasBaseline: false,
  heavyApis: {max: 0, endpoints: []},
  passed: false,
  stopped: false,
};

async function linesOf(result: RunResult): Promise<string[]> {
  const text: string[] = [];
  const {out} = output;
  output.out = chunk => {
    text.push(chunk);
  };
  try {
    await consoleReporter().onRunEnd(result);
  } finally {
    output.out = out;
  }
  return text.join('').split('\n');
}

describe('consoleReporter', () => {
  it('has the name console', () => {
    expect(consoleReporter().name).to.equal('console');
  });

  it('prints the block, the table, the skipped scenarios, the coverage, the note and the legend', async () => {
    expect(await linesOf(RESULT)).to.deepEqual([
      '',
      'Results',
      '',
      'browse orders',
      'Workload: 10 vusers/s for 10 s',
      'Vusers:   100 started, 100 completed, 0 failed (limit 1%)',
      '',
      'Endpoint          Requests  Req/s  p95 ms (limit)  Base ms  Err % (limit)  Result',
      'GET /orders       100       10     30 (25)         15       0 (1)          FAIL: p95 +100% (+15 ms) over baseline 15 ms',
      'GET /orders/{id}  50        -      8.3 (500)       -        0 (1)          pass (no baseline)',
      '',
      'Skipped: later',
      '',
      'Coverage: 2 of 5 endpoints in src/openapi.json',
      'No src/__tests__/load/.out/baseline.json. Run once with LOAD_TESTS_UPDATE_BASELINE=1 to record it.',
      '',
      'A vuser is one virtual user. It runs the steps of a scenario one time. Failed means that its run stopped on an error.',
      '',
    ]);
  });

  it('prints the vuser failures, the hook errors, the problems and the baseline note', async () => {
    const scenario: ScenarioResult = {
      ...SCENARIO,
      vusers: {
        started: 100,
        completed: 95,
        failed: 5,
        failedLimit: 1,
        failures: ['vuser failure rate 5% > 1%'],
      },
      hookErrors: 2,
      problems: ['cleanup failed: gone'],
      baselineNote: 'recorded with 3 vusers/s for 10 s, so p95 is not compared',
    };

    const lines = await linesOf({...RESULT, scenarios: [scenario]});

    expect(lines).to.containEql(
      'Vusers:   100 started, 95 completed, 5 failed (FAIL: vuser failure rate 5% > 1%)',
    );
    expect(lines).to.containEql('Hooks:    2 error(s), not app errors (FAIL)');
    expect(lines).to.containEql('FAIL: cleanup failed: gone');
    expect(lines).to.containEql(
      'Baseline: recorded with 3 vusers/s for 10 s, so p95 is not compared',
    );
  });

  it('prints only the error of a scenario that threw, with no table', async () => {
    const scenario: ScenarioResult = {
      ...SCENARIO,
      error: 'boom',
      endpoints: [],
    };

    const lines = await linesOf({...RESULT, scenarios: [scenario]});

    expect(lines.slice(2, 6)).to.deepEqual([
      '',
      'browse orders',
      'FAIL: boom',
      '',
    ]);
  });

  it('prints no coverage and no baseline note when a signal stopped the run', async () => {
    const lines = await linesOf({...RESULT, stopped: true});

    expect(lines.join('\n')).to.not.match(/Coverage|No src/);
    expect(lines).to.containEql('Skipped: later');
  });

  it('prints no baseline note when there is a baseline', async () => {
    const lines = await linesOf({...RESULT, hasBaseline: true});

    expect(lines.join('\n')).to.not.match(/No src/);
  });

  describe('heavy APIs', () => {
    const POST = {id: 'POST /order-items/bulk', p95: 5000};
    const PATCH = {id: 'PATCH /orders/{id}', p95: 5000};
    const withHeavy = (max: number, endpoints = [POST, PATCH]): RunResult => ({
      ...RESULT,
      heavyApis: {max, endpoints},
    });

    it('prints the block after the coverage line, with the ids padded', async () => {
      const lines = await linesOf(withHeavy(2));

      const at = lines.findIndex(line => line.startsWith('Heavy APIs:'));
      expect(lines[at - 1]).to.equal('');
      expect(lines.slice(at, at + 3)).to.deepEqual([
        'Heavy APIs: 2 of at most 2 (maxHeavyApis in config.ts). A heavy API has a p95 limit above 1000 ms.',
        '  POST /order-items/bulk  5000 ms',
        '  PATCH /orders/{id}      5000 ms',
      ]);
      expect(lines.join('\n')).to.not.match(/FAIL: \d|Note:/);
    });

    it('prints the FAIL line when more endpoints are heavy than the max', async () => {
      const lines = await linesOf(withHeavy(1));

      expect(lines).to.containEql(
        'FAIL: 2 heavy APIs, but maxHeavyApis is 1. Lower the p95 limit of an endpoint to 1000 ms or less, or raise maxHeavyApis in config.ts.',
      );
    });

    it('says "1 heavy API" for one endpoint over a max of 0', async () => {
      const lines = await linesOf(withHeavy(0, [POST]));

      expect(lines).to.containEql(
        'Heavy APIs: 1 of at most 0 (maxHeavyApis in config.ts). A heavy API has a p95 limit above 1000 ms.',
      );
      expect(lines).to.containEql(
        'FAIL: 1 heavy API, but maxHeavyApis is 0. Lower the p95 limit of an endpoint to 1000 ms or less, or raise maxHeavyApis in config.ts.',
      );
    });

    it('prints a note when the max is higher than the count', async () => {
      expect(await linesOf(withHeavy(3))).to.containEql(
        'Note: maxHeavyApis is 3, but 2 endpoints are heavy. Lower maxHeavyApis in config.ts.',
      );
      expect(await linesOf(withHeavy(2, [POST]))).to.containEql(
        'Note: maxHeavyApis is 2, but 1 endpoint is heavy. Lower maxHeavyApis in config.ts.',
      );
    });

    it('prints only a note when the max is above 0 and no endpoint is heavy', async () => {
      const lines = await linesOf(withHeavy(2, []));

      expect(lines).to.containEql(
        'Note: maxHeavyApis is 2, but no endpoint is heavy. Lower maxHeavyApis in config.ts.',
      );
      expect(lines.join('\n')).to.not.match(/Heavy APIs:|FAIL: \d/);
    });

    it('prints nothing when the max is 0 and no endpoint is heavy', async () => {
      expect((await linesOf(RESULT)).join('\n')).to.not.match(
        /Heavy|maxHeavyApis/,
      );
    });

    it('prints nothing about heavy APIs when a signal stopped the run', async () => {
      const lines = await linesOf({...withHeavy(1), stopped: true});

      expect(lines.join('\n')).to.not.match(/Heavy|maxHeavyApis/);
    });
  });
});
