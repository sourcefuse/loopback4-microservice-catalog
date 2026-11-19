// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {heavy, scenarioOf} from '../../helpers';
import {load} from '../../../scenario/builder';
import {resolveThresholds} from '../../../project/config';
import {failedScenario, judgeRun, judgeScenario} from '../../../report/report';
import type {BrowserLimits, LoadedScenario} from '../../../project/types';
import type {
  MetricStats,
  ScenarioResult,
  ScenarioRun,
} from '../../../report/types';

const LIMITS = resolveThresholds({});
const WORKLOAD = '10 vusers/s for 10 s';
const LOADED: LoadedScenario = {
  scenario: scenarioOf('browse orders', [load.get('/orders')]),
  source: 's.load.ts',
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

describe('judgeScenario', () => {
  it('judges a good run, and gives the limit', () => {
    const result = judgeScenario(LOADED, runWith(), LIMITS);

    expect(result.passed).to.be.true();
    expect(result.endpoints).to.deepEqual([
      {
        id: 'GET /orders',
        requests: 100,
        perSecond: 10,
        p95: 30,
        p95Limit: 500,
        errorRate: 0,
        errorRateLimit: 1,
        failures: [],
      },
    ]);
    expect(result.vusers).to.deepEqual({
      started: 100,
      completed: 100,
      failed: 0,
      failedLimit: 1,
      failures: [],
    });
  });

  it('fails an endpoint over the default cap', () => {
    const slow = new Map([['GET /orders', {count: 100, failed: 0, p95: 501}]]);

    const result = judgeScenario(LOADED, runWith({endpoints: slow}), LIMITS);

    expect(result.endpoints[0].failures).to.deepEqual([
      'p95 501 ms > limit 500 ms',
    ]);
    expect(result.passed).to.be.false();
  });

  it('fails when more vusers fail than the error rate allows', () => {
    const vusers = {started: 100, completed: 95, failed: 5};

    const result = judgeScenario(LOADED, runWith({vusers}), LIMITS);

    expect(result.vusers.failures).to.deepEqual(['vuser failure rate 5% > 1%']);
    expect(result.passed).to.be.false();
  });

  it('fails when after or a cleanup failed, and says what', () => {
    const result = judgeScenario(
      LOADED,
      runWith({problems: ['cleanup failed: gone']}),
      LIMITS,
    );

    expect(result.problems).to.deepEqual(['cleanup failed: gone']);
    expect(result.passed).to.be.false();
  });

  it('fails when a hook threw', () => {
    const result = judgeScenario(LOADED, runWith({hookErrors: 2}), LIMITS);

    expect(result.hookErrors).to.equal(2);
    expect(result.passed).to.be.false();
  });

  it('gives no requests per second when no time was measured', () => {
    const result = judgeScenario(LOADED, runWith({seconds: 0}), LIMITS);

    expect(result.endpoints[0].perSecond).to.be.undefined();
  });
});

describe('judgeScenario of a browser scenario', () => {
  const STEP = {p95: 1500};
  const NO_VITALS: BrowserLimits = {step: STEP, steps: {}, vitals: {}};

  const loadedWith = (browser: BrowserLimits): LoadedScenario => ({
    scenario: scenarioOf('open dashboard', []),
    source: 's.load.ts',
    endpoints: new Map(),
    browser,
  });
  /** A run of 100 vusers that all completed, with these browser metrics. */
  const browserRun = (metrics: Record<string, MetricStats>): ScenarioRun =>
    runWith({endpoints: new Map(), metrics: new Map(Object.entries(metrics))});

  it('fails a step whose p95 is above its limit', () => {
    const run = browserRun({
      'browser.step.load_dashboard': {count: 100, p95: 812.5},
    });
    const judged = (p95: number) =>
      judgeScenario(
        loadedWith({...NO_VITALS, step: {...STEP, p95}}),
        run,
        LIMITS,
      );

    expect(judged(500).metrics).to.deepEqual([
      {
        name: 'browser.step.load_dashboard',
        samples: 100,
        p95: 812.5,
        unit: 'ms',
        p95Limit: 500,
        failures: ['p95 812.5 ms > limit 500 ms'],
      },
    ]);
    expect(judged(500).passed).to.be.false();
    expect(judged(1000).metrics[0].failures).to.deepEqual([]);
    expect(judged(1000).passed).to.be.true();
  });

  it('keeps the mark of a step that took the time of its whole action', () => {
    const run = browserRun({
      'browser.step.save': {count: 100, p95: 889, wallClock: true},
    });

    const {metrics} = judgeScenario(loadedWith(NO_VITALS), run, LIMITS);

    expect(metrics.map(({name, wallClock}) => [name, wallClock])).to.deepEqual([
      ['browser.step.save', true],
    ]);
  });

  it('fails a step that `steps` names and the report does not have', () => {
    const limits = {...NO_VITALS, steps: {openFilter: STEP}};

    const result = judgeScenario(loadedWith(limits), browserRun({}), LIMITS);

    expect(result.metrics).to.containDeep([
      {name: 'browser.step.openFilter', samples: 0, failures: ['no samples']},
    ]);
    expect(result.metrics).to.have.length(1);
    expect(result.passed).to.be.false();
  });

  it('gives a step that `steps` names its own limit', () => {
    const limits = {
      step: {...STEP, p95: 500},
      steps: {loadDashboard: {...STEP, p95: 5000}},
      vitals: {},
    };
    const run = browserRun({
      'browser.step.loadDashboard': {count: 100, p95: 812.5},
    });

    const result = judgeScenario(loadedWith(limits), run, LIMITS);

    expect(result.metrics).to.containDeep([
      {name: 'browser.step.loadDashboard', p95Limit: 5000, failures: []},
    ]);
    expect(result.metrics).to.have.length(1);
  });

  it('fails a Web Vital with fewer samples than completed vusers', () => {
    const limits = {...NO_VITALS, vitals: {LCP: {...STEP, p95: 2500}}};
    const run = browserRun({
      'browser.page.LCP.open dashboard': {count: 99, p95: 900},
    });

    const result = judgeScenario(loadedWith(limits), run, LIMITS);

    expect(result.metrics).to.containDeep([
      {
        name: 'browser.page.LCP.open dashboard',
        samples: 99,
        failures: ['lost samples: 99 for 100 completed vusers'],
      },
    ]);
    expect(result.metrics).to.have.length(1);
  });

  it('shows the flow total with no limit, and gates it when `flow` sets one', () => {
    const run = browserRun({
      'browser.flow.open dashboard': {count: 99, p95: 3200},
    });
    const judged = (limits: BrowserLimits) =>
      judgeScenario(loadedWith(limits), run, LIMITS);

    expect(judged(NO_VITALS).metrics).to.deepEqual([
      {
        name: 'browser.flow.open dashboard',
        samples: 99,
        p95: 3200,
        unit: 'ms',
        p95Limit: undefined,
        failures: [],
      },
    ]);
    expect(judged(NO_VITALS).passed).to.be.true();
    expect(
      judged({...NO_VITALS, flow: {...STEP, p95: 3000}}).metrics[0].failures,
    ).to.deepEqual([
      'lost samples: 99 for 100 completed vusers',
      'p95 3200 ms > limit 3000 ms',
    ]);
  });

  it('gives CLS no unit', () => {
    const name = 'browser.page.CLS.open dashboard';

    const result = judgeScenario(
      loadedWith({...NO_VITALS, vitals: {CLS: {p95: 0.25}}}),
      browserRun({[name]: {count: 100, p95: 0.3}}),
      LIMITS,
    );

    expect(result.metrics).to.containDeep([
      {name, unit: '', p95Limit: 0.25, failures: ['p95 0.3 > limit 0.25']},
    ]);
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
    stopped: false,
  };
  const passing = judgeScenario(LOADED, runWith(), LIMITS);

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
