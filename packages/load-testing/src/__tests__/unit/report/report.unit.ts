// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {heavy, scenarioOf} from '../../helpers';
import {load} from '../../../scenario/builder';
import {resolveThresholds} from '../../../project/config';
import {failedScenario, judgeRun, judgeScenario} from '../../../report/report';
import type {LoadedScenario} from '../../../project/types';
import type {
  Baseline,
  ScenarioResult,
  ScenarioRun,
} from '../../../report/types';

const LIMITS = resolveThresholds({});
const WORKLOAD = '10 vusers/s for 10 s';
const LOADED: LoadedScenario = {
  scenario: scenarioOf('browse orders', [load.get('/orders')]),
  endpoints: new Map([['GET /orders', LIMITS]]),
};

const runWith = (change: Partial<ScenarioRun> = {}): ScenarioRun => ({
  endpoints: new Map([['GET /orders', {count: 100, failed: 0, p95: 30}]]),
  hookErrors: 0,
  vusers: {started: 100, completed: 100, failed: 0},
  seconds: 10,
  workload: WORKLOAD,
  problems: [],
  ...change,
});

/** A baseline with a mean p95 of 15 ms for `GET /orders`. */
const baselineWith = (workload: string): Baseline => ({
  baseUrl: 'http://app',
  recordedAt: '2026-10-05',
  history: {'browse orders': {'GET /orders': [10, 20]}},
  workloads: {'browse orders': workload},
});

const LIMITS_OF = {baseline: undefined, vuserLimits: LIMITS};

describe('judgeScenario', () => {
  it('compares p95 with the mean of the baseline, and gives the limit', () => {
    const {result} = judgeScenario(LOADED, runWith(), {
      baseline: baselineWith(WORKLOAD),
      vuserLimits: LIMITS,
    });

    // The limit is 15 ms plus the larger of 10 ms and 20% of 15 ms.
    expect(result.endpoints).to.deepEqual([
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
        note: undefined,
      },
    ]);
    expect(result.passed).to.be.false();
  });

  it('passes a good run, and notes that there is no baseline', () => {
    const {result, p95} = judgeScenario(LOADED, runWith(), LIMITS_OF);

    expect(result.passed).to.be.true();
    expect(result.endpoints[0].note).to.equal('no baseline');
    // With no baseline, the default cap is the limit.
    expect(result.endpoints[0].p95Limit).to.equal(500);
    expect(result.baselineNote).to.be.undefined();
    expect(result.vusers).to.deepEqual({
      started: 100,
      completed: 100,
      failed: 0,
      failedLimit: 1,
      failures: [],
    });
    expect(p95).to.deepEqual({'GET /orders': 30});
  });

  it('fails an endpoint over the default cap, also with no baseline', () => {
    const slow = new Map([['GET /orders', {count: 100, failed: 0, p95: 501}]]);

    const {result} = judgeScenario(
      LOADED,
      runWith({endpoints: slow}),
      LIMITS_OF,
    );

    expect(result.endpoints[0].failures).to.deepEqual([
      'p95 501 ms > limit 500 ms',
    ]);
    expect(result.endpoints[0].note).to.be.undefined();
    expect(result.passed).to.be.false();
  });

  it('does not compare p95 when the workload changed, and says why', () => {
    const {result} = judgeScenario(LOADED, runWith(), {
      baseline: baselineWith('3 vusers/s for 10 s'),
      vuserLimits: LIMITS,
    });

    expect(result.endpoints[0].baselineP95).to.be.undefined();
    expect(result.endpoints[0].note).to.equal('workload changed');
    expect(result.baselineNote).to.equal(
      'recorded with 3 vusers/s for 10 s, so p95 is not compared',
    );
    expect(result.passed).to.be.true();
  });

  it('fails when more vusers fail than the error rate allows', () => {
    const vusers = {started: 100, completed: 95, failed: 5};

    const {result} = judgeScenario(LOADED, runWith({vusers}), LIMITS_OF);

    expect(result.vusers.failures).to.deepEqual(['vuser failure rate 5% > 1%']);
    expect(result.passed).to.be.false();
  });

  it('fails when after or a cleanup failed, and says what', () => {
    const {result} = judgeScenario(
      LOADED,
      runWith({problems: ['cleanup failed: gone']}),
      LIMITS_OF,
    );

    expect(result.problems).to.deepEqual(['cleanup failed: gone']);
    expect(result.passed).to.be.false();
  });

  it('fails when a hook threw', () => {
    const {result} = judgeScenario(LOADED, runWith({hookErrors: 2}), LIMITS_OF);

    expect(result.hookErrors).to.equal(2);
    expect(result.passed).to.be.false();
  });

  it('gives no requests per second when no time was measured', () => {
    const {result} = judgeScenario(LOADED, runWith({seconds: 0}), LIMITS_OF);

    expect(result.endpoints[0].perSecond).to.be.undefined();
  });
});

describe('failedScenario', () => {
  it('gives a failed result with the message of the error', () => {
    const result = failedScenario('browse orders', new Error('boom'));

    expect(result.error).to.equal('boom');
    expect(result.passed).to.be.false();
    expect(result.endpoints).to.deepEqual([]);
  });
});

describe('judgeRun', () => {
  const rest = {
    skipped: [],
    coverage: {covered: 1, total: 2, specFile: 'src/openapi.json'},
    hasBaseline: false,
    stopped: false,
  };
  const passing = judgeScenario(LOADED, runWith(), LIMITS_OF).result;

  const judged = (scenarios: ScenarioResult[], count = 0, max = 0) =>
    judgeRun(scenarios, {...rest, heavyApis: heavy(count, max)});

  it('passes when every scenario passed', () => {
    expect(judged([passing]).passed).to.be.true();
  });

  it('fails when one scenario failed', () => {
    const failed = failedScenario('x', new Error('boom'));

    expect(judged([passing, failed]).passed).to.be.false();
  });

  it('puts the heavy APIs and the max in the result', () => {
    expect(judged([passing], 2, 2).heavyApis).to.deepEqual(heavy(2, 2));
  });

  it('fails when more endpoints are heavy than the max', () => {
    expect(judged([passing], 3, 2).passed).to.be.false();
    expect(judged([passing], 1, 0).passed).to.be.false();
  });

  it('passes when the heavy endpoints are as many as the max, or fewer', () => {
    expect(judged([passing], 2, 2).passed).to.be.true();
    expect(judged([passing], 1, 2).passed).to.be.true();
    expect(judged([passing], 0, 0).passed).to.be.true();
  });
});
