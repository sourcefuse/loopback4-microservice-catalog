// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {scenarioOf} from '../../../helpers';
import {load} from '../../../../scenario/builder';
import {captureFrom} from '../../../../scenario/values';
import {
  transpile,
  writeScenario,
} from '../../../../engine/artillery/transpiler';
import type {Vars} from '../../../../types';
import type {Phase} from '../../../../scenario/types';
import {processorSource} from '../../../../engine/artillery/processor';

const CAPTURE_VAR = 'loadTestsCapture_0';
const CHECK_NAME = 'loadTestsCaptures_0';

const beforeEachMessage = (where: string) =>
  `load-testing hook beforeEach: ${where} contains text that the engine reads as a template ("{{", "$&", "$\`", "$'" or "$$"). Put the value in vars without it, or leave it out.`;
const captureMessage =
  'load-testing hook capture: "{{", "$&", "$`", "$\'" or "$$" in the value of GET /orders at $.id. The engine reads it as a template. The vuser stopped before it sent another request.';

describe('worker hooks', () => {
  type Done = (err?: Error) => void;
  type Processor = Record<
    string,
    (context: {vars: object}, ee: object, done: Done) => void
  >;

  /** Runs the generated processor the way a worker loads it. */
  function loadProcessor(source: string): Processor {
    const exported = {};
    new Function('require', 'exports', source)(require, exported);
    return exported as Processor;
  }

  it('gives each user the run vars and what beforeEach returns', () => {
    const scenario = scenarioOf('s', [load.get('/a')], {
      beforeEach: ({vars: run, vu}) => ({
        supplierId: (run.supplierIds as string[])[vu],
        vu,
      }),
    });
    const processor = loadProcessor(
      processorSource(scenario, {supplierIds: ['s0', 's1']}),
    );
    const first = {vars: {}};
    const second = {vars: {}};

    processor.loadTestsBeforeScenario(first, {}, () => undefined);
    processor.loadTestsBeforeScenario(second, {}, () => undefined);

    expect(first.vars).to.deepEqual({
      supplierIds: ['s0', 's1'],
      supplierId: 's0',
      vu: 0,
    });
    expect(second.vars).to.containEql({supplierId: 's1', vu: 1});
  });

  it('fails the user when beforeEach returns a text with braces, and names the path', () => {
    const scenario = scenarioOf('s', [load.get('/a')], {
      beforeEach: () => ({x: '{{ y }}', order: {notes: ['ok', '{{ z }}']}}),
    });
    const processor = loadProcessor(processorSource(scenario, {}));
    const context = {vars: {}};
    let failure: Error | undefined;

    processor.loadTestsBeforeScenario(context, {}, err => {
      failure = err;
    });

    expect(failure?.message).to.equal(beforeEachMessage('vars.x'));
    expect(context.vars).to.deepEqual({});
  });

  /** `beforeEach` is sent as text to the worker, so it cannot use a closure. */
  const eachWithPattern: [string, () => Vars][] = [
    ['$&', () => ({order: {notes: ['ok', 'a$&b']}})],
    ['$`', () => ({order: {notes: ['ok', 'a$`b']}})],
    ["$'", () => ({order: {notes: ['ok', "a$'b"]}})],
    ['$$', () => ({order: {notes: ['ok', 'pa$$word']}})],
  ];
  for (const [text, beforeEach] of eachWithPattern) {
    it(`fails the user when beforeEach returns a text with ${text}`, () => {
      const scenario = scenarioOf('s', [load.get('/a')], {beforeEach});
      const processor = loadProcessor(processorSource(scenario, {}));
      const context = {vars: {}};
      let failure: Error | undefined;

      processor.loadTestsBeforeScenario(context, {}, err => {
        failure = err;
      });

      expect(failure?.message).to.equal(
        beforeEachMessage('vars.order.notes[1]'),
      );
      expect(context.vars).to.deepEqual({});
    });
  }

  it('reads the beforeEach result as JSON, so a toJSON result counts', () => {
    const scenario = scenarioOf('s', [load.get('/a')], {
      beforeEach: () =>
        ({x: {toJSON: () => '{{ $env.TOKEN }}'}}) as unknown as Vars,
    });
    const processor = loadProcessor(processorSource(scenario, {}));
    const context = {vars: {}};
    let failure: Error | undefined;

    processor.loadTestsBeforeScenario(context, {}, err => {
      failure = err;
    });

    expect(failure?.message).to.equal(beforeEachMessage('vars.x'));
    expect(context.vars).to.deepEqual({});
  });

  it('fails the user when the beforeEach result cannot be written as JSON', () => {
    const scenario = scenarioOf('s', [load.get('/a')], {
      beforeEach: () => {
        const result: Record<string, unknown> = {};
        result.self = result;
        return result as Vars;
      },
    });
    const processor = loadProcessor(processorSource(scenario, {}));
    let failure: Error | undefined;

    processor.loadTestsBeforeScenario({vars: {}}, {}, err => {
      failure = err;
    });

    expect(failure?.message).to.match(
      /^load-testing hook beforeEach: .*circular/,
    );
  });

  it('lets beforeEach return a text without braces', () => {
    const scenario = scenarioOf('s', [load.get('/a')], {
      beforeEach: () => ({x: '{ y }', list: ['a']}),
    });
    const processor = loadProcessor(processorSource(scenario, {}));
    const context = {vars: {}};
    let failure: Error | undefined;

    processor.loadTestsBeforeScenario(context, {}, err => {
      failure = err;
    });

    expect(failure).to.be.undefined();
    expect(context.vars).to.deepEqual({x: '{ y }', list: ['a']});
  });

  describe('the check of captured values', () => {
    type AfterResponse = (
      req: object,
      res: object,
      context: {vars: Record<string, unknown>},
      ee: object,
      next: (err?: Error) => void,
    ) => void;
    const scenario = scenarioOf('s', [
      load.get('/orders'),
      load.get('/a/{id}', {
        pathParams: {id: captureFrom('GET /orders', '$.id')},
      }),
    ]);
    const captured = [[{json: '$.id', as: 'loadTestsCapture_0'}], []];
    const check = (value: unknown): Error | undefined => {
      const processor = loadProcessor(
        processorSource(scenario, {}, captured),
      ) as unknown as Record<string, AfterResponse>;
      let failure: Error | undefined;
      processor.loadTestsCaptures_0(
        {},
        {},
        {vars: {[CAPTURE_VAR]: value}},
        {},
        err => {
          failure = err;
        },
      );
      return failure;
    };

    it('fails the user when a captured text has braces, and does not print the value', () => {
      const failure = check('x{{ $env.PATH }}');

      expect(failure?.message).to.equal(captureMessage);
    });

    for (const text of ['$&', '$`', "$'", '$$']) {
      it(`fails the user when a captured text has ${text}, and does not print the value`, () => {
        const failure = check(`x${text}y`);

        expect(failure?.message).to.equal(captureMessage);
      });
    }

    it('fails the user when a captured object or array has braces inside', () => {
      expect(check({a: ['{{ b }}']})).to.be.instanceOf(Error);
      expect(check({'{{ k }}': 1})).to.be.instanceOf(Error);
    });

    it('lets a clean value pass, also a number and a missing value', () => {
      expect(check('abc-1')).to.be.undefined();
      expect(check(42)).to.be.undefined();
      expect(check({a: ['b']})).to.be.undefined();
      expect(check(undefined)).to.be.undefined();
    });

    it('writes no check for a request that captures nothing', () => {
      const source = processorSource(scenario, {}, captured);

      expect(source).to.not.match(/loadTestsCaptures_1/);
    });
  });

  it('fails the user, with a message that names the hook', () => {
    const broken = scenarioOf('s', [load.get('/a')], {
      beforeEach: () => {
        throw new Error('no slot');
      },
    });
    const processor = loadProcessor(processorSource(broken, {}));
    let failure: Error | undefined;

    processor.loadTestsBeforeScenario({vars: {}}, {}, err => {
      failure = err;
    });

    expect(failure?.message).to.equal('load-testing hook beforeEach: no slot');
  });

  describe('the hooks that the CLI tries', () => {
    it('gives the vars as a new copy on each call, so that no user changes another', () => {
      const scenario = scenarioOf('s', [load.get('/a')], {
        beforeEach: ({vars: run}) => ({n: (run.list as number[]).length}),
      });
      const exported = loadProcessor(processorSource(scenario, {list: [1]}));
      const tried = (
        exported as unknown as {
          loadTestsHooks: {runVars: () => {list: number[]}};
        }
      ).loadTestsHooks;

      const first = tried.runVars();
      first.list.push(2);

      expect(tried.runVars().list).to.deepEqual([1]);
    });

    it('names each worker hook that the scenario has', () => {
      const scenario = scenarioOf(
        's',
        [
          load.get('/a', {
            beforeRequest: () => undefined,
            afterResponse: () => undefined,
          }),
        ],
        {beforeEach: () => ({}), afterEach: () => undefined},
      );
      const exported = loadProcessor(processorSource(scenario, {}));
      const tried = (
        exported as unknown as {
          loadTestsHooks: {hooks: Record<string, unknown>};
        }
      ).loadTestsHooks;

      expect(Object.keys(tried.hooks)).to.deepEqual([
        'beforeEach',
        'afterEach',
        'beforeRequest_0',
        'afterResponse_0',
      ]);
    });
  });

  describe('functions and processor', () => {
    it('exports the functions of the scenario', () => {
      const scenario = scenarioOf('s', [load.get('/a')], {
        artillery: {
          functions: {
            mark: (context: {vars: {n?: number}}, _ee: unknown, done: Done) => {
              context.vars.n = 7;
              done();
            },
          },
        },
      });
      const context = {vars: {} as {n?: number}};

      loadProcessor(processorSource(scenario, {})).mark(
        context,
        {},
        () => undefined,
      );

      expect(context.vars.n).to.equal(7);
    });

    it('exports what the processor of the consumer exports', () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-hooks-'));
      try {
        const mine = path.join(dir, 'mine.js');
        fs.writeFileSync(
          mine,
          `exports.greet = (context, ee, done) => { context.vars.greeting = 'hi'; done(); };`,
        );
        const scenario = scenarioOf('s', [load.get('/a')], {
          artillery: {processor: mine},
        });
        const context = {vars: {} as {greeting?: string}};

        loadProcessor(processorSource(scenario, {})).greet(
          context,
          {},
          () => undefined,
        );

        expect(context.vars.greeting).to.equal('hi');
      } finally {
        fs.rmSync(dir, {recursive: true});
      }
    });

    it('sets up a processor for a scenario that has only a processor', () => {
      const scenario = scenarioOf('s', [load.get('/a')], {
        artillery: {processor: '/x/mine.js'},
      });

      const script = transpile(
        scenario,
        undefined,
        [{duration: 1, arrivalRate: 1}],
        '/out/s.processor.js',
        new Set(),
      );

      expect(script.config.processor).to.equal('/out/s.processor.js');
    });
  });
});

