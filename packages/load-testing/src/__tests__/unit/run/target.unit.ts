// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import http from 'node:http';
import type {AddressInfo, Socket} from 'node:net';
import {expect} from '@loopback/testlab';
import {login, readTarget, refresh, secondsLeft} from '../../../run/target';
import {LoginError} from '../../../errors';
import type {Login, Target} from '../../../run/types';

describe('readTarget', () => {
  const env = {
    LOAD_TESTS_BASE_URL: 'http://localhost:4014/',
    LOAD_TESTS_USERNAME: 'u',
    LOAD_TESTS_PASSWORD: 'p',
    LOAD_TESTS_CLIENT_ID: 'c',
    LOAD_TESTS_CLIENT_SECRET: 's',
  };

  it('uses the base URL for login when LOAD_TESTS_AUTH_URL is not set', () => {
    expect(readTarget(env)).to.containDeep({
      baseUrl: 'http://localhost:4014',
      authUrl: 'http://localhost:4014',
    });
  });

  it('uses the base URL for login when LOAD_TESTS_AUTH_URL is empty', () => {
    expect(readTarget({...env, LOAD_TESTS_AUTH_URL: ''}).authUrl).to.equal(
      'http://localhost:4014',
    );
  });

  it('removes the trailing slash of LOAD_TESTS_AUTH_URL, and keeps it apart from the base URL', () => {
    expect(
      readTarget({...env, LOAD_TESTS_AUTH_URL: 'http://localhost:4015/'}),
    ).to.containDeep({
      baseUrl: 'http://localhost:4014',
      authUrl: 'http://localhost:4015',
    });
  });

  it('names LOAD_TESTS_BASE_URL when it is not a URL', () => {
    expect(() =>
      readTarget({...env, LOAD_TESTS_BASE_URL: 'not a url'}),
    ).to.throw({
      name: 'ConfigError',
      message: /LOAD_TESTS_BASE_URL is not an http or https URL/,
    });
  });

  it('names LOAD_TESTS_BASE_URL when it has no http or https scheme', () => {
    expect(() =>
      readTarget({...env, LOAD_TESTS_BASE_URL: 'localhost:3000'}),
    ).to.throw({
      name: 'ConfigError',
      message: /LOAD_TESTS_BASE_URL is not an http or https URL/,
    });
  });

  it('names LOAD_TESTS_AUTH_URL when it is not a URL', () => {
    expect(() =>
      readTarget({...env, LOAD_TESTS_AUTH_URL: 'not a url'}),
    ).to.throw({
      name: 'ConfigError',
      message: /LOAD_TESTS_AUTH_URL is not an http or https URL/,
    });
  });

  it('refuses a URL with a user or a password, and does not show it', () => {
    for (const name of ['LOAD_TESTS_BASE_URL', 'LOAD_TESTS_AUTH_URL']) {
      for (const url of ['http://me:secret@host', 'http://me@host']) {
        expect(() => readTarget({...env, [name]: url})).to.throw({
          name: 'ConfigError',
          message: `${name} must not hold a user or a password`,
        });
      }
    }
  });

  it('reads the login when the username is set', () => {
    expect(readTarget(env).login).to.deepEqual({
      username: 'u',
      password: 'p',
      clientId: 'c',
      clientSecret: 's',
    });
  });

  it('has no login when the username is not set, or is empty', () => {
    const noLogin = {LOAD_TESTS_BASE_URL: 'http://localhost:4014'};

    expect(readTarget(noLogin).login).to.be.undefined();
    expect(
      readTarget({...noLogin, LOAD_TESTS_USERNAME: ''}).login,
    ).to.be.undefined();
  });

  it('always requires the base URL', () => {
    expect(() => readTarget({})).to.throw('Set LOAD_TESTS_BASE_URL');
  });

  it('names every missing variable when the username is set', () => {
    expect(() => readTarget({LOAD_TESTS_USERNAME: 'u'})).to.throw(
      'Set LOAD_TESTS_BASE_URL, LOAD_TESTS_PASSWORD, LOAD_TESTS_CLIENT_ID, LOAD_TESTS_CLIENT_SECRET',
    );
  });

  it('does not ask for the login variables when the username is not set', () => {
    expect(() =>
      readTarget({
        LOAD_TESTS_BASE_URL: 'http://localhost:4014',
        LOAD_TESTS_PASSWORD: 'p',
      }),
    ).to.not.throw();
  });
});

