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

/** The script of the stub web app. A page shows `.done` when its data comes. */
const WEB_APP_JS = `const show = () => fetch('/web/data').then(() => {
  const done = document.createElement('p');
  done.className = 'done';
  done.textContent = 'Saved';
  document.body.append(done);
});
document.querySelector('#go')?.addEventListener('click', show);
if (document.body.dataset.load === 'show') show();`;

/** A page of the stub web app with `body` in its body, after a heading. */
const webPage = (body: string, bodyAttributes = '') =>
  `<!doctype html><html><head><title>Orders</title></head><body ${bodyAttributes}><h1>Orders</h1><p>The orders of this week.</p>${body}<script src="/web/app.js"></script></body></html>`;

/**
 * The stub web app. Its data API answers after 300 ms, so a page shows
 * `.done` about 300 ms after a click on `#go`.
 */
function serveWebApp(url: string, res: http.ServerResponse): void {
  const send = (type: string, body: string, headers = {}) => {
    res.writeHead(200, {'content-type': type, ...headers});
    res.end(body);
  };
  const html = (body: string, headers = {}) => send('text/html', body, headers);
  if (url === '/web/app.js') return send('text/javascript', WEB_APP_JS);
  if (url === '/web/data') {
    setTimeout(() => send('application/json', '[]'), 300);
    return;
  }
  if (url === '/web/visible') {
    return html(
      webPage('<button id="go">Save</button><p class="done">Saved</p>'),
    );
  }
  if (url === '/web/csp') {
    return html(webPage('<button id="go">Save</button>'), {
      'content-security-policy': "script-src 'self'",
    });
  }
  if (url === '/web/nav')
    return html(webPage('<a id="next" href="/web/next">Next</a>'));
  if (url === '/web/next') return html(webPage('', 'data-load="show"'));
  html(webPage('<button id="go">Save</button>'));
}

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

  it('prints the message and the usage when run or report gets more arguments than it takes', async () => {
    for (const command of ['run', 'report']) {
      const {code, out} = await runMain(
        [command, os.tmpdir(), 'extra'],
        NO_TARGET,
      );

      expect(code).to.equal(1);
      expect(out).to.match(/Unexpected argument 'extra'/);
      expect(out).to.match(/Usage:/);
    }
  });

  it('prints the usage and gives 0 for --help', async () => {
    const {code, out} = await runMain(['--help'], {});

    expect(code).to.equal(0);
    expect(out).to.match(/Usage:/);
  });

  it('prints the message of an error and gives 1', async () => {
    const {code, out} = await runMain(['run', os.tmpdir()], NO_TARGET);

    expect(code).to.equal(1);
    expect(out).to.match(/No src\/__tests__\/load\/config.ts/);
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
  /** No URL and no login: `report` needs neither. */
  const NO_TARGET_ENV: Env = {
    LOAD_TESTS_BASE_URL: undefined,
    LOAD_TESTS_UI_URL: undefined,
    LOAD_TESTS_USERNAME: undefined,
  };
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
      if (req.url?.startsWith('/web/')) return serveWebApp(req.url, res);
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
      LOAD_TESTS_AUTH_SERVICE_URL: undefined,
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

  /** A p95 over the default limit of 500 ms, so the run fails. */
  const OVER_CAP_P95_MS = 2000;

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

    it('does not say that the API baseline is from another URL when only browser scenarios run', async () => {
      const pkg = packageWith(
        `load.browser('open', {before: async () => {}}, async () => {});`,
        fakeEngine(FAST_P95_MS),
      );
      recordBaseline(pkg, [100, 200], {baseUrl: 'http://other.example'});

      const {out} = await runMain(['run', pkg], {
        ...env,
        LOAD_TESTS_UI_URL: env.LOAD_TESTS_BASE_URL,
        LOAD_TESTS_UPDATE_BASELINE: undefined,
      });

      expect(out).to.not.match(/The baseline is from/);
    });

    it('starts a new history when it saves a run against another host', async () => {
      const pkg = packageWith(SCENARIO, fakeEngine(FAST_P95_MS));
      recordBaseline(pkg, [100, 200], {baseUrl: 'http://other.example'});

      const {code, out} = await runMain(['run', pkg], env);

      const saved = JSON.parse(
        fs.readFileSync(path.join(pkg, BASELINE), 'utf8'),
      );
      expect(code).to.equal(0);
      expect(out.match(ROW)?.[1]).to.equal('150');
      expect(historyOf(pkg)).to.deepEqual([FAST_P95_MS]);
      expect(saved.baseUrl).to.equal(env.LOAD_TESTS_BASE_URL);
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

  it('sends login and refresh to LOAD_TESTS_AUTH_SERVICE_URL, and the scenario requests with the new token to the base URL', async () => {
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
        LOAD_TESTS_AUTH_SERVICE_URL: authUrl,
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
        LOAD_TESTS_AUTH_SERVICE_URL: authUrl,
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

  describe('a browser scenario', () => {
    /** The run of a browser scenario needs only the URL of the web app. */
    const uiEnv = (): Env => ({
      ...NO_TARGET_ENV,
      ...NO_LOGIN,
      LOAD_TESTS_UI_URL: env.LOAD_TESTS_BASE_URL,
    });
    /** The aggregate of the report file that the run of `slug` wrote. */
    const reportOf = (pkg: string, slug: string) =>
      (
        JSON.parse(
          fs.readFileSync(
            path.join(
              pkg,
              'src/__tests__/load/.out',
              `${slug}-chromium.report.json`,
            ),
            'utf8',
          ),
        ) as {
          aggregate: {
            counters: Record<string, number>;
            summaries: Record<string, {count: number; p95: number}>;
          };
        }
      ).aggregate;

    // `npm test` skips a title with `browser:`, and `npm run test:browser` runs it.
    describe('browser: a run of steps', () => {
      /** How long one run of the package may take: Artillery starts Chromium for each scenario. */
      const RUN_MS = 180_000;
      let ran:
        | Promise<{pkg: string; code: number; out: string; calls: typeof seen}>
        | undefined;
      /** Runs the package of these tests once. The tests share the run, because each run is slow. */
      const runOnce = () =>
        (ran ??= (async () => {
          const pkg =
            packageWith(`load.browser('element', {vitals: {INP: {p95: 1000}}}, async ({page, step}) => {
  await page.goto('/web/');
  await step('save', async () => {
    await page.click('#go');
    await page.waitForTimeout(1000);
  }, {endWhenVisible: '.done'});
});
load.browser('wall clock', async ({page, step}) => {
  await page.goto('/web/');
  await step('save', async () => {
    await page.click('#go');
    await page.waitForTimeout(500);
  });
});
load.browser('csp', async ({page, step}) => {
  await page.goto('/web/csp');
  await step('save', async () => {
    await page.click('#go');
    await page.waitForTimeout(1000);
  }, {endWhenVisible: '.done'});
});
load.browser('new page', async ({page, step}) => {
  await page.goto('/web/nav');
  await step('next', async () => {
    await page.click('#next');
    await page.waitForTimeout(1000);
  }, {endWhenVisible: '.done'});
});
load.browser('goto', async ({page, step}) => {
  await step('open', async () => {
    await page.goto('/web/next');
  }, {endWhenVisible: '.done'});
});
load.browser('hooks', {
  before: async (_ctx, vars) => {
    vars.label = 'from before';
  },
  after: async ctx => {
    await ctx.api.delete('/after-hook');
  },
}, async ({page, step, vars}) => {
  await page.goto('/web/');
  await step('show', () => page.evaluate(text => {
    const element = document.createElement('p');
    element.dataset.label = text;
    element.textContent = text;
    setTimeout(() => document.body.append(element), 100);
  }, vars.label), {endWhenVisible: '[data-label="from before"]'});
});`);
          // The scenario with hooks needs the base URL of the API.
          const result = await runMain(['run', pkg], {
            ...uiEnv(),
            LOAD_TESTS_BASE_URL: env.LOAD_TESTS_BASE_URL,
          });
          // `seen` restarts before each test, and the tests share this run.
          return {pkg, ...result, calls: [...seen]};
        })());

      it('ends a step at the first frame where its end element is visible, and not at the end of its action', async () => {
        const {pkg} = await runOnce();

        const {p95} = reportOf(pkg, 'element').summaries['browser.step.save'];

        // The data comes after 300 ms, and the action ends 1 s after the click.
        expect(p95).to.be.within(300, 1000);
      }).timeout(RUN_MS);

      it('times a step without an end element by its whole action, and marks it', async () => {
        const {pkg} = await runOnce();

        const {summaries, counters} = reportOf(pkg, 'wall-clock');

        expect(summaries['browser.step.save'].p95).to.be.aboveOrEqual(500);
        expect(counters['browser.step_wall_clock.save']).to.equal(
          counters['vusers.completed'],
        );
      }).timeout(RUN_MS);

      it('ends a step at its element on a page with a strict CSP', async () => {
        const {pkg} = await runOnce();

        const {p95} = reportOf(pkg, 'csp').summaries['browser.step.save'];

        expect(p95).to.be.within(300, 1000);
      }).timeout(RUN_MS);

      it('ends a step at its element on the new page that the action loads', async () => {
        const {pkg} = await runOnce();

        const {p95} = reportOf(pkg, 'new-page').summaries['browser.step.next'];

        // The new page shows the element 300 ms after it loads.
        expect(p95).to.be.within(300, 1000);
      }).timeout(RUN_MS);

      it('ends a step at its element when the step is the first navigation, from about:blank', async () => {
        const {pkg} = await runOnce();

        const {p95} = reportOf(pkg, 'goto').summaries['browser.step.open'];

        // The new page shows the element 300 ms after it loads.
        expect(p95).to.be.within(300, 3000);
      }).timeout(RUN_MS);

      it('gives the flow the vars of before, and runs after once', async () => {
        const {pkg, calls} = await runOnce();

        const {summaries, counters} = reportOf(pkg, 'hooks');

        // The step ends only when the page shows the value that before set.
        expect(summaries['browser.step.show'].count).to.equal(
          counters['vusers.completed'],
        );
        expect(calls.filter(call => call.url === '/after-hook')).to.have.length(
          1,
        );
      }).timeout(RUN_MS);

      it('passes a run where each step and Web Vital is within its limit, with one sample of each for each user', async () => {
        const {pkg, code} = await runOnce();

        const {summaries, counters} = reportOf(pkg, 'element');

        expect(code).to.equal(0);
        const names = ['step.save', 'flow.element › chromium'].concat(
          ['FCP', 'LCP', 'CLS', 'TTFB'].map(
            vital => `page.${vital}.element › chromium`,
          ),
        );
        expect(
          names.map(name => [name, summaries[`browser.${name}`]?.count]),
        ).to.deepEqual(names.map(name => [name, counters['vusers.completed']]));
      }).timeout(RUN_MS);

      it('reports INP for the click on the last page, when a limit names INP, and passes it', async () => {
        const {pkg, code, out} = await runOnce();

        const {summaries, counters} = reportOf(pkg, 'element');

        expect(code).to.equal(0);
        // Step, FCP, LCP, CLS, TTFB and INP: the other scenarios have 5.
        expect(out).to.match(/Metrics: +6 of 6 pass/);
        expect(
          summaries['browser.page.INP.element › chromium']?.count,
        ).to.equal(counters['vusers.completed']);
      }).timeout(RUN_MS);

      it('runs a browser scenario of a package with "type": "module"', async () => {
        const pkg = packageWith('');
        const write = (file: string, content: string) =>
          fs.writeFileSync(path.join(pkg, file), content);
        write('package.json', JSON.stringify({type: 'module'}));
        write(
          'dist/__tests__/load/config.js',
          `export default {phases: [{arrivalRate: 2, duration: 1}], thresholds: {default: {}}};`,
        );
        write(
          'dist/__tests__/load/s.load.js',
          `import {load} from ${builder};
load.browser('esm', async ({page, step}) => {
  await page.goto('/web/');
  await step('save', () => page.click('#go'), {endWhenVisible: '.done'});
});`,
        );

        const {code} = await runMain(['run', pkg], uiEnv());

        expect(code).to.equal(0);
        expect(reportOf(pkg, 'esm').summaries).to.have.property(
          'browser.step.save',
        );
      }).timeout(RUN_MS);

      it('fails a run whose step is slower than its limit, and the report command gives the same verdict with no new load', async () => {
        const pkg = packageWith(
          `load.browser('slow', {steps: {save: {p95: 200}}}, async ({page, step}) => {
  await page.goto('/web/');
  await step('save', () => page.click('#go'), {endWhenVisible: '.done'});
});`,
        );
        const failedStep =
          /step\.save +\d+ +[\d.]+ ms \(200 ms\) .*FAIL: p95 [\d.]+ ms > limit 200 ms/;

        const run = await runMain(['run', pkg], uiEnv());
        const requests = seen.length;
        delete require.cache[path.join(pkg, 'dist/__tests__/load/s.load.js')];
        // `report` is a new process in real use, and it loads the file again.
        delete require.cache[path.join(pkg, 'dist/__tests__/load/s.load.js')];
        const report = await runMain(['report', pkg], uiEnv());

        expect(run.code).to.equal(1);
        expect(run.out).to.match(failedStep);
        expect(report.code).to.equal(1);
        expect(report.out).to.match(failedStep);
        expect(seen.length).to.equal(requests);
      }).timeout(RUN_MS);

      it('fails each user whose end element is visible before the action, and names the element', async () => {
        const pkg =
          packageWith(`load.browser('visible', async ({page, step}) => {
  await page.goto('/web/visible');
  await step('save', () => page.click('#go'), {endWhenVisible: '.done'});
});`);

        const {code} = await runMain(['run', pkg], uiEnv());

        expect(code).to.equal(1);
        const {counters} = reportOf(pkg, 'visible');
        expect(
          counters["errors.'.done' is visible before the action"],
        ).to.equal(counters['vusers.created']);
      }).timeout(RUN_MS);
    });

    it('stops with the install command when Chromium does not start', async () => {
      const pkg = packageWith(`load.browser('open', async () => {});`);
      const noBrowsers = fs.mkdtempSync(path.join(os.tmpdir(), 'no-browsers-'));
      dirs.push(noBrowsers);
      // The engine gives Artillery the PLAYWRIGHT_BROWSERS_PATH of the process.
      const saved = process.env.PLAYWRIGHT_BROWSERS_PATH;
      process.env.PLAYWRIGHT_BROWSERS_PATH = noBrowsers;

      try {
        const {code, out} = await runMain(['run', pkg], {
          ...NO_TARGET_ENV,
          LOAD_TESTS_UI_URL: 'http://127.0.0.1:9',
        });

        expect(code).to.equal(1);
        expect(out).to.match(
          /Install it with `npx playwright@1\.62\.1 install chromium`/,
        );
      } finally {
        if (saved === undefined) delete process.env.PLAYWRIGHT_BROWSERS_PATH;
        else process.env.PLAYWRIGHT_BROWSERS_PATH = saved;
      }
    }).timeout(30_000);

    it('removes the old report files, so report judges only the last run', async () => {
      const pkg = packageWith(`load.it('browse items', [load.get('/items')]);
load.browser('open', async () => {});`);
      const outDir = path.join(pkg, 'src/__tests__/load/.out');
      const old = path.join(outDir, 'open-chromium.report.json');
      fs.mkdirSync(outDir, {recursive: true});
      fs.writeFileSync(old, '{}');
      const noBrowsers = fs.mkdtempSync(path.join(os.tmpdir(), 'no-browsers-'));
      dirs.push(noBrowsers);
      const saved = process.env.PLAYWRIGHT_BROWSERS_PATH;
      process.env.PLAYWRIGHT_BROWSERS_PATH = noBrowsers;
      const target = {
        ...NO_LOGIN,
        LOAD_TESTS_UI_URL: env.LOAD_TESTS_BASE_URL,
      };

      try {
        const run = await runMain(['run', pkg], {...env, ...target});
        // `report` is a new process in real use, and it loads the file again.
        delete require.cache[path.join(pkg, 'dist/__tests__/load/s.load.js')];
        const report = await runMain(['report', pkg], NO_TARGET_ENV);

        expect(run.code).to.equal(1);
        expect(run.out).to.match(/browse items[^]*pass/);
        expect(run.out).to.match(/Install it with `npx playwright@1\.62\.1/);
        expect(fs.existsSync(old)).to.be.false();
        expect(report.code).to.equal(1);
        expect(report.out).to.match(
          /open[^]*No report file: the last run of this scenario failed or did not start\./,
        );
        expect(report.out).to.match(/browse items[^]*pass/);
      } finally {
        if (saved === undefined) delete process.env.PLAYWRIGHT_BROWSERS_PATH;
        else process.env.PLAYWRIGHT_BROWSERS_PATH = saved;
      }
    }).timeout(60_000);
  });

  describe('report', () => {
    it('shows a scenario as failed when Artillery failed it after it wrote the report', async () => {
      // The ensure plugin of Artillery sets a failing exit code at the end of the run.
      const pkg = packageWith(
        `load.it('browse items', [load.get('/items')]);`,
        ", artillery: {config: {plugins: {ensure: {thresholds: [{'http.response_time.p95': 0}]}}}}",
      );

      const run = await runMain(['run', pkg], env);
      delete require.cache[path.join(pkg, 'dist/__tests__/load/s.load.js')];
      const report = await runMain(['report', pkg], NO_TARGET_ENV);

      expect(run.code).to.equal(1);
      expect(report.code).to.equal(1);
      expect(report.out).to.match(
        /No report file in .*\.out\. Run load-testing run first\./,
      );
    }).timeout(60_000);

    const OUT = path.join('src', '__tests__', 'load', '.out');
    const browser = `load.browser('open dashboard', {steps: {save: {p95: 500}}}, async () => {});`;

    it('prints each metric of the last run from its report file, with no URL, and gives 1 when one fails', async () => {
      const pkg = packageWith(browser);
      const label = 'open dashboard › chromium';
      fs.mkdirSync(path.join(pkg, OUT), {recursive: true});
      fs.writeFileSync(
        path.join(pkg, OUT, 'open-dashboard-chromium.report.json'),
        JSON.stringify({
          aggregate: {
            counters: {
              'vusers.created': 2,
              'vusers.completed': 2,
              'vusers.failed': 0,
              'browser.step_wall_clock.save': 2,
            },
            summaries: {
              'browser.step.save': {count: 2, p95: 889},
              [`browser.page.FCP.${label}`]: {count: 2, p95: 300},
              [`browser.page.LCP.${label}`]: {count: 2, p95: 400},
              [`browser.page.CLS.${label}`]: {count: 2, p95: 0},
              [`browser.page.TTFB.${label}`]: {count: 2, p95: 20},
              [`browser.flow.${label}`]: {count: 2, p95: 1200},
            },
          },
        }),
      );

      const {code, out} = await runMain(['report', pkg], NO_TARGET_ENV);

      expect(code).to.equal(1);
      expect(out).to.match(
        /step\.save \(wall clock\) +2 +889 ms \(500 ms\) +- +FAIL: p95 889 ms > limit 500 ms\n/,
      );
      expect(out).to.match(/page\.FCP +2 +300 ms \(1800 ms\) +- +pass/);
      expect(out).to.match(/flow +2 +1200 ms +- +no limit/);
    });

    it('fails only the scenario whose report file is broken, and prints the others', async () => {
      const pkg = packageWith(
        `${browser}\nload.browser('open orders', async () => {});`,
      );
      fs.mkdirSync(path.join(pkg, OUT), {recursive: true});
      fs.writeFileSync(
        path.join(pkg, OUT, 'open-dashboard-chromium.report.json'),
        JSON.stringify({
          aggregate: {
            counters: {'vusers.created': 2, 'vusers.completed': 2},
            summaries: {
              'browser.flow.open dashboard › chromium': {count: 2, p95: 1200},
            },
          },
        }),
      );
      fs.writeFileSync(
        path.join(pkg, OUT, 'open-orders-chromium.report.json'),
        '{',
      );

      const {code, out} = await runMain(['report', pkg], NO_TARGET_ENV);

      expect(code).to.equal(1);
      expect(out).to.match(/open dashboard[^]*flow +2 +1200 ms/);
      expect(out).to.match(
        /open orders[^]*Artillery wrote no valid report: .*open-orders-chromium\.report\.json/,
      );
    });

    it('asks for a run first when no scenario has a report file', async () => {
      const pkg = packageWith(browser);

      const {code, out} = await runMain(['report', pkg], NO_TARGET_ENV);

      expect(code).to.equal(1);
      expect(out).to.match(
        /No report file in .*\.out\. Run load-testing run first\./,
      );
    });
  });

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

    it('keeps the verdict of the run when a reporter sets result.passed', async () => {
      const pkg = packageWith(
        ITEMS,
        `, reporters: [{name: 'liar', onRunEnd: result => { result.passed = true; }}]${fakeEngine(OVER_CAP_P95_MS)}`,
      );

      const {code} = await runMain(['run', pkg], env);

      expect(code).to.equal(1);
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
