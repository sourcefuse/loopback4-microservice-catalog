// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {resolveThresholds} from '../../../project/config';
import type {LoadedScenario} from '../../../project/types';
import {withFreshToken} from '../../../run/session';
import type {Session, Target} from '../../../run/types';
import {scenarioOf} from '../../helpers';

const target: Target = {baseUrl: 'http://app', authUrl: 'http://app'};
const loaded = (name: string): LoadedScenario => ({
  scenario: scenarioOf(name, []),
  endpoints: new Map([['GET /a', resolveThresholds({})]]),
});

describe('withFreshToken', () => {
  it('refreshes once before each scenario, and gives the new token', async () => {
    const refreshed: string[] = [];
    const refreshSession = async (_target: Target, session: Session) => {
      refreshed.push(session.accessToken);
      return {...session, accessToken: `${session.accessToken}+`};
    };
    const tokens: Array<string | undefined> = [];
    const run = withFreshToken(
      target,
      {accessToken: 't', refreshToken: 'r'},
      refreshSession,
      async (_loaded, token) => {
        tokens.push(token);
      },
    );

    await run(loaded('one'));
    await run(loaded('two'));

    expect(refreshed).to.deepEqual(['t', 't+']);
    expect(tokens).to.deepEqual(['t+', 't++']);
  });

  it('does not refresh, and gives no token, when there is no login', async () => {
    let calls = 0;
    const tokens: Array<string | undefined> = [];
    const run = withFreshToken(
      target,
      undefined,
      async (_target, session) => {
        calls++;
        return session;
      },
      async (_loaded, token) => {
        tokens.push(token);
      },
    );

    await run(loaded('one'));

    expect(calls).to.equal(0);
    expect(tokens).to.deepEqual([undefined]);
  });

  it('gives the target to the refresh, and the result of the scenario back', async () => {
    let seen: Target | undefined;
    const run = withFreshToken(
      target,
      {accessToken: 't', refreshToken: 'r'},
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
    const run = withFreshToken(
      target,
      {accessToken: 't', refreshToken: 'r'},
      refreshSession,
      async () => 'result',
      controller.signal,
    );

    const outcome = run(loaded('one')).catch((err: unknown) => err);
    controller.abort(reason);

    expect(await outcome).to.equal(reason);
  });
});
