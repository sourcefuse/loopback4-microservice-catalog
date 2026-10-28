// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {loadScenarios} from '../../../project/loader';
import {chromium} from '../../../engine/artillery/browsers';
import {labelOf} from '../../../scenario/label';
import {ScenarioError} from '../../../errors';

const PHASES = [{duration: 60, arrivalRate: 10}];

describe('loadScenarios', () => {
  const CONFIG = {phases: PHASES, thresholds: {default: {}}};
  const builder = JSON.stringify(
    path.join(__dirname, '../../../scenario/builder'),
  );
  let pkg: string;

  beforeEach(() => {
    pkg = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-pkg-'));
  });
  afterEach(() => fs.rmSync(pkg, {recursive: true}));

  function write(file: string, content = '') {
    const target = path.join(pkg, file);
    fs.mkdirSync(path.dirname(target), {recursive: true});
    fs.writeFileSync(target, content);
  }

  /** Source of a built file that registers one scenario with one request. */
  const built = (name: string, options = '{}') =>
    `const {load} = require(${builder});
load.it('${name}', [load.get('/${name}', ${options})]);`;

  const labels = () => loadScenarios(pkg, CONFIG).map(l => labelOf(l.scenario));

  it('stops with a ScenarioError when the package has no scenario folder', () => {
    const folder = path.join(pkg, 'src', '__tests__', 'load');

    expect(() => labels()).to.throw(
      new ScenarioError(`No ${folder}. Add at least one *.load.ts file.`),
    );
  });

  it('stops with a ScenarioError when the scenario folder has no *.load.ts file', () => {
    write('src/__tests__/load/config.ts');
    write('src/__tests__/load/helper.load.js');
    const folder = path.join(pkg, 'src', '__tests__', 'load');

    expect(() => labels()).to.throw(
      new ScenarioError(`No *.load.ts file in ${folder}`),
    );
  });

  it('loads the built file of each source file, in file-name order', () => {
    write('src/__tests__/load/b.load.ts');
    write('src/__tests__/load/a.load.ts');
    write('dist/__tests__/load/b.load.js', built('b'));
    write('dist/__tests__/load/a.load.js', built('a'));

    expect(labels()).to.deepEqual(['a', 'b']);
  });

  it('loads a file from a subfolder, and not the other files next to it', () => {
    const notLoaded = `throw new Error('a file that is not a load file was loaded');`;
    write('src/__tests__/load/orders/order.load.ts');
    write('src/__tests__/load/fixtures/order.ts');
    write('src/__tests__/load/fixtures/run.ts');
    write('dist/__tests__/load/orders/order.load.js', built('order'));
    write('dist/__tests__/load/fixtures/order.js', notLoaded);
    write('dist/__tests__/load/fixtures/run.js', notLoaded);

    expect(labels()).to.deepEqual(['order']);
  });

  it('takes every scenario that a file registers, in the order of the calls', () => {
    write('src/__tests__/load/orders.load.ts');
    write(
      'dist/__tests__/load/orders.load.js',
      `const {load} = require(${builder});
load.describe('OrderController', () => {
load.it('lists orders', [load.get('/orders')]);
load.it.skip('links an order', [load.post('/orders')]);
});`,
    );

    const scenarios = loadScenarios(pkg, CONFIG).map(l => l.scenario);

    expect(scenarios.map(labelOf)).to.deepEqual([
      'OrderController › lists orders',
      'OrderController › links an order',
    ]);
    expect(scenarios.map(s => s.skip)).to.deepEqual([undefined, true]);
  });

  it('stops when a request has a threshold that is out of range', () => {
    write('src/__tests__/load/a.load.ts');
    write(
      'dist/__tests__/load/a.load.js',
      built('a', '{errorRate: 150, p95: -5}'),
    );

    expect(labels).to.throw({
      name: 'ScenarioError',
      message:
        /GET \/a: p95 must be 0 or more\n\s+GET \/a: errorRate must be from 0 to 100/,
    });
  });

  it('stops when a plain string has "{{", also in a nested step, with the scenario named', () => {
    write('src/__tests__/load/a.load.ts');
    write(
      'dist/__tests__/load/a.load.js',
      `const {load} = require(${builder});
load.it('orders', [
  load.post('/orders', {json: {name: '{{ x }}'}}),
  load.step({loop: [load.get('/b', {query: {q: '{{ y }}'}})], count: 2}),
]);`,
    );

    expect(() => labels()).to.throw(
      new ScenarioError('Scenario orders:', [
        'POST /orders: json.name contains "{{": use template`...`',
        'GET /b: query.q contains "{{": use template`...`',
      ]),
    );
  });

  it('does not load a built file that has no source file', () => {
    write('src/__tests__/load/a.load.ts');
    write('dist/__tests__/load/a.load.js', built('a'));
    write(
      'dist/__tests__/load/gone.load.js',
      `throw new Error('built file without source loaded');`,
    );

    expect(labels()).to.deepEqual(['a']);
  });

  it('tells to build when the built file is missing', () => {
    write('src/__tests__/load/a.load.ts');

    expect(() => loadScenarios(pkg, CONFIG)).to.throw(
      /No dist\/__tests__\/load\/a\.load\.js\. Run npm run build\./,
    );
  });

  it('rejects a file that registers no scenario', () => {
    write('src/__tests__/load/a.load.ts');
    write('dist/__tests__/load/a.load.js', `exports.default = {};`);

    const file = path.join(pkg, 'dist/__tests__/load/a.load.js');
    expect(() => loadScenarios(pkg, CONFIG)).to.throw(
      `${file} registers no scenario. Add a load.it(...) or load.browser(...) call to it. If it has one, two copies of @sourceloop/load-testing are installed.`,
    );
  });

  it('rejects two scenarios whose names make the same file name', () => {
    write('src/__tests__/load/a.load.ts');
    write(
      'dist/__tests__/load/a.load.js',
      `const {load} = require(${builder});
load.it('Lists orders', [load.get('/a')]);
load.it('lists  orders!', [load.get('/b')]);`,
    );

    expect(() => loadScenarios(pkg, CONFIG)).to.throw(
      'Two scenarios have the same name: "Lists orders" and "lists  orders!"',
    );
  });

  ['baseline', 'Baseline!'].forEach(name => {
    it(`rejects the scenario name "${name}": the baseline file uses it`, () => {
      write('src/__tests__/load/a.load.ts');
      write(
        'dist/__tests__/load/a.load.js',
        `const {load} = require(${builder});
load.it(${JSON.stringify(name)}, [load.get('/a')]);`,
      );

      expect(() => loadScenarios(pkg, CONFIG)).to.throw(
        `The scenario name "${name}" gives the file name "baseline", which the baseline file uses. Rename the scenario.`,
      );
    });
  });

  it('loads a scenario whose name only starts with baseline', () => {
    write('src/__tests__/load/a.load.ts');
    write(
      'dist/__tests__/load/a.load.js',
      `const {load} = require(${builder});
load.it('baseline orders', [load.get('/a')]);`,
    );

    expect(loadScenarios(pkg, CONFIG)).to.have.length(1);
  });

  it('gives the requests inside raw steps an endpoint and its thresholds', () => {
    write('src/__tests__/load/n.load.ts');
    write(
      'dist/__tests__/load/n.load.js',
      `const {load} = require(${builder});
load.it('n', [
load.step({loop: [load.get('/a'), load.post('/b', {p95: 250})], count: 2}),
]);`,
    );

    const [loaded] = loadScenarios(pkg, CONFIG);

    expect([...loaded.endpoints.keys()]).to.deepEqual(['GET /a', 'POST /b']);
    expect(loaded.endpoints.get('POST /b')?.p95).to.equal(250);
  });

  it('gives the requests of a parallel group an endpoint and its thresholds', () => {
    write('src/__tests__/load/n.load.ts');
    write(
      'dist/__tests__/load/n.load.js',
      `const {load} = require(${builder});
load.it('n', [load.parallel([load.get('/a'), load.post('/b', {p95: 250})])]);`,
    );

    const [loaded] = loadScenarios(pkg, CONFIG);

    expect([...loaded.endpoints.keys()]).to.deepEqual(['GET /a', 'POST /b']);
    expect(loaded.endpoints.get('POST /b')?.p95).to.equal(250);
  });

  it('rejects the phases of a scenario that are wrong, with the scenario named', () => {
    write('src/__tests__/load/n.load.ts');
    write(
      'dist/__tests__/load/n.load.js',
      `const {load} = require(${builder});
load.it('n', [load.get('/n')], {phases: [{duration: 0, arrivalRate: 1}]});`,
    );

    expect(() => loadScenarios(pkg, CONFIG)).to.throw({
      name: 'ScenarioError',
      message:
        /Scenario n:\n\s+phases\[0\].duration must be a whole number above 0, or a text such as "1m"/,
    });
  });

  it('accepts the phases of a scenario that are good', () => {
    write('src/__tests__/load/n.load.ts');
    write(
      'dist/__tests__/load/n.load.js',
      `const {load} = require(${builder});
load.it('n', [load.get('/n')], {phases: [{pause: 5}, {duration: 1, arrivalRate: 1}]});`,
    );

    expect(labels()).to.deepEqual(['n']);
  });

  it('uses the library default when the config has no thresholds', () => {
    write('src/__tests__/load/n.load.ts');
    write('dist/__tests__/load/n.load.js', built('n'));

    const [loaded] = loadScenarios(pkg, {phases: PHASES});

    expect(loaded.endpoints.get('GET /n')).to.deepEqual({
      p95Regression: 20,
      minDelta: 10,
      errorRate: 1,
      p95: 500,
    });
  });

  it('lets the endpoint beat the package, and the package beat the library', () => {
    write('src/__tests__/load/n.load.ts');
    write('dist/__tests__/load/n.load.js', built('n', '{p95: 250}'));

    const [loaded] = loadScenarios(pkg, {
      phases: PHASES,
      thresholds: {default: {p95: 300, errorRate: 5}},
    });

    expect(loaded.endpoints.get('GET /n')).to.deepEqual({
      p95Regression: 20,
      minDelta: 10,
      errorRate: 5,
      p95: 250,
    });
  });

  describe('thresholds order', () => {
    /** One file: a describe, a scenario and a request, with these options. */
    function writeLayers(
      describeLimits: string,
      itLimits: string,
      req: string,
    ) {
      write('src/__tests__/load/n.load.ts');
      write(
        'dist/__tests__/load/n.load.js',
        `const {load} = require(${builder});
load.describe('g', {thresholds: ${describeLimits}}, () => {
  load.it('n', [load.get('/n', ${req})], {thresholds: ${itLimits}});
});`,
      );
    }
    const p95Of = (config = CONFIG) => {
      // The file is rewritten for each case, and `require` caches it.
      delete require.cache[path.join(pkg, 'dist/__tests__/load/n.load.js')];
      return loadScenarios(pkg, config)[0].endpoints.get('GET /n')?.p95;
    };

    it('goes library, config, describe, it, request: each beats the one before', () => {
      const config = {phases: PHASES, thresholds: {default: {p95: 1}}};
      writeLayers('{}', '{}', '{}');
      expect(p95Of(config)).to.equal(1);
      expect(p95Of(CONFIG)).to.equal(500);

      writeLayers('{p95: 2}', '{}', '{}');
      expect(p95Of(config)).to.equal(2);

      writeLayers('{p95: 2}', '{p95: 3}', '{}');
      expect(p95Of(config)).to.equal(3);

      writeLayers('{p95: 2}', '{p95: 3}', '{p95: 4}');
      expect(p95Of(config)).to.equal(4);
    });

    it('merges the layers by field', () => {
      writeLayers('{errorRate: 7}', '{minDelta: 2}', '{p95: 4}');

      expect(
        loadScenarios(pkg, CONFIG)[0].endpoints.get('GET /n'),
      ).to.deepEqual({
        p95Regression: 20,
        minDelta: 2,
        errorRate: 7,
        p95: 4,
      });
    });

    it('stops when the thresholds of a scenario are out of range', () => {
      writeLayers('{errorRate: 150}', '{p95: -1}', '{}');

      expect(() => loadScenarios(pkg, CONFIG)).to.throw({
        name: 'ScenarioError',
        message:
          /Scenario g › n:\n\s+thresholds.p95 must be 0 or more\n\s+thresholds.errorRate must be from 0 to 100/,
      });
    });
  });

  describe('browsers', () => {
    const firefox = {
      name: 'firefox',
      engine: 'playwright-firefox',
      vitals: ['FCP', 'LCP', 'TTFB'] as const,
    };

    function writeBrowserAndHttp() {
      write('src/__tests__/load/b.load.ts');
      write(
        'dist/__tests__/load/b.load.js',
        `const {load} = require(${builder});
load.it('api', [load.get('/api')]);
load.browser('open', {vitals: {CLS: {p95: 0.2}}}, async () => {});`,
      );
    }

    it('runs a browser scenario in chromium only by default, and names it after the browser', () => {
      writeBrowserAndHttp();

      const [api, open] = loadScenarios(pkg, CONFIG);

      expect(labelOf(api.scenario)).to.equal('api');
      expect(labelOf(open.scenario)).to.equal('open › chromium');
      expect(open.scenario.browser).to.containEql({
        browserName: 'chromium',
        registeredLabel: 'open',
      });
    });

    it('runs a browser scenario once in each browser, in the order of the list, and leaves an HTTP scenario alone', () => {
      writeBrowserAndHttp();
      const config = {...CONFIG, artillery: {browsers: [chromium(), firefox]}};

      expect(loadScenarios(pkg, config).map(l => labelOf(l.scenario))).to.eql([
        'api',
        'open › chromium',
        'open › firefox',
      ]);
    });

    it('leaves out the limit of a Web Vital that the browser does not report', () => {
      writeBrowserAndHttp();
      const config = {...CONFIG, artillery: {browsers: [chromium(), firefox]}};

      const [, inChromium, inFirefox] = loadScenarios(pkg, config);

      expect(Object.keys(inChromium.browser?.vitals ?? {})).to.eql([
        'FCP',
        'LCP',
        'CLS',
        'TTFB',
      ]);
      expect(Object.keys(inFirefox.browser?.vitals ?? {})).to.eql([
        'FCP',
        'LCP',
        'TTFB',
      ]);
    });
  });

  describe('limits of a browser scenario', () => {
    const MS = {p95Regression: 20, minDelta: 10};

    /** One file with one browser scenario, in a describe with these options. */
    function writeBrowser(describeOptions: string, browserOptions: string) {
      write('src/__tests__/load/b.load.ts');
      write(
        'dist/__tests__/load/b.load.js',
        `const {load} = require(${builder});
load.describe('dashboard', ${describeOptions}, () => {
  load.browser('open', ${browserOptions}, async () => {});
});`,
      );
    }

    it('gives a step 1.5 s and turns on every Web Vital but INP, when no level sets a limit', () => {
      writeBrowser('{}', '{}');

      const [loaded] = loadScenarios(pkg, CONFIG);

      expect(loaded.browser).to.deepEqual({
        step: {...MS, p95: 1500},
        steps: {},
        vitals: {
          FCP: {...MS, p95: 1800},
          LCP: {...MS, p95: 2500},
          CLS: {p95Regression: 20, minDelta: 0.1, p95: 0.1},
          TTFB: {...MS, p95: 800},
        },
      });
      expect(loaded.endpoints.size).to.equal(0);
    });

    it('tells the scenario which built file registers it, so a worker can load its flow', () => {
      writeBrowser('{}', '{}');

      const [loaded] = loadScenarios(pkg, CONFIG);

      expect(loaded.scenario.browser?.file).to.equal(
        path.join(pkg, 'dist/__tests__/load/b.load.js'),
      );
    });

    it('merges library, config, describe, scenario and one metric by field', () => {
      const config = {
        phases: PHASES,
        thresholds: {
          step: {p95: 2000},
          vitals: {LCP: {p95: 3000}, CLS: {minDelta: 0.2}},
        },
      };
      writeBrowser(
        '{step: {p95Regression: 30}, vitals: {INP: {}}}',
        `{
          step: {minDelta: 20},
          vitals: {LCP: {p95Regression: 50}},
          steps: {loadDashboard: {p95: 5000}},
          flow: {p95: 8000},
        }`,
      );

      const [loaded] = loadScenarios(pkg, config);

      const step = {p95: 2000, p95Regression: 30, minDelta: 20};
      expect(loaded.browser).to.deepEqual({
        step,
        steps: {loadDashboard: {...step, p95: 5000}},
        vitals: {
          FCP: {...MS, p95: 1800},
          LCP: {p95: 3000, p95Regression: 50, minDelta: 10},
          CLS: {p95: 0.1, p95Regression: 20, minDelta: 0.2},
          TTFB: {...MS, p95: 800},
          INP: {...MS, p95: 200},
        },
        flow: {...step, p95: 8000},
      });
    });

    it('stops when a browser limit is out of range, with the scenario named', () => {
      writeBrowser(
        '{step: {p95: -1}}',
        '{vitals: {LCP: {minDelta: -1}}, steps: {save: {p95: -1}}, flow: {p95Regression: -1}}',
      );

      expect(() => loadScenarios(pkg, CONFIG)).to.throw({
        name: 'ScenarioError',
        message:
          /Scenario dashboard › open:\n\s+step.p95 must be 0 or more\n\s+vitals.LCP.minDelta must be 0 or more\n\s+steps.save.p95 must be 0 or more\n\s+flow.p95Regression must be 0 or more/,
      });
    });
  });

  describe('names that a browser limit does not know', () => {
    const NOT_METRIC =
      'is not a limit of a metric: use p95Regression, minDelta, p95';

    it('stops when a describe or a scenario sets errorRate in a limit of a metric', () => {
      write('src/__tests__/load/b.load.ts');
      write(
        'dist/__tests__/load/b.load.js',
        `const {load} = require(${builder});
load.describe('d', {step: {errorRate: 1}, vitals: {CLS: {errorRate: 1}}}, () => {
  load.browser(
    'open',
    {steps: {save: {errorRate: 1}}, flow: {errorRate: 1}},
    async () => {},
  );
});`,
      );

      expect(() => labels()).to.throw(
        new ScenarioError('Scenario d › open:', [
          `step.errorRate ${NOT_METRIC}`,
          `vitals.CLS.errorRate ${NOT_METRIC}`,
          `steps.save.errorRate ${NOT_METRIC}`,
          `flow.errorRate ${NOT_METRIC}`,
        ]),
      );
    });

    it('stops when a describe or a scenario sets a limit that is not an object', () => {
      write('src/__tests__/load/b.load.ts');
      write(
        'dist/__tests__/load/b.load.js',
        `const {load} = require(${builder});
load.describe('d', {step: 5}, () => {
  load.browser(
    'open',
    {vitals: {LCP: 3000}, steps: {save: 3000}, flow: 5},
    async () => {},
  );
});`,
      );
      const NOT_OBJECT = 'must be an object of limits, for example {p95: 3000}';

      expect(() => labels()).to.throw(
        new ScenarioError('Scenario d › open:', [
          `step ${NOT_OBJECT}`,
          `vitals.LCP ${NOT_OBJECT}`,
          `steps.save ${NOT_OBJECT}`,
          `flow ${NOT_OBJECT}`,
        ]),
      );
    });

    it('stops when a limit of a scenario is 0, null, false or an empty text', () => {
      write('src/__tests__/load/b.load.ts');
      write(
        'dist/__tests__/load/b.load.js',
        `const {load} = require(${builder});
load.browser(
  'open',
  {flow: 0, vitals: null, step: false, steps: ''},
  async () => {},
);`,
      );

      expect(() => labels()).to.throw(
        new ScenarioError('Scenario open:', [
          'step must be an object of limits, for example {p95: 3000}',
          'vitals must be an object of limits, for example {LCP: {p95: 2500}}',
          'steps must be an object of limits, for example {save: {p95: 3000}}',
          'flow must be an object of limits, for example {p95: 3000}',
        ]),
      );
    });

    it('stops when the vitals or the steps of a scenario are not an object', () => {
      write('src/__tests__/load/b.load.ts');
      write(
        'dist/__tests__/load/b.load.js',
        `const {load} = require(${builder});
load.browser('open', {vitals: 5, steps: 5}, async () => {});`,
      );

      expect(() => labels()).to.throw(
        new ScenarioError('Scenario open:', [
          'vitals must be an object of limits, for example {LCP: {p95: 2500}}',
          'steps must be an object of limits, for example {save: {p95: 3000}}',
        ]),
      );
    });

    it('stops when a describe or a scenario names a Web Vital that does not exist', () => {
      write('src/__tests__/load/b.load.ts');
      write(
        'dist/__tests__/load/b.load.js',
        `const {load} = require(${builder});
load.describe('d', {vitals: {lcp: {p95: 1}}}, () => {
  load.browser('open', {vitals: {INP2: {p95: 1}}}, async () => {});
});`,
      );

      expect(() => labels()).to.throw(
        new ScenarioError('Scenario d › open:', [
          'vitals.lcp is not a Web Vital: use one of FCP, LCP, CLS, TTFB, INP',
          'vitals.INP2 is not a Web Vital: use one of FCP, LCP, CLS, TTFB, INP',
        ]),
      );
    });
  });

  it('stops when a browser scenario has no flow function', () => {
    write('src/__tests__/load/b.load.ts');
    write(
      'dist/__tests__/load/b.load.js',
      `const {load} = require(${builder});
load.browser('open', {});`,
    );

    expect(() => labels()).to.throw(
      new ScenarioError('Scenario open:', [
        'flow must be a function: load.browser(name, async ({page, step}) => {...})',
      ]),
    );
  });

  it('lets the TypeError of load.browser for an unknown option out of the file', () => {
    write('src/__tests__/load/b.load.ts');
    write(
      'dist/__tests__/load/b.load.js',
      `const {load} = require(${builder});
load.browser('open', {beforeEach: () => ({})}, async () => {});`,
    );

    expect(() => labels()).to.throw(TypeError, {
      message:
        'load.browser: beforeEach is not an option: use one of phases, step, steps, flow, vitals, before, after',
    });
  });

  it('stops with the missing flow when load.browser has no options and no flow', () => {
    write('src/__tests__/load/b.load.ts');
    write(
      'dist/__tests__/load/b.load.js',
      `const {load} = require(${builder});
load.browser('open');`,
    );

    expect(() => labels()).to.throw(
      new ScenarioError('Scenario open:', [
        'flow must be a function: load.browser(name, async ({page, step}) => {...})',
      ]),
    );
  });

  it('stops when a plain string in the headers of a scenario has "{{"', () => {
    write('src/__tests__/load/a.load.ts');
    write(
      'dist/__tests__/load/a.load.js',
      `const {load} = require(${builder});
load.describe('g', {headers: {a: '{{ x }}'}}, () => {
  load.it('n', [load.get('/n')]);
});`,
    );

    expect(() => labels()).to.throw(
      new ScenarioError('Scenario g › n:', [
        'headers.a contains "{{": use template`...`',
      ]),
    );
  });
});
