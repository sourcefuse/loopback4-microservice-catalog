// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import fs from 'node:fs';
import http from 'node:http';
import type {AddressInfo} from 'node:net';
import os from 'node:os';
import path from 'node:path';
import {usersFileOf, runMain} from '../helpers';

type Env = Record<string, string | undefined>;

/** Runs `main`, and returns its exit code and what it printed. */
const PASSWORD = 'secret-password-1';
const REFRESH_TOKEN = 'rt-SECRET-refresh';
const usersOf = (...names: string[]) =>
  names.map(username => ({username, password: PASSWORD}));

/**
 * The pool of users against a stub server: the users file, the login, the
 * wait on 429, the refresh, the check of each token, and the spread of the
 * tokens over the virtual users and the hooks.
 */
describe('main with a pool of users', () => {
  const builder = JSON.stringify(require.resolve('../../scenario/builder'));
  const values = JSON.stringify(require.resolve('../../scenario/values'));
  const dirs: string[] = [];
  let server: http.Server;
  let env: Env;
  /** What the stub server got, in order. */
  let seen: {
    url?: string;
    authorization?: string;
    user?: string;
    sub?: string;
  }[] = [];
  /** How the stub behaves. `beforeEach` resets it. */
  let stub: {
    /** Seconds ago that a token was issued. */
    issuedAgo: number;
    /** Seconds that a token lives. By user, else 900. */
    life: Record<string, number>;
    /** The next answers of `/auth/login`, by user: a status, and a `Retry-After`. */
    loginAnswers: Record<string, Array<{status: number; retryAfter?: string}>>;
    /** The next answers of `/auth/token-refresh`, by user. */
    refreshStatus: Record<string, number[]>;
  };

  /** A token that holds the user in `sub`. */
  const tokenOf = (user: string, version: number) => {
    const issued = Math.floor(Date.now() / 1000) - stub.issuedAgo;
    const claims = Buffer.from(
      JSON.stringify({
        sub: user,
        v: version,
        iat: issued,
        exp: issued + (stub.life[user] ?? 900),
      }),
    ).toString('base64url');
    return `x.${claims}.y`;
  };
  const userOfToken = (header?: string) =>
    JSON.parse(
      Buffer.from(
        (header ?? '').replace('Bearer ', '').split('.')[1] ?? '',
        'base64url',
      ).toString() || '{}',
    ).sub as string | undefined;

  before(async () => {
    server = http.createServer((req, res) => {
      let body = '';
      req.on('data', chunk => (body += chunk));
      req.on('end', () => {
        const json = body ? JSON.parse(body) : {};
        seen.push({
          url: req.url,
          authorization: req.headers.authorization,
          sub: req.headers['x-sub'] as string | undefined,
          user:
            json.username ??
            json.code ??
            userOfToken(req.headers.authorization),
        });
        const reply = (status: number, content: unknown, headers = {}) => {
          res.writeHead(status, {
            'content-type': 'application/json',
            ...headers,
          });
          res.end(JSON.stringify(content));
        };
        if (req.url === '/auth/login') {
          const answer = stub.loginAnswers[json.username]?.shift();
          if (answer && answer.status !== 200) {
            const headers = answer.retryAfter
              ? {'retry-after': answer.retryAfter}
              : {};
            return reply(answer.status, 'no', headers);
          }
          return reply(200, {code: json.username});
        }
        if (req.url === '/auth/token') {
          return reply(200, {
            accessToken: tokenOf(json.code, 1),
            refreshToken: REFRESH_TOKEN,
          });
        }
        if (req.url === '/auth/token-refresh') {
          const user = userOfToken(req.headers.authorization) as string;
          const status = stub.refreshStatus[user]?.shift() ?? 200;
          if (status !== 200) return reply(status, 'refresh broke');
          return reply(200, {
            accessToken: tokenOf(user, 2),
            refreshToken: REFRESH_TOKEN,
          });
        }
        reply(200, []);
      });
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    env = {
      LOAD_TESTS_BASE_URL: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
      LOAD_TESTS_AUTH_SERVICE_URL: undefined,
      LOAD_TESTS_USERS_FILE: undefined,
      LOAD_TESTS_CLIENT_ID: 'c',
      LOAD_TESTS_CLIENT_SECRET: 's',
      CI: undefined,
    };
  });
  after(() => {
    server.close();
    dirs.forEach(dir => fs.rmSync(dir, {recursive: true}));
  });

  beforeEach(() => {
    seen = [];
    stub = {issuedAgo: 0, life: {}, loginAnswers: {}, refreshStatus: {}};
  });

  /** A package with one built load file that has `scenarios` as its source. */
  function packageWith(scenarios: string, configExtra = ''): string {
    const pkg = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-pool-'));
    dirs.push(pkg);
    const write = (file: string, content: string) => {
      fs.mkdirSync(path.dirname(path.join(pkg, file)), {recursive: true});
      fs.writeFileSync(path.join(pkg, file), content);
    };
    write('src/__tests__/load/config.ts', '');
    write(
      'dist/__tests__/load/config.js',
      `exports.default = {phases: [{arrivalRate: 10, duration: 1}], thresholds: {default: {}}${configExtra}};`,
    );
    write('src/__tests__/load/s.load.ts', '');
    write(
      'dist/__tests__/load/s.load.js',
      `const {load} = require(${builder});\nconst {template, token} = require(${values});\n${scenarios}`,
    );
    write(
      'src/openapi.json',
      JSON.stringify({paths: {'/items': {get: {}}, '/other': {get: {}}}}),
    );
    return pkg;
  }

  /** A scenario that sends the token of the virtual user to `/items`. */
  const WITH_TOKEN = `
load.it('secured', [load.get('/items')], {
  headers: {authorization: template\`Bearer \${token()}\`},
});`;

  const loginsOf = () =>
    seen.filter(call => call.url === '/auth/login').map(call => call.user);
  const refreshesOf = () =>
    seen.filter(call => call.url === '/auth/token-refresh');
  const itemsOf = () => seen.filter(call => call.url === '/items');

  describe('the users file', () => {
    const problems: Array<[string, string, RegExp]> = [
      [
        'is missing',
        '/no/such/users.json',
        /LOAD_TESTS_USERS_FILE cannot be read/,
      ],
      [
        'is not JSON',
        usersFileOf(`[{"username":"ann","password":"${PASSWORD}"`),
        /is not JSON/,
      ],
      ['is an empty list', usersFileOf([]), /at least one user/],
      [
        'has a user with no password',
        usersFileOf([{username: 'ann'}, ...usersOf('bob')]),
        /the user ann has no password/,
      ],
      [
        'has an entry with no username',
        usersFileOf([...usersOf('bob'), {password: PASSWORD}]),
        /entry 1 has no username/,
      ],
      [
        'has a user twice',
        usersFileOf(usersOf('ann', 'ann')),
        /the user ann is in the list twice/,
      ],
    ];

    for (const [name, file, message] of problems) {
      it(`stops before any login when the file ${name}, and shows no password`, async () => {
        const pkg = packageWith(WITH_TOKEN);

        const {code, out} = await runMain(['run', pkg], {
          ...env,
          LOAD_TESTS_USERS_FILE: file,
        });

        expect(code).to.equal(1);
        expect(out).to.match(message);
        expect(out).to.not.containEql(PASSWORD);
        expect(seen).to.deepEqual([]);
      });
    }
  });

  describe('the login', () => {
    it('logs in every user of the file once, before the scenario', async () => {
      const pkg = packageWith(WITH_TOKEN);

      const {code} = await runMain(['run', pkg], {
        ...env,
        LOAD_TESTS_USERS_FILE: usersFileOf(usersOf('ann', 'bob', 'cy')),
      });

      expect(code).to.equal(0);
      expect(loginsOf()).to.deepEqual(['ann', 'bob', 'cy']);
      expect(seen.findIndex(call => call.url === '/items')).to.be.greaterThan(
        seen.map(call => call.url).lastIndexOf('/auth/token'),
      );
    }).timeout(60_000);

    it('stops before any scenario when a login fails, and names the user', async () => {
      stub.loginAnswers.bob = [{status: 401}];
      const pkg = packageWith(WITH_TOKEN);

      const {code, out} = await runMain(['run', pkg], {
        ...env,
        LOAD_TESTS_USERS_FILE: usersFileOf(usersOf('ann', 'bob', 'cy')),
      });

      expect(code).to.equal(1);
      expect(out).to.match(/login of user bob failed: .*gave 401/);
      expect(out).to.not.containEql(PASSWORD);
      expect(itemsOf()).to.deepEqual([]);
      expect(loginsOf()).to.deepEqual(['ann', 'bob']);
    });

    it('waits for Retry-After on a 429 and sends the same login again', async () => {
      stub.loginAnswers.ann = [{status: 429, retryAfter: '1'}];
      const pkg = packageWith(WITH_TOKEN);

      const {code, out} = await runMain(['run', pkg], {
        ...env,
        LOAD_TESTS_USERS_FILE: usersFileOf(usersOf('ann', 'bob')),
      });

      expect(code).to.equal(0);
      expect(out).to.match(/Login of ann gave 429, waiting 1 s/);
      expect(loginsOf()).to.deepEqual(['ann', 'ann', 'bob']);
    }).timeout(60_000);

    it('stops when the wait that the server asks for passes loginWaitSeconds', async () => {
      stub.loginAnswers.ann = [{status: 429, retryAfter: '400'}];
      const pkg = packageWith(WITH_TOKEN);

      const {code, out} = await runMain(['run', pkg], {
        ...env,
        LOAD_TESTS_USERS_FILE: usersFileOf(usersOf('ann')),
      });

      expect(code).to.equal(1);
      expect(out).to.match(
        /login of user ann failed: the server asks to wait 400 s, which passes loginWaitSeconds \(300 s\)/,
      );
    });

    it('waits 60 s when a 429 has no Retry-After, so a limit of 10 s stops the run', async () => {
      stub.loginAnswers.ann = [{status: 429}];
      const pkg = packageWith(WITH_TOKEN, ', loginWaitSeconds: 10');

      const {code, out} = await runMain(['run', pkg], {
        ...env,
        LOAD_TESTS_USERS_FILE: usersFileOf(usersOf('ann')),
      });

      expect(code).to.equal(1);
      expect(out).to.match(
        /asks to wait 60 s, which passes loginWaitSeconds \(10 s\)/,
      );
    });

    it('refuses a loginWaitSeconds that is not a number of seconds', async () => {
      const pkg = packageWith(WITH_TOKEN, ', loginWaitSeconds: -1');

      const {code, out} = await runMain(['run', pkg], {
        ...env,
        LOAD_TESTS_USERS_FILE: usersFileOf(usersOf('ann')),
      });

      expect(code).to.equal(1);
      expect(out).to.match(
        /loginWaitSeconds must be a number of seconds, 0 or more/,
      );
      expect(seen).to.deepEqual([]);
    });
  });

  describe('the refresh and the token check', () => {
    it('refreshes the token of every user before the scenario, each with its own token', async () => {
      stub.issuedAgo = 120;
      const pkg = packageWith(WITH_TOKEN);

      const {code} = await runMain(['run', pkg], {
        ...env,
        LOAD_TESTS_USERS_FILE: usersFileOf(usersOf('ann', 'bob')),
      });

      expect(code).to.equal(0);
      expect(
        refreshesOf()
          .map(call => call.user)
          .sort(),
      ).to.deepEqual(['ann', 'bob']);
    }).timeout(60_000);

    it('fails only the scenario whose refresh failed, names the user, and runs the next scenario', async () => {
      stub.issuedAgo = 120;
      stub.refreshStatus.bob = [500];
      const pkg = packageWith(`
load.it('first', [load.get('/items')], {
  headers: {authorization: template\`Bearer \${token()}\`},
});
load.it('second', [load.get('/other')], {
  headers: {authorization: template\`Bearer \${token()}\`},
});`);

      const {code, out} = await runMain(['run', pkg], {
        ...env,
        LOAD_TESTS_USERS_FILE: usersFileOf(usersOf('ann', 'bob')),
      });

      expect(code).to.equal(1);
      expect(out).to.match(/refresh of user bob failed: .*gave 500/);
      expect(itemsOf()).to.deepEqual([]);
      expect(seen.some(call => call.url === '/other')).to.be.true();
    }).timeout(60_000);

    it('checks the token of every user and names the user whose token is too short', async () => {
      stub.life.bob = 30;
      const pkg = packageWith(WITH_TOKEN);

      const {code, out} = await runMain(['run', pkg], {
        ...env,
        LOAD_TESTS_USERS_FILE: usersFileOf(usersOf('ann', 'bob')),
      });

      expect(code).to.equal(1);
      expect(out).to.match(/token check for user bob: .*access token expires/);
      expect(itemsOf()).to.deepEqual([]);
    });
  });

  describe('the load', () => {
    it('sends one token for all the requests of a virtual user', async () => {
      const authorized = `{headers: {authorization: template\`Bearer \${token()}\`}}`;
      const pkg = packageWith(
        `load.it('two', [load.get('/items', ${authorized}), load.get('/other', ${authorized})]);`,
      );

      const {code} = await runMain(['run', pkg], {
        ...env,
        LOAD_TESTS_USERS_FILE: usersFileOf(usersOf('ann', 'bob')),
      });

      const of = (url: string) =>
        seen.filter(call => call.url === url).map(call => call.authorization);
      expect(code).to.equal(0);
      expect(of('/items').length).to.be.greaterThan(0);
      expect(of('/other').sort()).to.deepEqual(of('/items').sort());
    }).timeout(60_000);

    it('sends the tokens of several users, and nothing of the password or the refresh token reaches the files', async () => {
      const pkg = packageWith(WITH_TOKEN);

      const {code, out} = await runMain(['run', pkg], {
        ...env,
        LOAD_TESTS_USERS_FILE: usersFileOf(usersOf('ann', 'bob')),
      });

      const senders = new Set(itemsOf().map(call => call.user));
      expect(code).to.equal(0);
      expect(itemsOf().length).to.be.greaterThan(0);
      expect(senders).to.deepEqual(new Set(['ann', 'bob']));
      expect(out).to.not.containEql(PASSWORD);
      expect(out).to.not.match(/x\.ey/);
      expect(out).to.not.containEql(REFRESH_TOKEN);
      const outDir = path.join(pkg, 'src/__tests__/load/.out');
      const files = fs
        .readdirSync(outDir, {recursive: true, withFileTypes: true})
        .filter(entry => entry.isFile())
        .map(entry =>
          fs.readFileSync(path.join(entry.parentPath, entry.name), 'utf8'),
        );
      expect(files.length).to.be.greaterThan(0);
      expect(
        files.filter(text => /x\.ey|secret-password|rt-SECRET/.test(text)),
      ).to.deepEqual([]);
    }).timeout(60_000);
  });

  it('keeps the path of the base URL in the requests of a scenario', async () => {
    const pkg = packageWith(`load.it('items', [load.get('/items')]);`);

    const {code} = await runMain(['run', pkg], {
      ...env,
      LOAD_TESTS_BASE_URL: `${env.LOAD_TESTS_BASE_URL}/allocation`,
    });

    expect(code).to.equal(0);
    expect(seen.map(call => call.url)).to.containEql('/allocation/items');
  }).timeout(60_000);

  describe('ctx.auth in a hook', () => {
    it('gives the users in turn, with a token and claims of the same user', async () => {
      const pkg = packageWith(`
load.it('hooked', [load.get('/items')], {
  before: async ctx => {
    for (let i = 0; i < 3; i++) {
      const {token, claims} = ctx.auth();
      await ctx.api.with({headers: {authorization: \`Bearer \${token}\`, 'x-sub': claims.sub}}).get('/hook');
    }
  },
});`);

      const {code} = await runMain(['run', pkg], {
        ...env,
        LOAD_TESTS_USERS_FILE: usersFileOf(usersOf('ann', 'bob')),
      });

      expect(code).to.equal(0);
      expect(
        seen.filter(call => call.url === '/hook').map(call => call.user),
      ).to.deepEqual(['ann', 'bob', 'ann']);
      // The claims belong to the user of the token.
      for (const call of seen.filter(c => c.url === '/hook')) {
        expect(call.sub).to.equal(call.user);
      }
    }).timeout(60_000);

    it('fails the scenario with a ConfigError when there is no users file', async () => {
      const pkg = packageWith(`
load.it('hooked', [load.get('/items')], {
  before: async ctx => {
    ctx.auth();
  },
});`);

      const {code, out} = await runMain(['run', pkg], env);

      expect(code).to.equal(1);
      expect(out).to.match(
        /ctx.auth\(\) needs a login: set LOAD_TESTS_USERS_FILE/,
      );
    }).timeout(60_000);
  });
});
