// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import type {AddressInfo} from 'node:net';
import os from 'node:os';
import path from 'node:path';
import {expect} from '@loopback/testlab';
import {main} from '../../cli';
import {output} from '../../output';
import type {RunResult} from '../../report/types';

type Env = Record<string, string | undefined>;

/**
 * Runs `main` with this environment, and returns its exit code and what it
 * printed. The output comes back after. `main` reads `env` and not
 * `process.env`. Artillery writes to the real output, which this does not
 * capture.
 */
async function runMain(
  args: string[],
  env: Env,
): Promise<{code: number; out: string}> {
  const text: string[] = [];
  const {out, err} = output;
  output.out = output.err = (chunk: string) => {
    text.push(chunk);
  };
  try {
    return {code: await main(args, env), out: text.join('')};
  } finally {
    output.out = out;
    output.err = err;
  }
}

describe('main', () => {
  const NO_TARGET: Env = {
    LOAD_TESTS_BASE_URL: undefined,
    LOAD_TESTS_USERNAME: undefined,
    LOAD_TESTS_PASSWORD: undefined,
    LOAD_TESTS_CLIENT_ID: undefined,
    LOAD_TESTS_CLIENT_SECRET: undefined,
  };

  it('prints the usage and gives 1 for a command that does not exist', async () => {
    const {code, out} = await runMain(['nope'], {});

    expect(code).to.equal(1);
    expect(out).to.match(/Usage:/);
  });

  it('says in the usage that the login variables are required when the username is set', async () => {
    const {out} = await runMain(['--help'], {});

    expect(out).to.match(/Required when LOAD_TESTS_USERNAME is set/);
    expect(out).to.not.match(/Needed only by scenarios/);
  });

  it('prints the message and the usage, and no stack, for an option that does not exist', async () => {
    const {code, out} = await runMain(['run', '--nope', os.tmpdir()], {});

    expect(code).to.equal(1);
    expect(out).to.match(/Unknown option '--nope'/);
    expect(out).to.match(/Usage:/);
    expect(out).to.not.match(/\n\s+at /);
  });

  it('prints the usage and gives 0 for --help', async () => {
    const {code, out} = await runMain(['--help'], {});

    expect(code).to.equal(0);
    expect(out).to.match(/Usage:/);
  });

  it('prints the message of an error and gives 1', async () => {
    const {code, out} = await runMain(['run', os.tmpdir()], NO_TARGET);

    expect(code).to.equal(1);
    expect(out).to.match(/LOAD_TESTS_BASE_URL/);
  });

  it('prints only the message for an error of the library', async () => {
    const {out} = await runMain(['run', os.tmpdir()], NO_TARGET);

    expect(out).to.not.match(/\n\s+at /);
  });

  it('prints the stack for any other error', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lt-cli-'));
    const built = path.join(dir, 'dist/__tests__/load');
    fs.mkdirSync(built, {recursive: true});
    fs.writeFileSync(
      path.join(built, 'config.js'),
      'throw new SyntaxError("broken config");',
    );
    fs.mkdirSync(path.join(dir, 'src/__tests__/load'), {recursive: true});
    fs.writeFileSync(path.join(dir, 'src/__tests__/load/config.ts'), '');
    const {out} = await runMain(['run', dir], {
      ...NO_TARGET,
      LOAD_TESTS_BASE_URL: 'http://localhost:1',
      LOAD_TESTS_USERNAME: 'u',
      LOAD_TESTS_PASSWORD: 'p',
      LOAD_TESTS_CLIENT_ID: 'c',
      LOAD_TESTS_CLIENT_SECRET: 's',
    });
    fs.rmSync(dir, {recursive: true, force: true});

    expect(out).to.match(/broken config/);
    expect(out).to.match(/\n\s+at /);
  });
});

/**
 * The whole run against a stub server: login, `before`, the transpiled script
 * in a real Artillery, `after`, the report, the exit code and the baseline.
 */
