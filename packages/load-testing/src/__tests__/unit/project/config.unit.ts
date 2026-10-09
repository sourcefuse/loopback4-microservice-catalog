// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  configProblems,
  P95_TARGETS,
  readConfig,
  resolveThresholds,
} from '../../../project/config';

const SOURCE = 'src/__tests__/load/config.ts';
const BUILT = 'dist/__tests__/load/config.js';

describe('readConfig', () => {
  const dirs: string[] = [];
  after(() => dirs.forEach(dir => fs.rmSync(dir, {recursive: true})));

  /** A package folder that holds the files, by path from the package. */
  function pkgWith(files: Record<string, string>): string {
    const pkgDir = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-'));
    dirs.push(pkgDir);
    for (const [file, text] of Object.entries(files)) {
      fs.mkdirSync(path.dirname(path.join(pkgDir, file)), {recursive: true});
      fs.writeFileSync(path.join(pkgDir, file), text);
    }
    return pkgDir;
  }

  it('loads the default export of the built config', () => {
    const pkgDir = pkgWith({
      [SOURCE]: '',
      [BUILT]:
        'exports.default = {phases: [{arrivalRate: 2, duration: 5}], thresholds: {default: {}}};',
    });

    expect(readConfig(pkgDir)).to.deepEqual({
      phases: [{arrivalRate: 2, duration: 5}],
      thresholds: {default: {}},
    });
  });

  it('names the config file when the package has none', () => {
    expect(() => readConfig(pkgWith({}))).to.throw(
      /No src\/__tests__\/load\/config.ts/,
    );
  });

  it('asks for a build when the built file is missing', () => {
    expect(() => readConfig(pkgWith({[SOURCE]: ''}))).to.throw({
      name: 'ConfigError',
      message: /No dist\/__tests__\/load\/config.js. Run npm run build./,
    });
  });

  it('names the file and the wrong values', () => {
    const pkgDir = pkgWith({
      [SOURCE]: '',
      [BUILT]:
        'exports.default = {phases: [{arrivalRate: 1, duration: 0}], thresholds: {default: {}}};',
    });

    expect(() => readConfig(pkgDir)).to.throw(
      'src/__tests__/load/config.ts:\n  phases[0].duration must be a whole number above 0, or a text such as "1m"',
    );
  });

  it('asks for a default export when the file has none', () => {
    const pkgDir = pkgWith({[SOURCE]: '', [BUILT]: 'exports.config = {};'});

    expect(() => readConfig(pkgDir)).to.throw(
      /config.ts has no default export/,
    );
  });
});

