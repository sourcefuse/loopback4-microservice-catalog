// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
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
    );

    await expect(run(loaded('one'))).to.be.rejectedWith(
      /user a failed: gave 500; refresh of user b failed: gave 500/,
    );
  });
});
