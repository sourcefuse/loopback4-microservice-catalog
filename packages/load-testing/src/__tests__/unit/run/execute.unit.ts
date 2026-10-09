// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {scenarioOf} from '../../helpers';
import fs from 'node:fs';
import os from 'node:os';
import http from 'node:http';
import type {AddressInfo} from 'node:net';
import path from 'node:path';
import {load} from '../../../scenario/builder';
import {template, token, vars} from '../../../scenario/values';
import {resolveThresholds} from '../../../project/config';
import {execute, runScenarios} from '../../../run/execute';
import {artillery} from '../../../engine/artillery';
import type {Engine, EngineRun} from '../../../engine/types';
import type {Measurement} from '../../../report/types';
import {readTarget} from '../../../run/target';
import type {RunContext, Scenario} from '../../../types';
import type {LoadedScenario} from '../../../project/types';
import type {ScenarioRun} from '../../../report/types';

const loadedOf = (scenario: Scenario): LoadedScenario => ({
  scenario,
  endpoints: new Map([['GET /a', resolveThresholds({})]]),
});

describe('execute', () => {
  const pkgDir = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-'));
  after(() => fs.rmSync(pkgDir, {recursive: true}));

  const target = readTarget({
    LOAD_TESTS_BASE_URL: 'http://127.0.0.1:9',
    LOAD_TESTS_USERNAME: 'u',
    LOAD_TESTS_PASSWORD: 'p',
    LOAD_TESTS_CLIENT_ID: 'c',
    LOAD_TESTS_CLIENT_SECRET: 's',
  });
  /** A JWT that expires in `seconds`. */
  const tokenFor = (seconds: number) =>
    `x.${Buffer.from(JSON.stringify({exp: Date.now() / 1000 + seconds})).toString('base64url')}.y`;
  /** A request that sends the token, so the token check applies. */
  const withToken = () =>
    load.get('/a', {headers: {authorization: template`Bearer ${token()}`}});
  const options = (
    signal = new AbortController().signal,
    accessToken = tokenFor(900),
  ) => ({
    pkgDir,
    config: {
      phases: [{duration: 60, arrivalRate: 1}],
      thresholds: {default: {}},
    },
    engine: artillery(),
    target,
    token: accessToken,
    signal,
  });

  it('runs after and the cleanups when before fails, and keeps its error', async () => {
    const steps: string[] = [];
    const scenario = scenarioOf('before fails', [load.get('/a')], {
      before: async ctx => {
        ctx.defer(() => steps.push('cleanup'));
        throw new Error('before broke');
      },
      after: async () => {
        steps.push('after');
      },
    });

    await expect(execute(loadedOf(scenario), options())).to.be.rejectedWith(
      'before broke',
    );
    expect(steps).to.deepEqual(['after', 'cleanup']);
  });

  it('starts no load after a signal in before, and still cleans up', async () => {
    const controller = new AbortController();
    const steps: string[] = [];
    const scenario = scenarioOf('signal', [load.get('/a')], {
      before: async ctx => {
        ctx.defer(() => steps.push('cleanup'));
        controller.abort();
      },
    });

    await expect(
      execute(loadedOf(scenario), options(controller.signal)),
    ).to.be.rejected();
    expect(steps).to.deepEqual(['cleanup']);
    expect(
      fs.existsSync(path.join(pkgDir, 'src/__tests__/load/.out/signal.json')),
    ).to.be.false();
  });

  it('lets a cleanup that before registered use ctx.api after a signal', async () => {
    const seen: string[] = [];
    const server = http.createServer((req, res) => {
      seen.push(`${req.method} ${req.url}`);
      res.end();
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    const baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    const controller = new AbortController();
    const scenario = scenarioOf('api cleanup', [load.get('/a')], {
      before: async ctx => {
        ctx.defer(() => ctx.api.delete('/made'));
        controller.abort();
      },
    });

    try {
      await expect(
        execute(loadedOf(scenario), {
          ...options(controller.signal),
          target: {...target, baseUrl},
        }),
      ).to.be.rejected();
    } finally {
      server.close();
    }

    expect(seen).to.deepEqual(['DELETE /made']);
  });

  it('sends no authorization header with ctx.api, and sends one with ctx.api.with', async () => {
    const seen: (string | undefined)[] = [];
    const server = http.createServer((req, res) => {
      seen.push(req.headers.authorization);
      res.end();
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    const baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    const scenario = scenarioOf('api no token', [load.get('/a')], {
      before: async ctx => {
        await ctx.api.get('/plain');
        await ctx.api
          .with({headers: {authorization: `Bearer ${ctx.token}`}})
          .get('/with');
        throw new Error('stop here');
      },
    });
    const accessToken = tokenFor(900);

    try {
      await expect(
        execute(loadedOf(scenario), {
          ...options(undefined, accessToken),
          target: {...target, baseUrl},
        }),
      ).to.be.rejectedWith('stop here');
    } finally {
      server.close();
    }

    expect(seen).to.deepEqual([undefined, `Bearer ${accessToken}`]);
  });

  it('gives ctx.token and ctx.claims for a token, and undefined and {} without one', async () => {
    const seen: Pick<RunContext, 'token' | 'claims'>[] = [];
    const scenario = scenarioOf('ctx token', [load.get('/a')], {
      before: async ctx => {
        seen.push({token: ctx.token, claims: ctx.claims});
        throw new Error('stop here');
      },
    });
    const accessToken = tokenFor(900);

    await expect(
      execute(loadedOf(scenario), options(undefined, accessToken)),
    ).to.be.rejected();
    await expect(
      execute(loadedOf(scenario), {...options(), token: undefined}),
    ).to.be.rejected();

    expect(seen[0].token).to.equal(accessToken);
    expect(seen[0].claims).to.have.property('exp');
    expect(seen[1]).to.deepEqual({token: undefined, claims: {}});
  });

  it('cleans up when the script cannot be made', async () => {
    const steps: string[] = [];
    const scenario = scenarioOf(
      'bad script',
      [load.get('/a/{id}', {pathParams: {id: vars('missing')}})],
      {before: async ctx => ctx.defer(() => steps.push('cleanup'))},
    );

    await expect(execute(loadedOf(scenario), options())).to.be.rejectedWith(
      /vars\("missing"\) is set by neither before nor beforeEach/,
    );
    expect(steps).to.deepEqual(['cleanup']);
  });

  it('stops a load that takes longer than the access token lives', async () => {
    const scenario = scenarioOf('long', [withToken()]);

    await expect(
      execute(loadedOf(scenario), options(undefined, tokenFor(30))),
    ).to.be.rejectedWith(
      /The load takes 60 s, and the end of the run needs 120 s more, but the access token expires in (29|30) s/,
    );
  });

  it('reads a time that is a text: a 20 m load is too long for a token with 15 m left', async () => {
    const scenario = scenarioOf('text time', [withToken()], {
      phases: [{duration: '20m', arrivalRate: 1}],
    });

    await expect(
      execute(loadedOf(scenario), options(undefined, tokenFor(900))),
    ).to.be.rejectedWith(/The load takes 1200 s/);
  });

  it('stops when a time cannot be read and the token has an expiry', async () => {
    const scenario = scenarioOf('bad time', [withToken()], {
      phases: [{duration: 'soon', arrivalRate: 1}],
    });

    await expect(
      execute(loadedOf(scenario), options(undefined, tokenFor(900))),
    ).to.be.rejectedWith(/The time of a phase cannot be read/);
  });

  describe('with a fake engine', () => {
    const measurement: Measurement = {
      endpoints: new Map(),
      hookErrors: 0,
      vusers: {started: 1, completed: 1, failed: 0},
      seconds: 1,
    };
    /** An engine that records its input, and returns `measurement`. */
    const fakeEngine = () => {
      const inputs: EngineRun[] = [];
      const engine: Engine = {
        name: 'fake',
        run: async input => {
          inputs.push(input);
          return measurement;
        },
      };
      return {engine, inputs};
    };

    it('gives the engine what it needs, and adds the workload to the result', async () => {
      const {engine, inputs} = fakeEngine();
      const controller = new AbortController();
      const scenario = scenarioOf('fake', [load.get('/a')], {
        before: async (_ctx, runVars) => {
          runVars.orderId = 'd1';
        },
      });
      const opts = {...options(controller.signal), engine};

      const result = await execute(loadedOf(scenario), opts);

      expect(inputs).to.have.length(1);
      const [input] = inputs;
      expect(input.pkgDir).to.equal(pkgDir);
      expect(input.scenario).to.equal(scenario);
      expect(input.config).to.equal(opts.config);
      expect(input.phases).to.deepEqual([{duration: 60, arrivalRate: 1}]);
      expect(input.runVars).to.deepEqual({orderId: 'd1'});
      expect(input.endpointIds).to.deepEqual(['GET /a']);
      expect(input.baseUrl).to.equal(target.baseUrl);
      expect(input.token).to.be.undefined();
      expect(input.signal).to.equal(controller.signal);
      expect(result.workload).to.equal('1 vusers/s for 60 s');
      expect(result.vusers).to.equal(measurement.vusers);
      expect(result.problems).to.deepEqual([]);
    });

    it('gives the phases of the scenario when it has its own', async () => {
      const {engine, inputs} = fakeEngine();
      const scenario = scenarioOf('own', [load.get('/a')], {
        phases: [{duration: 10, arrivalRate: 2}],
      });

      await execute(loadedOf(scenario), {...options(), engine});

      expect(inputs[0].phases).to.deepEqual([{duration: 10, arrivalRate: 2}]);
    });

    describe('after, the cleanups and the SQL connections', () => {
      /** A datasource that records when its connection ends. */
      const recordingSql = (steps: string[]) => ({
        db: {
          connect: async () => ({
            query: async () => ({rows: []}),
            end: async () => {
              steps.push('close');
            },
          }),
        },
      });
      const run = (scenario: Scenario, steps: string[]) =>
        execute(loadedOf(scenario), {
          ...options(),
          config: {
            phases: [{duration: 60, arrivalRate: 1}],
            thresholds: {default: {}},
            datasources: recordingSql(steps),
          },
          engine: fakeEngine().engine,
        });

      it('runs after, then the cleanups last first, then closes SQL', async () => {
        const steps: string[] = [];
        const scenario = scenarioOf('order', [load.get('/a')], {
          before: async ctx => {
            await ctx.sql('db', 'select 1');
            ctx.defer(() => steps.push('cleanup 1'));
            ctx.defer(() => steps.push('cleanup 2'));
          },
          after: async () => {
            steps.push('after');
          },
        });

        const ran = await run(scenario, steps);

        expect(steps).to.deepEqual([
          'after',
          'cleanup 2',
          'cleanup 1',
          'close',
        ]);
        expect(ran.problems).to.deepEqual([]);
      });

      it('runs the cleanups and closes SQL when after fails, and says what failed', async () => {
        const steps: string[] = [];
        const scenario = scenarioOf('after fails', [load.get('/a')], {
          before: async ctx => {
            await ctx.sql('db', 'select 1');
            ctx.defer(() => steps.push('cleanup'));
          },
          after: async () => {
            throw new Error('boom');
          },
        });

        const ran = await run(scenario, steps);

        expect(steps).to.deepEqual(['cleanup', 'close']);
        expect(ran.problems).to.deepEqual(['after failed: boom']);
      });

      it('says that a cleanup failed, and still closes SQL', async () => {
        const steps: string[] = [];
        const scenario = scenarioOf('cleanup fails', [load.get('/a')], {
          before: async ctx => {
            await ctx.sql('db', 'select 1');
            ctx.defer(() => {
              throw new Error('gone');
            });
          },
        });

        const ran = await run(scenario, steps);

        expect(steps).to.deepEqual(['close']);
        expect(ran.problems).to.deepEqual(['cleanup failed: gone']);
      });
    });

    it('does not call the engine when before fails', async () => {
      const {engine, inputs} = fakeEngine();
      const scenario = scenarioOf('before fails', [load.get('/a')], {
        before: async () => {
          throw new Error('before broke');
        },
      });

      await expect(
        execute(loadedOf(scenario), {...options(), engine}),
      ).to.be.rejectedWith('before broke');
      expect(inputs).to.have.length(0);
    });

    it('does not stop a scenario that does not use token() because of a short token', async () => {
      const {engine, inputs} = fakeEngine();
      const scenario = scenarioOf('no token use', [load.get('/a')]);

      await execute(loadedOf(scenario), {
        ...options(undefined, tokenFor(30)),
        engine,
      });

      expect(inputs).to.have.length(1);
    });

    it('gives the token to the engine only for a scenario that uses token()', async () => {
      const {engine, inputs} = fakeEngine();
      const accessToken = tokenFor(900);
      const opts = {...options(undefined, accessToken), engine};

      await execute(loadedOf(scenarioOf('plain', [load.get('/a')])), opts);
      await execute(loadedOf(scenarioOf('secured', [withToken()])), opts);

      expect(inputs[0].token).to.be.undefined();
      expect(inputs[1].token).to.equal(accessToken);
    });

    it('runs no token check and sends no token to the engine without a login', async () => {
      const {engine, inputs} = fakeEngine();
      const scenario = scenarioOf('no login', [withToken()], {
        tokenCheck: () => {
          throw new Error('must not run');
        },
      });

      await execute(loadedOf(scenario), {
        ...options(),
        token: undefined,
        engine,
      });

      expect(inputs[0].token).to.be.undefined();
    });

    describe('tokenCheck', () => {
      const claims = {exp: Date.now() / 1000 + 900, sub: 'u'};
      const jwt = `x.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.y`;

      it('lets the check of the scenario replace the one of config.ts, and gives it the token, the claims and the phases', async () => {
        const {engine, inputs} = fakeEngine();
        const calls: unknown[] = [];
        const scenario = scenarioOf('own check', [withToken()], {
          phases: [{duration: 7, arrivalRate: 1}],
          tokenCheck: info => calls.push(['scenario', info]),
        });
        const config = {
          ...options().config,
          tokenCheck: () => calls.push(['config']),
        };

        await execute(loadedOf(scenario), {
          ...options(undefined, jwt),
          config,
          engine,
        });

        expect(calls).to.deepEqual([
          [
            'scenario',
            {token: jwt, claims, phases: [{duration: 7, arrivalRate: 1}]},
          ],
        ]);
        expect(inputs).to.have.length(1);
      });

      it('lets the check of config.ts replace the default one', async () => {
        const {engine, inputs} = fakeEngine();
        const calls: unknown[] = [];
        const scenario = scenarioOf('config check', [withToken()]);
        const config = {
          ...options().config,
          tokenCheck: (info: unknown) => calls.push(info),
        };

        // A token that the default check would refuse: 30 s left, 60 s of load.
        const short = `x.${Buffer.from(JSON.stringify({exp: Date.now() / 1000 + 30})).toString('base64url')}.y`;
        await execute(loadedOf(scenario), {
          ...options(undefined, short),
          config,
          engine,
        });

        expect(calls).to.have.length(1);
        expect(inputs).to.have.length(1);
      });

      it('stops the run, before the engine, when the check throws', async () => {
        const {engine, inputs} = fakeEngine();
        const scenario = scenarioOf('throws', [withToken()], {
          tokenCheck: () => {
            throw new Error('too weak');
          },
        });

        await expect(
          execute(loadedOf(scenario), {...options(), engine}),
        ).to.be.rejectedWith('too weak');
        expect(inputs).to.have.length(0);
      });
    });

    it('does not call the engine when the token is too short for the load', async () => {
      const {engine, inputs} = fakeEngine();
      const scenario = scenarioOf('short token', [withToken()]);

      await expect(
        execute(loadedOf(scenario), {
          ...options(undefined, tokenFor(30)),
          engine,
        }),
      ).to.be.rejectedWith(/access token expires/);
      expect(inputs).to.have.length(0);
    });
  });

  it('keeps a margin for the end of the run: a token with 150 s left is too short for a 60 s load', async () => {
    const scenario = scenarioOf('margin', [withToken()]);

    await expect(
      execute(loadedOf(scenario), options(undefined, tokenFor(150))),
    ).to.be.rejectedWith(/expires in (149|150) s/);
  });
});

describe('runScenarios', () => {
  const ran: ScenarioRun = {
    endpoints: new Map([['GET /a', {count: 10, failed: 0, p95: 5}]]),
    hookErrors: 0,
    vusers: {started: 10, completed: 10, failed: 0},
    seconds: 1,
    workload: '10 vusers/s for 1 s',
    problems: [],
  };
  const scenarios = ['a', 'b', 'c'].map(name =>
    loadedOf(scenarioOf(name, [load.get('/a')])),
  );
  const options = (signal = new AbortController().signal) => ({
    vuserLimits: resolveThresholds({}),
    signal,
  });

  it('fails a scenario that throws, and runs the next ones', async () => {
    const outcome = await runScenarios(
      scenarios,
      async ({scenario}) => {
        if (scenario.name === 'a') throw new Error('boom');
        return ran;
      },
      options(),
    );

    expect(outcome.scenarios.map(scenario => scenario.passed)).to.deepEqual([
      false,
      true,
      true,
    ]);
    expect(outcome.scenarios.map(scenario => scenario.name)).to.deepEqual([
      'a',
      'b',
      'c',
    ]);
    expect(outcome.scenarios[0].error).to.equal('boom');
    expect(Object.keys(outcome.measured)).to.deepEqual(['b', 'c']);
  });

  it('stops at a signal, and keeps the results of the scenarios that ended', async () => {
    const controller = new AbortController();
    const started: string[] = [];

    const outcome = await runScenarios(
      scenarios,
      async ({scenario}) => {
        started.push(scenario.name);
        if (scenario.name === 'b') {
          controller.abort();
          throw new Error('stopped');
        }
        return ran;
      },
      options(controller.signal),
    );

    expect(started).to.deepEqual(['a', 'b']);
    expect(outcome.scenarios.map(scenario => scenario.name)).to.deepEqual([
      'a',
    ]);
    expect((outcome.stopped as Error).message).to.equal('stopped');
  });

  it('reports a signal that came while the last scenario cleaned up', async () => {
    const controller = new AbortController();

    const outcome = await runScenarios(
      [scenarios[0]],
      async () => {
        controller.abort(new Error('late signal'));
        return ran;
      },
      options(controller.signal),
    );

    expect(outcome.scenarios.map(scenario => scenario.name)).to.deepEqual([
      'a',
    ]);
    expect((outcome.stopped as Error).message).to.equal('late signal');
  });

  it('does not start the next scenario after a signal that the last one survived', async () => {
    const controller = new AbortController();
    const started: string[] = [];

    const outcome = await runScenarios(
      scenarios,
      async ({scenario}) => {
        started.push(scenario.name);
        controller.abort(new Error('signal'));
        return ran;
      },
      options(controller.signal),
    );

    expect(started).to.deepEqual(['a']);
    expect(outcome.scenarios.map(scenario => scenario.name)).to.deepEqual([
      'a',
    ]);
    expect((outcome.stopped as Error).message).to.equal('signal');
  });
});
