// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {output} from '../../../output';
import {prepare} from '../../../run/prepare';

describe('prepare', () => {
  const ENV = {LOAD_TESTS_BASE_URL: 'http://localhost:4014'};
  const builder = JSON.stringify(
    path.join(__dirname, '../../../scenario/builder'),
  );
  let pkg: string;
  let printed: string;
  const realOut = output.out;

  beforeEach(() => {
    pkg = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-prepare-'));
    printed = '';
    output.out = text => {
      printed += text;
    };
  });
  afterEach(() => {
    output.out = realOut;
    fs.rmSync(pkg, {recursive: true});
  });

  function write(file: string, content = '') {
    const target = path.join(pkg, file);
    fs.mkdirSync(path.dirname(target), {recursive: true});
    fs.writeFileSync(target, content);
  }

  /** A package with a config, a spec and one built file with the scenarios. */
  function packageWith(scenarios: string, defaults = '{}') {
    write('src/__tests__/load/config.ts');
    write(
      'dist/__tests__/load/config.js',
      `exports.default = {phases: [{duration: 5, arrivalRate: 1}], thresholds: {default: ${defaults}}};`,
    );
    write('src/__tests__/load/a.load.ts');
    write(
      'dist/__tests__/load/a.load.js',
      `const {load} = require(${builder});\n${scenarios}`,
    );
    write(
      'src/openapi.json',
      JSON.stringify({paths: {'/a': {get: {}}, '/b': {get: {}}}}),
    );
  }

  it('says how many scenarios run when one has .only', async () => {
    packageWith(`load.it('one', [load.get('/a')]);
load.it.only('two', [load.get('/b')]);`);

    const prepared = await prepare(pkg, ENV);

    expect(prepared.scenarios).to.have.length(1);
    expect(prepared.skipped.map(item => item.scenario.name)).to.deepEqual([
      'one',
    ]);
    expect(printed).to.equal('Only 1 of 2 scenarios run (.only)\n');
  });

  describe('the URLs of the run', () => {
    const browserOnly = `load.browser('open', async () => {});`;

    it('needs only LOAD_TESTS_UI_URL for a run of browser scenarios', async () => {
      packageWith(browserOnly);

      const prepared = await prepare(pkg, {
        LOAD_TESTS_UI_URL: 'http://localhost:4200/',
      });

      expect(prepared.target).to.deepEqual({uiUrl: 'http://localhost:4200'});
    });

    it('needs no login for browser scenarios when a describe sets token() headers', async () => {
      packageWith(`const {token} = require(${JSON.stringify(path.join(__dirname, '../../../scenario/values'))});
load.describe('g', {headers: {authorization: token()}}, () => {
  load.browser('open', async () => {});
});`);

      const prepared = await prepare(pkg, {
        LOAD_TESTS_UI_URL: 'http://localhost:4200/',
      });

      expect(prepared.session).to.equal(undefined);
    });

    it('asks for LOAD_TESTS_UI_URL when a browser scenario runs', async () => {
      packageWith(browserOnly);

      await expect(prepare(pkg, ENV)).to.be.rejectedWith(
        'Set LOAD_TESTS_UI_URL',
      );
    });

    it('does not ask for LOAD_TESTS_UI_URL for a skipped browser scenario', async () => {
      packageWith(
        `load.browser.skip('open', async () => {});\nload.it('list', [load.get('/a')]);`,
      );

      const prepared = await prepare(pkg, ENV);

      expect(prepared.target.uiUrl).to.equal(undefined);
    });

    it('does not ask for LOAD_TESTS_BASE_URL for a skipped HTTP scenario', async () => {
      packageWith(`${browserOnly}\nload.it.skip('list', [load.get('/a')]);`);

      const prepared = await prepare(pkg, {
        LOAD_TESTS_UI_URL: 'http://localhost:4200/',
      });

      expect(prepared.target).to.deepEqual({uiUrl: 'http://localhost:4200'});
    });

    for (const hook of ['before', 'after']) {
      it(`asks for LOAD_TESTS_BASE_URL when a browser scenario has ${hook}`, async () => {
        packageWith(
          `load.browser('open', {${hook}: async () => {}}, async () => {});`,
        );

        await expect(
          prepare(pkg, {LOAD_TESTS_UI_URL: 'http://localhost:4200/'}),
        ).to.be.rejectedWith('Set LOAD_TESTS_BASE_URL');
      });
    }

    it('reads both URLs for a browser scenario with a hook', async () => {
      packageWith(
        `load.browser('open', {before: async () => {}}, async () => {});`,
      );

      const prepared = await prepare(pkg, {
        LOAD_TESTS_UI_URL: 'http://localhost:4200/',
        LOAD_TESTS_BASE_URL: 'http://localhost:4001/',
      });

      expect(prepared.target).to.containDeep({
        uiUrl: 'http://localhost:4200',
        baseUrl: 'http://localhost:4001',
      });
    });

    it('does not ask for LOAD_TESTS_BASE_URL for a skipped browser scenario with a hook', async () => {
      packageWith(
        `load.browser.skip('open', {before: async () => {}}, async () => {});\nload.browser('plain', async () => {});`,
      );

      const prepared = await prepare(pkg, {
        LOAD_TESTS_UI_URL: 'http://localhost:4200/',
      });

      expect(prepared.target).to.deepEqual({uiUrl: 'http://localhost:4200'});
    });

    it('names both URLs when a run of both kinds has neither', async () => {
      packageWith(`${browserOnly}\nload.it('list', [load.get('/a')]);`);

      await expect(prepare(pkg, {})).to.be.rejectedWith(
        'Set LOAD_TESTS_BASE_URL, LOAD_TESTS_UI_URL',
      );
    });
  });

  describe('heavyEndpoints', () => {
    it('counts the endpoints of a skipped scenario', async () => {
      packageWith(`load.it.skip('one', [load.get('/a', {p95: 2000})]);
load.it('two', [load.get('/b')]);`);

      const prepared = await prepare(pkg, ENV);

      expect(prepared.heavyEndpoints).to.deepEqual([{id: 'GET /a', p95: 2000}]);
    });

    it('counts the endpoints of a scenario that .only leaves out', async () => {
      packageWith(`load.it('one', [load.get('/a', {p95: 2000})]);
load.it.only('two', [load.get('/b')]);`);

      const prepared = await prepare(pkg, ENV);

      expect(prepared.heavyEndpoints).to.deepEqual([{id: 'GET /a', p95: 2000}]);
    });

    it('counts every endpoint when the package default is above 1000 ms', async () => {
      packageWith(
        `load.it('one', [load.get('/a')]);
load.it('two', [load.get('/b')]);`,
        '{p95: 2000}',
      );

      const prepared = await prepare(pkg, ENV);

      expect(prepared.heavyEndpoints).to.deepEqual([
        {id: 'GET /a', p95: 2000},
        {id: 'GET /b', p95: 2000},
      ]);
    });

    it('counts the endpoints of a scenario with a p95 above 1000 ms', async () => {
      packageWith(`load.it('one', [load.get('/a')], {thresholds: {p95: 2000}});
load.it('two', [load.get('/b')]);`);

      const prepared = await prepare(pkg, ENV);

      expect(prepared.heavyEndpoints).to.deepEqual([{id: 'GET /a', p95: 2000}]);
    });

    it('counts the endpoints of a load.describe with a p95 above 1000 ms', async () => {
      packageWith(`load.describe('group', {thresholds: {p95: 2000}}, () => {
  load.it('one', [load.get('/a')]);
});
load.it('two', [load.get('/b')]);`);

      const prepared = await prepare(pkg, ENV);

      expect(prepared.heavyEndpoints).to.deepEqual([{id: 'GET /a', p95: 2000}]);
    });

    it('is empty when no limit is above 1000 ms', async () => {
      packageWith(`load.it('one', [load.get('/a', {p95: 1000})]);`);

      expect((await prepare(pkg, ENV)).heavyEndpoints).to.deepEqual([]);
    });
  });

  it('goes on with no coverage when the package has no src/openapi.json', async () => {
    packageWith(`load.it('one', [load.get('/missing')]);`);
    fs.rmSync(path.join(pkg, 'src/openapi.json'));

    const prepared = await prepare(pkg, ENV);

    expect(prepared.scenarios).to.have.length(1);
    expect(prepared.endpointCoverage).to.be.undefined();
  });

  it('stops for an endpoint that the spec does not have', async () => {
    packageWith(`load.it('one', [load.get('/a'), load.get('/missing')]);`);

    await expect(prepare(pkg, ENV)).to.be.rejectedWith({
      name: 'ConfigError',
      message: 'src/openapi.json has no GET /missing',
    });
  });
});