describe('main with a stub server', () => {
  const BASELINE = path.join(
    'src',
    '__tests__',
    'load',
    '.out',
    'baseline.json',
  );
  const builder = JSON.stringify(require.resolve('../../scenario/builder'));
  const values = JSON.stringify(require.resolve('../../scenario/values'));
  /** What the stub server got, in order. */
  let seen: {url?: string; authorization?: string; secret?: string}[] = [];
  const dirs: string[] = [];
  let server: http.Server;
  let env: Env;
  const NO_LOGIN = {
    LOAD_TESTS_USERNAME: undefined,
    LOAD_TESTS_PASSWORD: undefined,
    LOAD_TESTS_CLIENT_ID: undefined,
    LOAD_TESTS_CLIENT_SECRET: undefined,
    LOAD_TESTS_UPDATE_BASELINE: undefined,
  };

  before(async () => {
    const seconds = Math.floor(Date.now() / 1000);
    const claims = Buffer.from(
      JSON.stringify({iat: seconds, exp: seconds + 900}),
    ).toString('base64url');
    const session = {accessToken: `x.${claims}.y`, refreshToken: 'r'};
    server = http.createServer((req, res) => {
      seen.push({
        url: req.url,
        authorization: req.headers.authorization,
        secret: req.headers['x-secret'] as string | undefined,
      });
      const reply = (status: number, body: unknown) => {
        res.writeHead(status, {'content-type': 'application/json'});
        res.end(JSON.stringify(body));
      };
      if (req.url === '/auth/login') return reply(200, {code: 'k'});
      if (req.url === '/auth/token') return reply(200, session);
      if (req.url === '/auth/token-refresh') return reply(200, session);
      if (req.url === '/order') return reply(200, {id: 'abc'});
      if (req.url === '/orders') return reply(200, {id: '{{ $env.PATH }}'});
      reply(req.url === '/broken' ? 500 : 200, []);
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    env = {
      LOAD_TESTS_BASE_URL: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
      LOAD_TESTS_AUTH_URL: undefined,
      LOAD_TESTS_USERNAME: 'u',
      LOAD_TESTS_PASSWORD: 'p',
      LOAD_TESTS_CLIENT_ID: 'c',
      LOAD_TESTS_CLIENT_SECRET: 's',
      LOAD_TESTS_UPDATE_BASELINE: '1',
      LOAD_TESTS_FORCE_BASELINE: undefined,
    };
  });
  after(async () => {
    server.close();
    dirs.forEach(dir => fs.rmSync(dir, {recursive: true}));
  });

  beforeEach(() => {
    seen = [];
  });

  /** A package with one built load file that has `scenarios` as its source. */
  function packageWith(scenarios: string, configExtra = ''): string {
    const pkg = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-pkg-'));
    dirs.push(pkg);
    const write = (file: string, content: string) => {
      fs.mkdirSync(path.dirname(path.join(pkg, file)), {recursive: true});
      fs.writeFileSync(path.join(pkg, file), content);
    };
    write('src/__tests__/load/config.ts', '');
    write(
      'dist/__tests__/load/config.js',
      `exports.default = {phases: [{arrivalRate: 3, duration: 1}], thresholds: {default: {}}${configExtra}};`,
    );
    write('src/__tests__/load/s.load.ts', '');
    write(
      'dist/__tests__/load/s.load.js',
      `const {load} = require(${builder});\nconst {captureFrom, template, token} = require(${values});\n${scenarios}`,
    );
    write(
      'src/openapi.json',
      JSON.stringify({
        paths: {
          '/items': {get: {}},
          '/broken': {get: {}},
          '/order': {get: {}},
          '/order/{id}': {get: {}},
          '/orders': {get: {}},
          '/order-items/{id}': {get: {}},
        },
      }),
    );
    return pkg;
  }

  it('runs a scenario, prints its block, and saves the baseline', async () => {
    const pkg = packageWith(`load.it('browse items', [load.get('/items')]);`);

    const {code, out} = await runMain(['run', pkg], env);

    expect(code).to.equal(0);
    expect(out).to.match(/browse items\nWorkload: 3 vusers\/s for 1 s\n/);
    expect(out).to.match(/Vusers: +\d+ started, \d+ completed, 0 failed/);
    expect(out).to.match(/GET \/items +\d+ .*pass \(no baseline\)/);
    const baseline = JSON.parse(
      fs.readFileSync(path.join(pkg, BASELINE), 'utf8'),
    );
    expect(baseline.workloads).to.deepEqual({
      'browse items': '3 vusers/s for 1 s',
    });
    expect(baseline.history['browse items']['GET /items']).to.have.length(1);
  }).timeout(60_000);

  /**
   * The text of a `config.ts` option `engine` that does not start Artillery.
   * It gives each endpoint 100 requests, none failed, and `p95` as its p95.
   */
  const fakeEngine = (p95: number) => `, engine: {
  name: 'fake',
  run: async ({endpointIds}) => ({
    endpoints: new Map(endpointIds.map(id => [id, {count: 100, failed: 0, p95: ${p95}}])),
    hookErrors: 0,
    vusers: {started: 3, completed: 3, failed: 0},
    seconds: 1,
  }),
}`;

  /** The p95 that the fake engine of a reporter test measures. */
  const REPORTER_P95_MS = 50;

  describe('with an existing baseline', () => {
    const SCENARIO = `load.it('browse items', [load.get('/items')]);`;
    const WORKLOAD = '3 vusers/s for 1 s';
    const MAX_HISTORY = 10;
    /** The p95 that the fake engine measures. It is under the baseline mean of 150. */
    const FAST_P95_MS = 120;
    /** The p95 that the fake engine measures when the run must be slower than its baseline. */
    const SLOW_P95_MS = 50;
    const ROW = /GET \/items +\d+ +[\d.-]+ +[\d.]+ \([\d.]+\) +([\d.-]+) /;

    /** Writes the baseline file that `readBaseline` reads. */
    function recordBaseline(
      pkg: string,
      history: number[],
      {baseUrl = env.LOAD_TESTS_BASE_URL, workload = WORKLOAD} = {},
    ) {
      const file = path.join(pkg, BASELINE);
      fs.mkdirSync(path.dirname(file), {recursive: true});
      fs.writeFileSync(
        file,
        JSON.stringify({
          baseUrl,
          recordedAt: '2026-01-01T00:00:00.000Z',
          history: {'browse items': {'GET /items': history}},
          workloads: {'browse items': workload},
        }),
      );
    }
    const historyOf = (pkg: string): number[] =>
      JSON.parse(fs.readFileSync(path.join(pkg, BASELINE), 'utf8')).history[
        'browse items'
      ]['GET /items'];

    it('passes and shows the mean of the history in the Base ms column when the run is faster', async () => {
      const pkg = packageWith(SCENARIO, fakeEngine(FAST_P95_MS));
      recordBaseline(pkg, [100, 200]);

      const {code, out} = await runMain(['run', pkg], {
        ...env,
        LOAD_TESTS_UPDATE_BASELINE: undefined,
      });

      expect(code).to.equal(0);
      expect(out.match(ROW)?.[1]).to.equal('150');
      expect(out).to.match(/GET \/items .* pass\n/);
      expect(out).to.not.match(/no baseline/);
      expect(out).to.not.match(/The baseline is from/);
    });

    it('fails the run when the p95 is over the mean of the history by more than the limits', async () => {
      const pkg = packageWith(
        SCENARIO,
        `, thresholds: {default: {p95Regression: 1, minDelta: 0}}${fakeEngine(SLOW_P95_MS)}`,
      );
      recordBaseline(pkg, [0.1, 0.1]);

      const {code, out} = await runMain(['run', pkg], {
        ...env,
        LOAD_TESTS_UPDATE_BASELINE: undefined,
      });

      expect(code).to.equal(1);
      expect(out).to.containEql(
        'FAIL: p95 +49900% (+49.9 ms) over baseline 0.1 ms',
      );
      expect(out.match(ROW)?.[1]).to.equal('0.1');
    });

    it('does not compare the p95 when the workload changed, says so, and starts a new history', async () => {
      const pkg = packageWith(
        SCENARIO,
        `, thresholds: {default: {p95Regression: 1, minDelta: 0}}${fakeEngine(SLOW_P95_MS)}`,
      );
      recordBaseline(pkg, [0.1, 0.1], {workload: '4 vusers/s for 1 s'});

      const {code, out} = await runMain(['run', pkg], env);

      expect(code).to.equal(0);
      expect(out).to.match(
        /Baseline: recorded with 4 vusers\/s for 1 s, so p95 is not compared/,
      );
      expect(out).to.match(/GET \/items .* pass \(workload changed\)/);
      expect(out.match(ROW)?.[1]).to.equal('-');
      expect(historyOf(pkg)).to.deepEqual([SLOW_P95_MS]);
      expect(
        JSON.parse(fs.readFileSync(path.join(pkg, BASELINE), 'utf8')).workloads,
      ).to.deepEqual({'browse items': WORKLOAD});
    });

    it('says that the baseline is from another URL, and still compares with it', async () => {
      const pkg = packageWith(SCENARIO, fakeEngine(FAST_P95_MS));
      recordBaseline(pkg, [100, 200], {baseUrl: 'http://other.example'});

      const {code, out} = await runMain(['run', pkg], {
        ...env,
        LOAD_TESTS_UPDATE_BASELINE: undefined,
      });

      expect(code).to.equal(0);
      expect(out).to.containEql(
        `The baseline is from http://other.example, not ${env.LOAD_TESTS_BASE_URL}.`,
      );
      expect(out.match(ROW)?.[1]).to.equal('150');
    });

    it('adds the new run to the history and keeps the old runs', async () => {
      const pkg = packageWith(SCENARIO, fakeEngine(FAST_P95_MS));
      recordBaseline(pkg, [100, 200]);

      const {code} = await runMain(['run', pkg], env);

      expect(code).to.equal(0);
      expect(historyOf(pkg)).to.deepEqual([100, 200, FAST_P95_MS]);
    });

    it('keeps at most ten runs, and drops the oldest', async () => {
      const pkg = packageWith(SCENARIO, fakeEngine(FAST_P95_MS));
      const old = Array.from({length: MAX_HISTORY}, (_, i) => 100 + i);
      recordBaseline(pkg, old);

      const {code} = await runMain(['run', pkg], env);

      expect(code).to.equal(0);
      expect(historyOf(pkg)).to.deepEqual([...old.slice(1), FAST_P95_MS]);
    });

    it('adds a real Artillery run to the history of the baseline', async () => {
      /* Wide limits keep a slow runner from failing this run. A p95 limit above 1000 ms is a heavy API, so one is allowed. */
      const pkg = packageWith(
        SCENARIO,
        ', maxHeavyApis: 1, thresholds: {default: {p95: 60_000, minDelta: 60_000}}',
      );
      recordBaseline(pkg, [100, 200]);

      const {code} = await runMain(['run', pkg], env);

      const history = historyOf(pkg);
      expect(code).to.equal(0);
      expect(history).to.have.length(3);
      expect(history.slice(0, 2)).to.deepEqual([100, 200]);
      expect(history[2]).to.be.a.Number();
    }).timeout(60_000);
  });

  it('fails the run for a failing endpoint and for a failing after, and saves no baseline', async () => {
    const pkg = packageWith(`
load.it('browse items', [load.get('/items')], {
  after: () => {
    throw new Error('after broke');
  },
});
load.it('break things', [load.get('/broken')]);`);

    const {code, out} = await runMain(['run', pkg], env);

    expect(code).to.equal(1);
    expect(out).to.match(/FAIL: after failed: after broke/);
    expect(out).to.match(/GET \/broken +\d+ .*FAIL: error rate 100% > 1%/);
    expect(out).to.match(/Baseline not changed/);
    expect(fs.existsSync(path.join(pkg, BASELINE))).to.be.false();
  }).timeout(60_000);

  it('saves no baseline when only a cleanup fails and every endpoint passes', async () => {
    // Rows that a failed cleanup leaves can skew the next run.
    const pkg = packageWith(`
load.it('browse items', [load.get('/items')], {
  before: async ctx => {
    ctx.defer(() => {
      throw new Error('cleanup broke');
    });
  },
});`);

    const {code, out} = await runMain(['run', pkg], env);

    expect(code).to.equal(1);
    expect(out).to.match(/FAIL: cleanup failed: cleanup broke/);
    expect(out).to.match(/GET \/items +\d+ .*pass/);
    expect(out).to.match(/Baseline not changed/);
    expect(fs.existsSync(path.join(pkg, BASELINE))).to.be.false();
  }).timeout(60_000);

  it('fails the run for a heavy API when maxHeavyApis is not set', async () => {
    const pkg = packageWith(
      `load.it('slow items', [load.get('/items', {p95: 2000})]);`,
    );

    const {code, out} = await runMain(['run', pkg], env);

    expect(code).to.equal(1);
    expect(out).to.match(
      /FAIL: 1 heavy API, but maxHeavyApis is 0\. Lower the p95 limit/,
    );
    expect(out).to.match(/GET \/items +\d+ .*pass/);
    expect(fs.existsSync(path.join(pkg, BASELINE))).to.be.false();
  }).timeout(60_000);

  it('passes a heavy API that maxHeavyApis allows, and lists it', async () => {
    const pkg = packageWith(
      `load.it('slow items', [load.get('/items', {p95: 2000})]);`,
      ', maxHeavyApis: 1',
    );

    const {code, out} = await runMain(['run', pkg], env);

    expect(code).to.equal(0);
    expect(out).to.match(/Heavy APIs: 1 of at most 1 \(maxHeavyApis/);
    expect(out).to.match(/\n {2}GET \/items {2}2000 ms\n/);
    expect(out).to.not.match(/FAIL: 1 heavy/);
  }).timeout(60_000);

  it('sends login and refresh to LOAD_TESTS_AUTH_URL, and the scenario requests with the new token to the base URL', async () => {
    const pkg = packageWith(`
load.it('with token', [load.get('/items')], {
  headers: {authorization: template\`Bearer \${token()}\`},
});`);
    const OLD_TOKEN_AGE_SECONDS = 120;
    const TOKEN_LIFE_SECONDS = 900;
    const sessionOf = (prefix: string, issuedAgo: number) => {
      const issued = Math.floor(Date.now() / 1000) - issuedAgo;
      const claims = Buffer.from(
        JSON.stringify({iat: issued, exp: issued + TOKEN_LIFE_SECONDS}),
      ).toString('base64url');
      return {accessToken: `${prefix}.${claims}.y`, refreshToken: 'r'};
    };
    const authSeen: string[] = [];
    const authServer = http.createServer((req, res) => {
      authSeen.push(`${req.method} ${req.url}`);
      const replies: Record<string, unknown> = {
        '/auth/login': {code: 'k'},
        '/auth/token': sessionOf('old', OLD_TOKEN_AGE_SECONDS),
        '/auth/token-refresh': sessionOf('new', 0),
      };
      res.writeHead(200, {'content-type': 'application/json'});
      res.end(JSON.stringify(replies[req.url ?? ''] ?? {}));
    });
    await new Promise<void>(resolve =>
      authServer.listen(0, '127.0.0.1', resolve),
    );
    const authUrl = `http://127.0.0.1:${(authServer.address() as AddressInfo).port}/`;

    try {
      const {code} = await runMain(['run', pkg], {
        ...env,
        LOAD_TESTS_AUTH_URL: authUrl,
      });

      const items = seen.filter(call => call.url === '/items');
      expect(code).to.equal(0);
      expect(authSeen).to.deepEqual([
        'POST /auth/login',
        'POST /auth/token',
        'POST /auth/token-refresh',
      ]);
      expect(seen.filter(call => call.url?.startsWith('/auth/'))).to.deepEqual(
        [],
      );
      expect(items.length).to.be.greaterThan(0);
      expect(
        items.every(call => call.authorization?.startsWith('Bearer new.')),
      ).to.be.true();
    } finally {
      authServer.close();
    }
  }).timeout(60_000);

  it('gives 130 and prints Cancelled. after a SIGINT', async () => {
    const pkg = packageWith(`
load.it('cancelled', [load.get('/items')], {
  before: async () => {
    process.emit('SIGINT', 'SIGINT');
  },
});`);

    const {code, out} = await runMain(['run', pkg], {...env, ...NO_LOGIN});

    expect(code).to.equal(130);
    expect(out).to.match(/Cancelled\./);
    expect(seen.map(call => call.url)).to.not.containEql('/items');
  });

  it('gives 130 and prints Cancelled. at once when a SIGINT comes during a login that hangs', async () => {
    const pkg = packageWith(`load.it('browse items', [load.get('/items')]);`);
    let reached: () => void = () => undefined;
    const requested = new Promise<void>(resolve => (reached = resolve));
    const hanging = http.createServer(reached);
    await new Promise<void>(resolve => hanging.listen(0, '127.0.0.1', resolve));
    const authUrl = `http://127.0.0.1:${(hanging.address() as AddressInfo).port}`;
    const MAX_CANCEL_MS = 10_000;
    const started = Date.now();

    try {
      const running = runMain(['run', pkg], {
        ...env,
        LOAD_TESTS_AUTH_URL: authUrl,
      });
      await requested;
      process.emit('SIGINT', 'SIGINT');
      const {code, out} = await running;

      expect(code).to.equal(130);
      expect(out).to.match(/Cancelled\./);
      expect(Date.now() - started).to.be.below(MAX_CANCEL_MS);
    } finally {
      hanging.closeAllConnections();
      hanging.close();
    }
  }).timeout(30_000);

  it('runs the requests of a parallel group, and a later request captures from one', async () => {
    const pkg = packageWith(`
load.it('parallel flow', [
  load.parallel([load.get('/items'), load.get('/order')]),
  load.get('/order/{id}', {pathParams: {id: captureFrom('GET /order', '$.id')}}),
]);`);

    const {code, out} = await runMain(['run', pkg], env);

    const urls = seen.map(call => call.url);
    expect(code).to.equal(0);
    expect(out).to.match(/GET \/items +\d+/);
    expect(out).to.match(/GET \/order +\d+/);
    expect(out).to.match(/GET \/order\/\{id\} +\d+/);
    expect(urls).to.containEql('/items');
    expect(urls).to.containEql('/order');
    expect(urls).to.containEql('/order/abc');
  }).timeout(60_000);

  describe('reporters', () => {
    const ITEMS = `load.it('browse items', [load.get('/items')]);`;
    const globals = globalThis as {
      lt?: {calls: string[]; result?: RunResult};
    };
    beforeEach(() => {
      globals.lt = {calls: []};
    });
    afterEach(() => {
      delete globals.lt;
    });

    it('gives the RunResult to a custom reporter, and prints no results for reporters: []', async () => {
      const pkg = packageWith(
        ITEMS,
        `, reporters: [{name: 'mine', onRunEnd: result => { globalThis.lt.result = result; }}]`,
      );

      const {code, out} = await runMain(['run', pkg], env);

      const result = globals.lt?.result;
      expect(code).to.equal(0);
      expect(out).to.not.match(/Results/);
      expect(result?.passed).to.be.true();
      expect(result?.stopped).to.be.false();
      expect(result?.hasBaseline).to.be.false();
      expect(result?.coverage).to.deepEqual({
        covered: 1,
        total: 6,
        specFile: path.join('src', 'openapi.json'),
      });
      expect(result?.scenarios.map(s => s.name)).to.deepEqual(['browse items']);
      expect(result?.scenarios[0].endpoints[0].id).to.equal('GET /items');
    }).timeout(60_000);

    it('prints the console report by default', async () => {
      const pkg = packageWith(ITEMS);

      const {out} = await runMain(['run', pkg], env);

      expect(out).to.match(/\nResults\n/);
      expect(out).to.match(/Coverage: 1 of 6 endpoints in /);
      expect(out).to.match(/A vuser is one virtual user/);
    }).timeout(60_000);

    it('gives 1 for a reporter that throws, and still runs the next reporters', async () => {
      const pkg = packageWith(
        ITEMS,
        `, reporters: [
  {name: 'bad', onRunEnd: () => { throw new Error('no disk'); }},
  {name: 'async bad', onRunEnd: async () => { throw new Error('no net'); }},
  {name: 'good', onRunEnd: () => { globalThis.lt.calls.push('good'); }},
]`,
      );

      const {code, out} = await runMain(['run', pkg], env);

      expect(code).to.equal(1);
      expect(out).to.match(/reporter bad failed: no disk/);
      expect(out).to.match(/reporter async bad failed: no net/);
      expect(globals.lt?.calls).to.deepEqual(['good']);
    }).timeout(60_000);

    it('does not change the baseline when a reporter fails, and says so', async () => {
      const pkg = packageWith(
        ITEMS,
        `, reporters: [{name: 'bad', onRunEnd: () => { throw new Error('no disk'); }}]${fakeEngine(REPORTER_P95_MS)}`,
      );

      const {code, out} = await runMain(['run', pkg], env);

      expect(code).to.equal(1);
      expect(out).to.match(/Baseline not changed/);
      expect(fs.existsSync(path.join(pkg, BASELINE))).to.be.false();
    });
  });

  it('runs without login variables when no scenario uses token(), and makes no login call', async () => {
    const pkg = packageWith(`load.it('browse items', [load.get('/items')]);`);

    const {code} = await runMain(['run', pkg], {...env, ...NO_LOGIN});

    expect(code).to.equal(0);
    expect(seen.length).to.be.greaterThan(0);
    expect(seen.map(call => call.url)).to.not.containEql('/auth/login');
    expect(seen.every(call => call.authorization === undefined)).to.be.true();
  }).timeout(60_000);

  it('sends the token on a request that asks for it, and only there', async () => {
    const pkg = packageWith(`
load.it('with token', [load.get('/items')], {
  headers: {authorization: template\`Bearer \${token()}\`},
});`);

    const {code} = await runMain(['run', pkg], env);

    const items = seen.filter(call => call.url === '/items');
    expect(code).to.equal(0);
    expect(items.length).to.be.greaterThan(0);
    expect(
      items.every(call => call.authorization?.startsWith('Bearer x.')),
    ).to.be.true();
  }).timeout(60_000);

  it('stops with a ConfigError before login and before, when a scenario uses token() and there is no login', async () => {
    const pkg = packageWith(`
load.it('needs token', [load.get('/items')], {
  headers: {authorization: template\`Bearer \${token()}\`},
  before: async () => {
    globalThis.beforeWasCalled = true;
  },
});
load.it('plain', [load.get('/items')]);`);

    const {code, out} = await runMain(['run', pkg], {...env, ...NO_LOGIN});

    expect(code).to.equal(1);
    expect(out).to.match(/token\(\) needs a login: set LOAD_TESTS_USERNAME/);
    expect(out).to.match(/\n\s+needs token\n/);
    expect(out).to.not.match(/plain/);
    expect(seen).to.deepEqual([]);
    expect(
      (globalThis as {beforeWasCalled?: boolean}).beforeWasCalled,
    ).to.be.undefined();
  });

  it('stops a vuser whose captured value has braces, before it sends the value', async () => {
    const pkg = packageWith(`
load.it('chain', [
  load.get('/orders'),
  load.get('/order-items/{id}', {
    pathParams: {id: captureFrom('GET /orders', '$.id')},
  }),
]);`);

    const {code, out} = await runMain(['run', pkg], env);

    const leaked = seen.filter(({url = ''}) => {
      return url.startsWith('/order-items') || url.includes('%7B%7B');
    });
    expect(code).to.equal(1);
    expect(out).to.match(/Hooks: +\d+ error\(s\)/);
    expect(seen.some(call => call.url === '/orders')).to.be.true();
    expect(leaked).to.deepEqual([]);
  }).timeout(60_000);

  describe('the environment of Artillery', () => {
    const SECRET_NAME = 'LT_E2E_SECRET';
    const SECRET_VALUE = 'top-secret-value';
    const SECRET_HEADER = `, artillery: {config: {http: {defaults: {headers: {'x-secret': '{{ $env.${SECRET_NAME} }}'}}}}}`;
    const OPT_IN_HEADER = `, artillery: {env: ['${SECRET_NAME}'], config: {http: {defaults: {headers: {'x-secret': '{{ $env.${SECRET_NAME} }}'}}}}}`;
    const SCENARIO = `load.it('browse items', [load.get('/items')]);`;

    before(() => {
      process.env[SECRET_NAME] = SECRET_VALUE;
    });
    after(() => {
      delete process.env[SECRET_NAME];
    });

    it('does not show a variable of the CLI to {{ $env.NAME }} in a script', async () => {
      const pkg = packageWith(SCENARIO, SECRET_HEADER);

      const {code} = await runMain(['run', pkg], env);

      const items = seen.filter(call => call.url === '/items');
      expect(code).to.equal(0);
      expect(items.length).to.be.greaterThan(0);
      expect(items.map(call => call.secret)).to.not.containEql(SECRET_VALUE);
    }).timeout(60_000);

    it('shows it when artillery.env names it', async () => {
      const pkg = packageWith(SCENARIO, OPT_IN_HEADER);

      const {code} = await runMain(['run', pkg], env);

      const items = seen.filter(call => call.url === '/items');
      expect(code).to.equal(0);
      expect(items.length).to.be.greaterThan(0);
      expect(items.every(call => call.secret === SECRET_VALUE)).to.be.true();
    }).timeout(60_000);
  });
});

describe('main and a dead output', () => {
  it('installs the listener that ignores EIO, so the process lives', () => {
    const cli = path.join(__dirname, '..', '..', 'cli.js');
    const script = `
const {main} = require(${JSON.stringify(cli)});
main(['--help']).then(() => {
  process.stdout.emit('error', Object.assign(new Error('gone'), {code: 'EIO'}));
  process.exit(0);
});`;

    const child = spawnSync(process.execPath, ['-e', script], {
      stdio: 'ignore',
      timeout: 30_000,
    });

    expect(child.status).to.equal(0);
  });
});
