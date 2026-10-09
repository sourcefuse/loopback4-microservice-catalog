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
    expect(printed).to.equal('Only 1 of 2 scenarios run (.only)\n');
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

  it('stops for an endpoint that the spec does not have', async () => {
    packageWith(`load.it('one', [load.get('/a'), load.get('/missing')]);`);

    await expect(prepare(pkg, ENV)).to.be.rejectedWith({
      name: 'ConfigError',
      message: 'src/openapi.json has no GET /missing',
    });
  });
});
