// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import http from 'node:http';
import type {AddressInfo} from 'node:net';
import {loginAll, readTarget} from '../../../run/target';
import type {Login, Target} from '../../../run/types';
import {usersFileOf} from '../../helpers';

type Reply = {status: number; retryAfter?: string};

describe('loginAll', () => {
  let server: http.Server;
  let target: Target & {login: Login};
  /** The replies for a path and a user, used in order. Else the reply is 200. */
  let queue: Record<string, Reply[]>;
  let calls: string[];
  let waits: number[];
  const wait = async (ms: number) => {
    waits.push(ms / 1000);
  };

  before(async () => {
    server = http.createServer((req, res) => {
      let body = '';
      req.on('data', chunk => (body += chunk));
      req.on('end', () => {
        const sent = JSON.parse(body) as {username?: string; code?: string};
        // The login names the user, and the code of the token call does too.
        const user = sent.username ?? sent.code?.replace('k-', '') ?? '';
        calls.push(`${req.url} ${user}`);
        const next = queue[`${req.url} ${user}`]?.shift();
        if (next && next.status === 429) {
          res
            .writeHead(
              429,
              next.retryAfter ? {'retry-after': next.retryAfter} : {},
            )
            .end('slow down');
        } else if (req.url === '/auth/login') {
          res.writeHead(200).end(JSON.stringify({code: `k-${user}`}));
        } else {
          res
            .writeHead(200)
            .end(JSON.stringify({accessToken: `a-${user}`, refreshToken: 'r'}));
        }
      });
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    target = readTarget(
      {
        LOAD_TESTS_BASE_URL: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
        LOAD_TESTS_USERS_FILE: usersFileOf([
          {username: 'ann', password: 'p'},
          {username: 'bob', password: 'p'},
        ]),
        LOAD_TESTS_CLIENT_ID: 'c',
        LOAD_TESTS_CLIENT_SECRET: 's',
      },
      {api: true, ui: false},
    ) as Target & {login: Login};
  });

  after(() => new Promise<void>(resolve => server.close(() => resolve())));

  beforeEach(() => {
    queue = {};
    calls = [];
    waits = [];
  });

  it('retries only the call that got the 429', async () => {
    queue['/auth/token ann'] = [{status: 429, retryAfter: '2'}];

    const sessions = await loginAll(target, 300, undefined, wait);

    expect(sessions.map(s => s.accessToken)).to.deepEqual(['a-ann', 'a-bob']);
    expect(calls).to.deepEqual([
      '/auth/login ann',
      '/auth/token ann',
      '/auth/token ann',
      '/auth/login bob',
      '/auth/token bob',
    ]);
    expect(waits).to.deepEqual([2]);
  });

  it('waits 60 s when a 429 has no usable Retry-After', async () => {
    queue['/auth/login ann'] = [
      {status: 429},
      {status: 429, retryAfter: 'Wed, 21 Oct 2026 07:28:00 GMT'},
    ];

    await loginAll(target, 300, undefined, wait);

    expect(waits).to.deepEqual([60, 60]);
  });

  it('waits 60 s for a Retry-After that is blank or negative, and rounds a fraction up', async () => {
    queue['/auth/login ann'] = [
      {status: 429, retryAfter: ' '},
      {status: 429, retryAfter: '-5'},
      {status: 429, retryAfter: '1.5'},
    ];

    await loginAll(target, 300, undefined, wait);

    expect(waits).to.deepEqual([60, 60, 2]);
  });

  it('waits at least 1 s for a Retry-After of 0', async () => {
    queue['/auth/login ann'] = [{status: 429, retryAfter: '0'}];

    await loginAll(target, 300, undefined, wait);

    expect(waits).to.deepEqual([1]);
  });

  it('adds up the waits of all users, and stops when they pass the limit', async () => {
    queue['/auth/login ann'] = [{status: 429, retryAfter: '200'}];
    queue['/auth/login bob'] = [{status: 429, retryAfter: '200'}];

    await expect(loginAll(target, 300, undefined, wait)).to.be.rejectedWith(
      'login of user bob failed: the server asks to wait 200 s, which passes loginWaitSeconds (300 s)',
    );
    expect(waits).to.deepEqual([200]);
  });

  it('accepts a wait that is equal to what is left', async () => {
    queue['/auth/login ann'] = [{status: 429, retryAfter: '300'}];

    await loginAll(target, 300, undefined, wait);

    expect(waits).to.deepEqual([300]);
  });

  it('retries a user more than once', async () => {
    queue['/auth/login ann'] = [
      {status: 429, retryAfter: '5'},
      {status: 429, retryAfter: '5'},
      {status: 429, retryAfter: '5'},
    ];

    await loginAll(target, 300, undefined, wait);

    expect(waits).to.deepEqual([5, 5, 5]);
  });

  it('stops with the reason when the wait is cut short', async () => {
    queue['/auth/login ann'] = [{status: 429, retryAfter: '5'}];
    const controller = new AbortController();
    const cutShort = async () => {
      throw new Error('aborted');
    };

    await expect(
      loginAll(target, 300, controller.signal, cutShort),
    ).to.be.rejectedWith('login of user ann failed: the wait was cut short');
  });
});