describe('configProblems', () => {
  const GOOD = {
    phases: [{duration: 60, arrivalRate: 10}],
    thresholds: {default: {}},
  };

  it('finds nothing wrong in a good config', () => {
    expect(configProblems(GOOD)).to.deepEqual([]);
  });

  it('accepts an engine with a name and a run function', () => {
    const engine = {name: 'fake', run: async () => ({})};

    expect(configProblems({...GOOD, engine})).to.deepEqual([]);
  });

  it('finds an engine that has no run function, or no name', () => {
    const problem =
      'engine must be an object with a `name` and a `run` function, for example artillery()';

    for (const engine of [
      'artillery',
      {name: 'x'},
      {run: () => {}},
      {name: '', run: () => {}},
      null,
    ]) {
      expect(configProblems({...GOOD, engine})).to.deepEqual([problem]);
    }
  });

  it('accepts reporters with a name and an onRunEnd function, and [] too', () => {
    const reporter = {name: 'mine', onRunEnd: () => undefined};

    expect(configProblems({...GOOD, reporters: [reporter]})).to.deepEqual([]);
    expect(configProblems({...GOOD, reporters: []})).to.deepEqual([]);
  });

  it('finds reporters that are not a list, or have no name, or no onRunEnd', () => {
    const bad = (index: number) =>
      `reporters[${index}] must be an object with a \`name\` and an \`onRunEnd\` function`;

    expect(configProblems({...GOOD, reporters: 'console'})).to.deepEqual([
      'reporters must be an array, for example [consoleReporter()]',
    ]);
    expect(
      configProblems({
        ...GOOD,
        reporters: [
          {name: 'ok', onRunEnd: () => undefined},
          {name: 'x'},
          {onRunEnd: () => undefined},
          {name: '', onRunEnd: () => undefined},
          null,
        ],
      }),
    ).to.deepEqual([bad(1), bad(2), bad(3), bad(4)]);
  });

  it('accepts artillery.env as a list of names', () => {
    expect(
      configProblems({...GOOD, artillery: {env: ['MY_REGION', 'OTHER']}}),
    ).to.deepEqual([]);
    expect(configProblems({...GOOD, artillery: {env: []}})).to.deepEqual([]);
  });

  it('finds an artillery.env that is not a list', () => {
    expect(
      configProblems({...GOOD, artillery: {env: 'MY_REGION'}}),
    ).to.deepEqual([
      'artillery.env must be an array of variable names, for example ["MY_REGION"]',
    ]);
  });

  it('finds each artillery.env entry that is wrong, one line for each', () => {
    const env = ['OK', '', 5, 'A=B', 'LOAD_TESTS_X', 'load_tests_y'];

    expect(configProblems({...GOOD, artillery: {env}})).to.deepEqual([
      'artillery.env[1] must be a text that is not empty',
      'artillery.env[2] must be a text that is not empty',
      'artillery.env[3] must not have "="',
      'artillery.env[4] "LOAD_TESTS_X" is not allowed: these variables are for the CLI only',
      'artillery.env[5] "load_tests_y" is not allowed: these variables are for the CLI only',
    ]);
  });

  it('accepts a tokenCheck that is a function, and rejects any other value', () => {
    expect(configProblems({...GOOD, tokenCheck: () => undefined})).to.deepEqual(
      [],
    );
    expect(configProblems({...GOOD, tokenCheck: 'strict'})).to.deepEqual([
      'tokenCheck must be a function',
    ]);
  });

  it('accepts the three forms of a datasource', () => {
    const connector = {connect: async () => ({})};
    const datasources = {
      a: {type: 'postgres'},
      b: {type: 'custom', connector},
      c: connector,
    };

    expect(configProblems({...GOOD, datasources})).to.deepEqual([]);
  });

  it('finds a datasource that is wrong, and a name that is empty', () => {
    const forms =
      '{type: "postgres", url}, {type: "custom", connector}, or a connector (an object with a connect function)';
    const datasources = {
      orders: 'postgres://x',
      audit: {},
      kind: {type: 'postgress'},
      custom: {type: 'custom'},
      custom2: {type: 'custom', connector: {connect: 1}},
      '': {connect: async () => ({})},
    };

    expect(configProblems({...GOOD, datasources})).to.deepEqual([
      `datasources.orders must be an object: ${forms}`,
      `datasources.audit must be ${forms}`,
      'datasources.kind.type must be "postgres" or "custom"',
      'datasources.custom.connector must be an object with a connect function',
      'datasources.custom2.connector must be an object with a connect function',
      'datasources has a name that is empty',
    ]);
  });

  describe('the time options of a postgres datasource', () => {
    for (const option of ['statementTimeoutMs', 'connectionTimeoutMs']) {
      it(`refuses ${option} that is not a whole number from 0`, () => {
        for (const value of [-1, 1.5, NaN, Infinity, '5000']) {
          const datasources = {db: {type: 'postgres', [option]: value}};

          expect(configProblems({...GOOD, datasources})).to.deepEqual([
            `datasources.db.${option} must be a whole number of milliseconds from 0 (0 turns the limit off)`,
          ]);
        }
      });

      it(`accepts ${option} 0 and 5000`, () => {
        for (const value of [0, 5000]) {
          const datasources = {db: {type: 'postgres', [option]: value}};

          expect(configProblems({...GOOD, datasources})).to.deepEqual([]);
        }
      });
    }
  });

  it('finds datasources that is not an object', () => {
    expect(configProblems({...GOOD, datasources: 'x'})).to.deepEqual([
      'datasources must be an object: {name: {type: "postgres", url: ...}}',
    ]);
  });

  it('lists every wrong value', () => {
    const bad = {
      phases: [{arrivalRate: -1, duration: -1}],
      thresholds: {default: {errorRate: 150}},
    };

    expect(configProblems(bad)).to.deepEqual([
      'phases[0].duration must be a whole number above 0, or a text such as "1m"',
      'phases[0].arrivalRate must be 0 or more',
      'thresholds.default.errorRate must be from 0 to 100',
    ]);
  });

  it('wants a list of phases, and not a flat object', () => {
    const flat = {
      phases: {arrivalRate: 10, duration: 60},
      thresholds: {default: {}},
    };
    const none = {phases: [], thresholds: {default: {}}};
    const missing = {thresholds: {default: {}}};
    const expected = ['phases must be a list with at least one phase'];

    expect(configProblems(flat)).to.deepEqual(expected);
    expect(configProblems(none)).to.deepEqual(expected);
    expect(configProblems(missing)).to.deepEqual(expected);
  });

  it('rejects artillery.config.processor, because the library owns the processor', () => {
    const bad = {...GOOD, artillery: {config: {processor: './mine.js'}}};

    expect(configProblems(bad)).to.deepEqual([
      'artillery.config.processor is not allowed: use artillery.processor',
    ]);
  });

  it('rejects artillery.config.phases, because phases is the load', () => {
    const bad = {...GOOD, artillery: {config: {phases: GOOD.phases}}};

    expect(configProblems(bad)).to.deepEqual([
      'artillery.config.phases is not allowed: use phases',
    ]);
  });

  it('rejects artillery.config.target, because LOAD_TESTS_BASE_URL is the target', () => {
    const bad = {...GOOD, artillery: {config: {target: 'http://other'}}};

    expect(configProblems(bad)).to.deepEqual([
      'artillery.config.target is not allowed: the library sets it from LOAD_TESTS_BASE_URL',
    ]);
  });

  it('rejects the metrics-by-endpoint plugin, but accepts other plugins', () => {
    const plugins = {'metrics-by-endpoint': {useOnlyRequestNames: false}};

    expect(
      configProblems({...GOOD, artillery: {config: {plugins}}}),
    ).to.deepEqual([
      "artillery.config.plugins['metrics-by-endpoint'] is not allowed: the library sets it",
    ]);
    expect(
      configProblems({
        ...GOOD,
        artillery: {config: {plugins: {expect: {}}}},
      }),
    ).to.deepEqual([]);
  });

  it('accepts other Artillery config, such as a timeout', () => {
    const good = {...GOOD, artillery: {config: {http: {timeout: 30}}}};

    expect(configProblems(good)).to.deepEqual([]);
  });

  it('accepts a ramp, a pause, a count, and a time that is a text', () => {
    const phases = [
      {duration: '1m', arrivalRate: 1, rampTo: 5},
      {pause: 10},
      {duration: 30, arrivalCount: 100},
    ];

    expect(configProblems({...GOOD, phases})).to.deepEqual([]);
  });

  it('rejects a ramp with no arrivalRate', () => {
    const phases = [{duration: 60, rampTo: 5}];

    expect(configProblems({...GOOD, phases})).to.deepEqual([
      'phases[0] needs arrivalRate with rampTo',
    ]);
  });

  it('rejects a phase with neither arrivalRate nor arrivalCount', () => {
    const phases = [{duration: 60}];

    expect(configProblems({...GOOD, phases})).to.deepEqual([
      'phases[0] needs arrivalRate or arrivalCount',
    ]);
  });

  it('accepts arrivalRate 0 and rampTo 0', () => {
    const phases = [
      {duration: 60, arrivalRate: 0, rampTo: 5},
      {duration: 60, arrivalRate: 5, rampTo: 0},
    ];

    expect(configProblems({...GOOD, phases})).to.deepEqual([]);
  });

  it('rejects a duration, a pause or a count that is not a whole number', () => {
    const phases = [
      {duration: 0.5, arrivalRate: 1},
      {pause: 1.5},
      {duration: 5, arrivalCount: 2.5},
    ];

    expect(configProblems({...GOOD, phases})).to.deepEqual([
      'phases[0].duration must be a whole number above 0, or a text such as "1m"',
      'phases[1].pause must be a whole number above 0, or a text such as "1m"',
      'phases[2].arrivalCount must be a whole number above 0',
    ]);
  });

  it('rejects thresholds below 0', () => {
    const bad = {
      phases: GOOD.phases,
      thresholds: {default: {minDelta: -5, p95: Number.NaN}},
    };

    expect(configProblems(bad)).to.deepEqual([
      'thresholds.default.minDelta must be 0 or more',
      'thresholds.default.p95 must be 0 or more',
    ]);
  });

  it('accepts maxHeavyApis of 0 and of 3', () => {
    expect(configProblems({...GOOD, maxHeavyApis: 0})).to.deepEqual([]);
    expect(configProblems({...GOOD, maxHeavyApis: 3})).to.deepEqual([]);
  });

  it('rejects a maxHeavyApis that is not a whole number of 0 or more', () => {
    for (const bad of [-1, 1.5, '2', Number.NaN]) {
      expect(configProblems({...GOOD, maxHeavyApis: bad})).to.deepEqual([
        'maxHeavyApis must be a whole number, 0 or more',
      ]);
    }
  });

  it('needs an object as the default export', () => {
    expect(configProblems(null)).to.deepEqual([
      'the default export must be an object',
    ]);
  });

  it('accepts a config with no thresholds', () => {
    expect(configProblems({phases: GOOD.phases})).to.deepEqual([]);
    expect(configProblems({...GOOD, thresholds: {}})).to.deepEqual([]);
  });

  it('still checks thresholds.default when it is given', () => {
    expect(
      configProblems({...GOOD, thresholds: {default: {errorRate: 150}}}),
    ).to.deepEqual(['thresholds.default.errorRate must be from 0 to 100']);
  });
});

describe('P95_TARGETS', () => {
  it('holds the common p95 target for each kind of API', () => {
    expect(P95_TARGETS).to.deepEqual({
      userBlockingApi: 500,
      supportingApi: 1000,
      heavyOperation: 5000,
    });
  });
});

describe('resolveThresholds', () => {
  it('uses the library defaults when nothing is set', () => {
    expect(resolveThresholds({})).to.deepEqual({
      p95Regression: 20,
      minDelta: 10,
      errorRate: 1,
      p95: 500,
    });
  });

  it('lets a request override one field and keep the rest', () => {
    expect(
      resolveThresholds(
        {minDelta: 5, errorRate: 0},
        {p95: P95_TARGETS.supportingApi},
      ),
    ).to.deepEqual({
      p95Regression: 20,
      minDelta: 5,
      errorRate: 0,
      p95: 1000,
    });
  });
});