describe('login and refresh', () => {
  let server: http.Server;
  let target: Target & {login: Login};
  /** The JSON that the server gives for each path. Other paths get 401. */
  let replies: Record<string, object>;
  /** The body of the 401 for a path that has no reply. */
  let refusal = 'no';
  /** When set, the server answers 200 with this text for every path. */
  let rawReply: string | undefined;
  const seen: Record<string, {body: unknown; authorization?: string}> = {};
  const session = {accessToken: 'a', refreshToken: 'r'};

  before(async () => {
    server = http.createServer((req, res) => {
      let body = '';
      req.on('data', chunk => (body += chunk));
      req.on('end', () => {
        const url = req.url ?? '';
        seen[url] = {
          body: JSON.parse(body),
          authorization: req.headers.authorization,
        };
        if (rawReply !== undefined) res.writeHead(200).end(rawReply);
        else if (replies[url])
          res.writeHead(200).end(JSON.stringify(replies[url]));
        else res.writeHead(401).end(refusal);
      });
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    target = readTarget({
      LOAD_TESTS_BASE_URL: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
      LOAD_TESTS_USERNAME: 'u',
      LOAD_TESTS_PASSWORD: 'p',
      LOAD_TESTS_CLIENT_ID: 'c',
      LOAD_TESTS_CLIENT_SECRET: 's',
    }) as Target & {login: Login};
  });

  after(() => new Promise<void>(resolve => server.close(() => resolve())));

  beforeEach(() => {
    refusal = 'no';
    rawReply = undefined;
  });

  it('logs in with the code that /auth/login gives', async () => {
    replies = {'/auth/login': {code: 'k'}, '/auth/token': session};

    expect(await login(target)).to.deepEqual(session);
    expect(seen['/auth/token'].body).to.deepEqual({code: 'k', clientId: 'c'});
  });

  it('stops when /auth/login gives no code', async () => {
    replies = {'/auth/login': {}};

    await expect(login(target)).to.be.rejectedWith(
      'POST /auth/login gave no code',
    );
  });

  it('stops when a token field is not a text', async () => {
    for (const bad of [42, {a: 1}, true, '']) {
      replies = {
        '/auth/login': {code: 'k'},
        '/auth/token': {...session, accessToken: bad},
      };
      await expect(login(target)).to.be.rejectedWith(
        'POST /auth/token gave no accessToken',
      );

      replies = {
        '/auth/login': {code: 'k'},
        '/auth/token': {...session, refreshToken: bad},
      };
      await expect(login(target)).to.be.rejectedWith(
        'POST /auth/token gave no refreshToken',
      );
    }
  });

  it('names the URL and the status of a refused login', async () => {
    replies = {};

    await expect(login(target)).to.be.rejectedWith(
      /^POST http:\/\/127\.0\.0\.1:\d+\/auth\/login gave 401: no$/,
    );
  });

  it('cuts a long body of a refused login in the message', async () => {
    replies = {};
    refusal = 'y'.repeat(500);

    await expect(login(target)).to.be.rejectedWith(
      new RegExp(`gave 401: ${'y'.repeat(200)}$`),
    );
  });

  it('names the URL and the reason when the connection is refused', async () => {
    const closed = http.createServer();
    await new Promise<void>(resolve => closed.listen(0, '127.0.0.1', resolve));
    const authUrl = `http://127.0.0.1:${(closed.address() as AddressInfo).port}`;
    await new Promise<void>(resolve => closed.close(() => resolve()));

    const error = await login({...target, authUrl}).catch(
      (err: unknown) => err,
    );

    expect(error).to.be.instanceOf(LoginError);
    expect((error as LoginError).message).to.match(
      /^POST http:\/\/127\.0\.0\.1:\d+\/auth\/login failed: .*ECONNREFUSED/,
    );
  });

  it('names the URL and the status when a login answers 200 with a body that is not JSON', async () => {
    rawReply = '<html>';

    await expect(login(target)).to.be.rejectedWith(
      /^POST http:\/\/127\.0\.0\.1:\d+\/auth\/login gave 200 with a body that is not JSON$/,
    );
  });

  for (const body of ['null', '[]', '7', '"text"']) {
    it(`names the URL and the status when a login answers 200 with ${body}`, async () => {
      rawReply = body;

      await expect(login(target)).to.be.rejectedWith(
        /^POST http:\/\/127\.0\.0\.1:\d+\/auth\/login gave 200 with a body that is not a JSON object$/,
      );
    });
  }

  it('names the URL and the status when a refresh answers 200 with a body that is not JSON', async () => {
    rawReply = '<html>';

    await expect(refresh(target, session)).to.be.rejectedWith(
      /^POST http:\/\/127\.0\.0\.1:\d+\/auth\/token-refresh gave 200 with a body that is not JSON$/,
    );
  });

  it('throws the reason of the cancel signal as it is, when it aborts a login', async () => {
    replies = {};
    const reason = new Error('cancelled');

    await expect(login(target, AbortSignal.abort(reason))).to.be.rejectedWith(
      'cancelled',
    );
  });

  it('refreshes with the refresh token, and sends the access token', async () => {
    replies = {'/auth/token-refresh': {accessToken: 'a2', refreshToken: 'r2'}};

    expect(await refresh(target, session)).to.deepEqual({
      accessToken: 'a2',
      refreshToken: 'r2',
    });
    expect(seen['/auth/token-refresh']).to.deepEqual({
      body: {refreshToken: 'r'},
      authorization: 'Bearer a',
    });
  });

  /** A token with these claims. Only the claims part is real. */
  const jwt = (claims: object) =>
    `h.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.s`;
  const now = () => Math.floor(Date.now() / 1000);

  it('keeps a token that is less than a minute old', async () => {
    const young = {accessToken: jwt({iat: now() - 5}), refreshToken: 'r'};
    delete seen['/auth/token-refresh'];

    expect(await refresh(target, young)).to.equal(young);
    expect(seen).to.not.have.property('/auth/token-refresh');
  });

  it('refreshes a token that is a minute old', async () => {
    replies = {'/auth/token-refresh': {accessToken: 'a2', refreshToken: 'r2'}};
    const old = {accessToken: jwt({iat: now() - 60}), refreshToken: 'r'};

    expect(await refresh(target, old)).to.deepEqual({
      accessToken: 'a2',
      refreshToken: 'r2',
    });
  });

  it('stops when a refresh gives no refresh token', async () => {
    replies = {'/auth/token-refresh': {accessToken: 'a2'}};

    await expect(refresh(target, session)).to.be.rejectedWith(
      'POST /auth/token-refresh gave no refreshToken',
    );
  });
});

describe('login and refresh stopped by a signal', () => {
  /** What the stub does with a path: give a code, never answer, or send half a body. */
  type Hang = 'code' | 'before-headers' | 'in-body';
  let server: http.Server;
  let target: Target & {login: Login};
  let hangs: Record<string, Hang>;
  let arrived: () => void;
  const sockets = new Set<Socket>();
  const reason = new Error('cancelled by the test');
  const session = {accessToken: 'a', refreshToken: 'r'};

  before(async () => {
    server = http.createServer((req, res) => {
      req.resume();
      req.on('end', () => {
        const hang = hangs[req.url ?? ''];
        if (hang === 'code') {
          res.writeHead(200).end('{"code":"k"}');
          return;
        }
        if (hang === 'in-body') {
          res.writeHead(200, {'content-type': 'application/json'});
          res.write('{"code":');
        }
        arrived();
      });
    });
    server.on('connection', socket => {
      sockets.add(socket);
      socket.on('close', () => sockets.delete(socket));
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    target = readTarget({
      LOAD_TESTS_BASE_URL: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
      LOAD_TESTS_USERNAME: 'u',
      LOAD_TESTS_PASSWORD: 'p',
      LOAD_TESTS_CLIENT_ID: 'c',
      LOAD_TESTS_CLIENT_SECRET: 's',
    }) as Target & {login: Login};
  });

  after(() => {
    sockets.forEach(socket => socket.destroy());
    return new Promise<void>(resolve => server.close(() => resolve()));
  });

  /** Starts a call, waits until the stub has the request, then aborts. */
  async function abortedCall(
    hang: Hang,
    path: string,
    call: (signal: AbortSignal) => Promise<unknown>,
  ): Promise<unknown> {
    hangs = {'/auth/login': 'code', [path]: hang};
    const controller = new AbortController();
    const reached = new Promise<void>(resolve => (arrived = resolve));
    const result = call(controller.signal).then(
      value => value,
      (err: unknown) => err,
    );
    await reached;
    controller.abort(reason);
    return result;
  }

  it('gives the reason of the signal when it aborts a refresh that waits for an answer', async () => {
    expect(
      await abortedCall('before-headers', '/auth/token-refresh', signal =>
        refresh(target, session, signal),
      ),
    ).to.equal(reason);
  });

  it('gives the reason of the signal when it aborts a refresh that reads a body', async () => {
    expect(
      await abortedCall('in-body', '/auth/token-refresh', signal =>
        refresh(target, session, signal),
      ),
    ).to.equal(reason);
  });

  it('gives the reason of the signal when it aborts a login that waits for /auth/login', async () => {
    expect(
      await abortedCall('before-headers', '/auth/login', signal =>
        login(target, signal),
      ),
    ).to.equal(reason);
  });

  it('gives the reason of the signal when it aborts a login that waits for /auth/token', async () => {
    expect(
      await abortedCall('before-headers', '/auth/token', signal =>
        login(target, signal),
      ),
    ).to.equal(reason);
  });

  it('gives the reason of the signal when it aborts a login that reads the body of /auth/token', async () => {
    expect(
      await abortedCall('in-body', '/auth/token', signal =>
        login(target, signal),
      ),
    ).to.equal(reason);
  });

  it('gives the reason of the signal when it aborts a login that reads the body of /auth/login', async () => {
    expect(
      await abortedCall('in-body', '/auth/login', signal =>
        login(target, signal),
      ),
    ).to.equal(reason);
  });
});

describe('login and refresh with a redirect', () => {
  let auth: http.Server;
  let other: http.Server;
  let target: Target & {login: Login};
  /** The status and the location header that the auth stub gives. */
  let status = 307;
  let location: string | undefined;
  let otherRequests = 0;
  const OLD_TOKEN = {accessToken: 'a', refreshToken: 'r'};
  const LISTEN_HOST = '127.0.0.1';
  const portOf = (server: http.Server) =>
    (server.address() as AddressInfo).port;
  const listen = (server: http.Server) =>
    new Promise<void>(resolve => server.listen(0, LISTEN_HOST, resolve));
  const close = (server: http.Server) =>
    new Promise<void>(resolve => server.close(() => resolve()));

  before(async () => {
    other = http.createServer((req, res) => {
      otherRequests += 1;
      req.resume();
      res.writeHead(200).end('{}');
    });
    await listen(other);
    auth = http.createServer((req, res) => {
      req.resume();
      req.on('end', () => {
        res.writeHead(status, location ? {location} : {}).end();
      });
    });
    await listen(auth);
    target = readTarget({
      LOAD_TESTS_BASE_URL: `http://${LISTEN_HOST}:${portOf(auth)}`,
      LOAD_TESTS_USERNAME: 'u',
      LOAD_TESTS_PASSWORD: 'p',
      LOAD_TESTS_CLIENT_ID: 'c',
      LOAD_TESTS_CLIENT_SECRET: 's',
    }) as Target & {login: Login};
  });

  after(async () => {
    await close(auth);
    await close(other);
  });

  beforeEach(() => {
    otherRequests = 0;
    status = 307;
    location = `http://${LISTEN_HOST}:${portOf(other)}/steal?secret=1`;
  });

  const message = (call: string, code: number, to = '') =>
    `POST http://${LISTEN_HOST}:${portOf(auth)}/auth/${call} gave ${code}, a redirect${to}. ` +
    'The login does not follow redirects, so the password goes only to the URL that we set. ' +
    'Set LOAD_TESTS_AUTH_URL to the final URL.';

  it('does not follow a 307 of the login, and says where it points', async () => {
    const error = await login(target).catch((err: unknown) => err);

    expect(error).to.be.instanceOf(LoginError);
    expect((error as LoginError).message).to.equal(
      message('login', 307, ` to http://${LISTEN_HOST}:${portOf(other)}`),
    );
    expect(otherRequests).to.equal(0);
  });

  it('does not follow a 308 of the refresh', async () => {
    status = 308;

    await expect(refresh(target, OLD_TOKEN)).to.be.rejectedWith(
      message(
        'token-refresh',
        308,
        ` to http://${LISTEN_HOST}:${portOf(other)}`,
      ),
    );
    expect(otherRequests).to.equal(0);
  });

  it('does not follow a 302', async () => {
    status = 302;

    await expect(login(target)).to.be.rejectedWith(
      message('login', 302, ` to http://${LISTEN_HOST}:${portOf(other)}`),
    );
    expect(otherRequests).to.equal(0);
  });

  it('leaves out the target when the location header is missing or is not a URL', async () => {
    location = undefined;
    await expect(login(target)).to.be.rejectedWith(message('login', 307));

    location = 'http://';
    await expect(login(target)).to.be.rejectedWith(message('login', 307));
  });
});

describe('secondsLeft', () => {
  const jwt = (claims: object) =>
    `x.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.y`;

  it('reads the exp claim of a JWT', () => {
    const left = secondsLeft(jwt({exp: Date.now() / 1000 + 100}));

    expect(left).to.be.within(99, 100);
  });

  it('is undefined for a token that is not a JWT, or has no exp', () => {
    expect(secondsLeft('opaque')).to.be.undefined();
    expect(secondsLeft(jwt({iat: 1}))).to.be.undefined();
  });
});