describe('probeHooks', () => {
  const PHASES: Phase[] = [{duration: 60, arrivalRate: 10}];
  const pkgDir = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-probe-'));
  after(() => fs.rmSync(pkgDir, {recursive: true}));

  it('tries the hooks in the processor file, so they see only their arguments and the globals', () => {
    const scenario = scenarioOf('globals', [load.get('/a')], {
      beforeEach: ({vu}) => ({
        host: new URL('http://example.test').host,
        size: Buffer.from('ab').length,
        vu,
      }),
    });

    expect(() =>
      writeScenario(pkgDir, scenario, undefined, PHASES, {}),
    ).to.not.throw();
  });

  it('writes the check of the captured values for a scenario that has no other hook', () => {
    const scenario = scenarioOf('cap', [
      load.get('/orders'),
      load.get('/orders/{id}', {
        pathParams: {id: captureFrom('GET /orders', '$.id')},
      }),
    ]);

    const scriptPath = writeScenario(pkgDir, scenario, undefined, PHASES, {});

    const processor = require(scriptPath.replace(/\.json$/, '.processor.js'));
    expect(processor.loadTestsCaptures_0).to.be.a.Function();
    expect(processor.loadTestsCaptures_1).to.be.undefined();
  });

  it('rejects a function of a consumer that has the name of the capture check', () => {
    const scenario = scenarioOf('clash', [load.get('/a')], {
      artillery: {functions: {[CHECK_NAME]: () => undefined}},
    });

    expect(() =>
      writeScenario(pkgDir, scenario, undefined, PHASES, {}),
    ).to.throw(/loadTestsCaptures_0 .*reserved/);
  });

  it('rejects a beforeEach that uses a variable of its module', () => {
    const outside = 5;
    const leaky = scenarioOf('l', [load.get('/a')], {
      beforeEach: () => ({n: outside}),
    });

    expect(() => writeScenario(pkgDir, leaky, undefined, PHASES, {})).to.throw(
      /beforeEach can use only its arguments and the globals of a worker/,
    );
  });

  it('accepts hooks that use the globals of a worker, such as URL and Buffer', () => {
    const scenario = scenarioOf(
      'globals',
      [
        load.get('/a', {
          beforeRequest: req => {
            req.headers.x = Buffer.from(new URL(req.url).host).toString('hex');
          },
        }),
      ],
      {beforeEach: () => ({id: new URLSearchParams('a=1').get('a')})},
    );

    expect(() =>
      writeScenario(pkgDir, scenario, undefined, PHASES, {}),
    ).to.not.throw();
  });

  it('rejects a request hook that uses an import', () => {
    const leaky = scenarioOf('r', [
      load.get('/a', {beforeRequest: req => path.join(req.url)}),
    ]);

    expect(() => writeScenario(pkgDir, leaky, undefined, PHASES, {})).to.throw(
      /GET \/a beforeRequest can use only its arguments/,
    );
  });

  it('rejects a hook that uses a variable of its module that has the name of a generated one', () => {
    const vu = 1;
    const leaky = scenarioOf('names', [load.get('/a')], {
      beforeEach: () => ({n: vu}),
    });

    expect(() => writeScenario(pkgDir, leaky, undefined, PHASES, {})).to.throw(
      /beforeEach can use only its arguments and the globals of a worker/,
    );
  });

  describe('a hook that returns a promise', () => {
    /** An async function typed as a hook: it type-checks, because it returns a value. */
    const asyncHook = (fn: () => Promise<unknown> = async () => undefined) =>
      fn as unknown as () => void;
    it('stops the run for beforeEach', () => {
      const scenario = scenarioOf('async each', [load.get('/a')], {
        // An async hook type-checks, because it returns a value.
        beforeEach: (async () => ({})) as unknown as () => Vars,
      });

      expect(() =>
        writeScenario(pkgDir, scenario, undefined, PHASES, {}),
      ).to.throw({
        name: 'ScenarioError',
        message: /beforeEach returned a promise.*synchronous/,
      });
    });

    it('stops the run for afterEach', () => {
      const scenario = scenarioOf('async after each', [load.get('/a')], {
        afterEach: asyncHook(),
      });

      expect(() =>
        writeScenario(pkgDir, scenario, undefined, PHASES, {}),
      ).to.throw({
        name: 'ScenarioError',
        message: /afterEach returned a promise.*synchronous/,
      });
    });

    it('stops the run for beforeRequest', () => {
      const scenario = scenarioOf('async before request', [
        load.get('/a', {beforeRequest: asyncHook()}),
      ]);

      expect(() =>
        writeScenario(pkgDir, scenario, undefined, PHASES, {}),
      ).to.throw({
        name: 'ScenarioError',
        message: /GET \/a beforeRequest returned a promise/,
      });
    });

    it('stops the run for afterResponse', () => {
      const scenario = scenarioOf('async after response', [
        load.get('/a', {afterResponse: asyncHook()}),
      ]);

      expect(() =>
        writeScenario(pkgDir, scenario, undefined, PHASES, {}),
      ).to.throw({
        name: 'ScenarioError',
        message: /GET \/a afterResponse returned a promise/,
      });
    });

    it('leaves no unhandled rejection when the promise rejects', async () => {
      const unhandled: unknown[] = [];
      const listener = (reason: unknown) => unhandled.push(reason);
      process.on('unhandledRejection', listener);
      const scenario = scenarioOf('rejecting', [load.get('/a')], {
        afterEach: asyncHook(async () => {
          throw new Error('late');
        }),
      });
      try {
        expect(() =>
          writeScenario(pkgDir, scenario, undefined, PHASES, {}),
        ).to.throw(/synchronous/);
        await new Promise(resolve => setImmediate(resolve));
      } finally {
        process.off('unhandledRejection', listener);
      }

      expect(unhandled).to.deepEqual([]);
    });
  });
});
