// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {loadScenarios} from '../../../project/loader';
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

    expect(() => loadScenarios(pkg, CONFIG)).to.throw(
      /a\.load\.js registers no scenario/,
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
