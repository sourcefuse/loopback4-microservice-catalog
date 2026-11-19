// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect, sinon} from '@loopback/testlab';
import {resolveThresholds} from '../../../project/config';
import type {LoadedScenario} from '../../../project/types';
import {withFreshPool} from '../../../run/session';
import type {Session, Target} from '../../../run/types';
import {scenarioOf} from '../../helpers';

const target: Target = {
  baseUrl: 'http://app',
  authUrl: 'http://app',
  apiUrls: {},
};
const loaded = (name: string): LoadedScenario => ({
  scenario: scenarioOf(name, []),
  source: 's.load.ts',
  endpoints: new Map([['GET /a', resolveThresholds({})]]),
});
const sessionOf = (username: string, accessToken: string): Session => ({
  username,
  accessToken,
  refreshToken: 'r',
});

/** The seconds that a JWT has left, from its exp claim. */
const secondsOf = (token: string) =>
  JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()).exp -
  Date.now() / 1000;

describe('withFreshPool', () => {
  it('refreshes every user once before each scenario, and gives the new tokens', async () => {
    const refreshed: string[] = [];
    const refreshSession = async (_target: Target, session: Session) => {
      refreshed.push(session.accessToken);
      return {...session, accessToken: `${session.accessToken}+`};
    };
    const tokens: string[][] = [];
    const run = withFreshPool(
      target,
      [sessionOf('a', 't1'), sessionOf('b', 't2')],
      refreshSession,
      async (_loaded, pool) => {
        tokens.push(pool.sessions.map(session => session.accessToken));
      },
      () => undefined,
    );

    await run(loaded('one'));
    await run(loaded('two'));

    expect(refreshed).to.deepEqual(['t1', 't2', 't1+', 't2+']);
    expect(tokens).to.deepEqual([
      ['t1+', 't2+'],
      ['t1++', 't2++'],
    ]);
  });

  it('does not refresh, and gives an empty pool, when there is no login', async () => {
    let calls = 0;
    const sizes: number[] = [];
    const run = withFreshPool(
      target,
      [],
      async (_target, session) => {
        calls++;
        return session;
      },
      async (_loaded, pool) => {
        sizes.push(pool.sessions.length);
        expect(pool.next()).to.be.undefined();
      },
      () => undefined,
    );

    await run(loaded('one'));

    expect(calls).to.equal(0);
    expect(sizes).to.deepEqual([0]);
  });

  it('hands out the users in turn over all scenarios', async () => {
    const seen: Array<string | undefined> = [];
    const run = withFreshPool(
      target,
      [sessionOf('a', 't1'), sessionOf('b', 't2')],
      async (_target, session) => session,
      async (_loaded, pool) => {
        seen.push(pool.next()?.username, pool.next()?.username);
        seen.push(pool.next()?.username);
      },
      () => undefined,
    );

    await run(loaded('one'));
    await run(loaded('two'));

    expect(seen).to.deepEqual(['a', 'b', 'a', 'b', 'a', 'b']);
  });

  it('fails the scenario with the name of the user whose refresh failed', async () => {
    const run = withFreshPool(
      target,
      [sessionOf('a', 't1'), sessionOf('b', 't2')],
      async (_target, session) => {
        if (session.username === 'b') throw new Error('gave 500');
        return session;
      },
      async () => 'result',
      () => undefined,
    );

    await expect(run(loaded('one'))).to.be.rejectedWith(
      'refresh of user b failed: gave 500',
    );
  });

  it('gives the target to the refresh, and the result of the scenario back', async () => {
    let seen: Target | undefined;
    const run = withFreshPool(
      target,
      [sessionOf('a', 't')],
      async (given, session) => {
        seen = given;
        return session;
      },
      async () => 'result',
      () => undefined,
    );

    expect(await run(loaded('one'))).to.equal('result');
    expect(seen).to.equal(target);
  });

  it('gives the cancel signal to the refresh, so that a refresh that hangs can stop', async () => {
    const controller = new AbortController();
    const reason = new Error('cancelled');
    const refreshSession = (
      _target: Target,
      _session: Session,
      signal?: AbortSignal,
    ) =>
      new Promise<Session>((_resolve, reject) =>
        signal?.addEventListener('abort', () => reject(signal.reason)),
      );
    const run = withFreshPool(
      target,
      [sessionOf('a', 't')],
      refreshSession,
      async () => 'result',
      () => undefined,
      controller.signal,
    );

    const outcome = run(loaded('one')).catch((err: unknown) => err);
    controller.abort(reason);

    expect(await outcome).to.equal(reason);
  });

  it('keeps the new session of a user whose refresh worked when another user fails', async () => {
    const fail = new Set(['b']);
    const given: string[] = [];
    const run = withFreshPool(
      target,
      [sessionOf('a', 't1'), sessionOf('b', 't2')],
      async (_target, session) => {
        given.push(session.accessToken);
        if (fail.has(session.username)) throw new Error('gave 500');
        return {...session, accessToken: `${session.accessToken}+`};
      },
      async () => 'result',
      () => undefined,
    );

    await expect(run(loaded('one'))).to.be.rejectedWith(/user b failed/);
    fail.clear();
    await run(loaded('two'));

    // The second scenario refreshes `a` from its new token, `b` from its old one.
    expect(given).to.deepEqual(['t1', 't2', 't1+', 't2']);
  });

  it('names every user whose refresh failed', async () => {
    const run = withFreshPool(
      target,
      [sessionOf('a', 't1'), sessionOf('b', 't2')],
      async () => {
        throw new Error('gave 500');
      },
      async () => 'result',
      () => undefined,
    );

    await expect(run(loaded('one'))).to.be.rejectedWith(
      /user a failed: gave 500; refresh of user b failed: gave 500/,
    );
  });

  describe('the refresh rule', () => {
    /** A JWT that expires `left` seconds from now. */
    const jwt = (left: number) =>
      `x.${Buffer.from(
        JSON.stringify({exp: Math.floor(Date.now() / 1000) + left}),
      ).toString('base64url')}.y`;
    const run = (
      sessions: Session[],
      loadSeconds: number | undefined,
      refreshed: string[],
    ) =>
      withFreshPool(
        target,
        sessions,
        async (_target, session) => {
          refreshed.push(session.username);
          return {...session, accessToken: jwt(900)};
        },
        async (_loaded, pool) => pool.sessions.map(s => s.accessToken),
        () => loadSeconds,
      );

    it('keeps a token that outlives the load and the margin of 300 s', async () => {
      const refreshed: string[] = [];
      await run([sessionOf('a', jwt(700))], 300, refreshed)(loaded('one'));
      expect(refreshed).to.deepEqual([]);
    });

    it('refreshes a token that expires inside the load and the margin', async () => {
      const refreshed: string[] = [];
      const tokens = await run(
        [sessionOf('a', jwt(590))],
        300,
        refreshed,
      )(loaded('one'));
      expect(refreshed).to.deepEqual(['a']);
      expect(secondsOf(tokens[0])).to.be.above(800);
    });

    it('refreshes only the users whose token is near its end', async () => {
      const refreshed: string[] = [];
      await run(
        [
          sessionOf('a', jwt(800)),
          sessionOf('b', jwt(100)),
          sessionOf('c', 't'),
        ],
        60,
        refreshed,
      )(loaded('one'));
      expect(refreshed).to.deepEqual(['b', 'c']);
    });

    it('refreshes when the time of the load is unknown', async () => {
      const refreshed: string[] = [];
      await run(
        [sessionOf('a', jwt(5000))],
        undefined,
        refreshed,
      )(loaded('one'));
      expect(refreshed).to.deepEqual(['a']);
    });

    it('skips the refresh of the first scenario and does it for the next one', async () => {
      const refreshed: string[] = [];
      const clock = sinon.useFakeTimers({now: Date.now(), toFake: ['Date']});
      try {
        const next = run([sessionOf('a', jwt(900))], 400, refreshed);
        await next(loaded('one'));
        clock.tick(450_000);
        await next(loaded('two'));
      } finally {
        clock.restore();
      }
      expect(refreshed).to.deepEqual(['a']);
    });
  });
});
