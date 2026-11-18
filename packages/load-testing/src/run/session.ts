// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {errorMessage, LoginError} from '../errors';
import type {LoadedScenario} from '../project/types';
import type {Session, Target} from './types';

/**
 * The sessions of the pool. `next` hands them out in turn, over the whole
 * run, so that `ctx.auth()` spreads the calls of the hooks of all scenarios.
 */
export class Pool {
  private turn = 0;

  constructor(private list: Session[]) {}

  get sessions(): readonly Session[] {
    return this.list;
  }

  replace(sessions: Session[]): void {
    this.list = sessions;
  }

  /** The next session in turn. Undefined when the pool is empty. */
  next(): Session | undefined {
    if (this.sessions.length === 0) return undefined;
    return this.sessions[this.turn++ % this.sessions.length];
  }
}

/**
 * Wraps `runOne` so that its pool has fresh access tokens. A run can take
 * longer than an access token lives, so `refreshSession` is called for each
 * user before each scenario. It decides by itself if the token is old enough.
 * When there is no session (no login), the pool is empty. A refresh that
 * fails fails the scenario, and the message names the user. `signal` stops a
 * refresh that is in progress.
 */
export function withFreshPool<T>(
  target: Target,
  initial: Session[],
  refreshSession: (
    target: Target,
    session: Session,
    signal?: AbortSignal,
  ) => Promise<Session>,
  runOne: (loaded: LoadedScenario, pool: Pool) => Promise<T>,
  signal?: AbortSignal,
): (loaded: LoadedScenario) => Promise<T> {
  const pool = new Pool(initial);
  return async loaded => {
    // allSettled, not all: a refresh that succeeded has spent the old refresh
    // token, so its new session must be kept even when another user fails.
    const results = await Promise.allSettled(
      pool.sessions.map(session => refreshSession(target, session, signal)),
    );
    const failed: string[] = [];
    let first: unknown;
    pool.replace(
      results.map((result, i) => {
        const old = pool.sessions[i];
        if (result.status === 'fulfilled') return result.value;
        first ??= result.reason;
        failed.push(
          `refresh of user ${old.username} failed: ${errorMessage(result.reason)}`,
        );
        return old;
      }),
    );
    if (failed.length > 0) {
      if (signal?.aborted) throw first;
      throw new LoginError(failed.join('; '), {cause: first});
    }
    return runOne(loaded, pool);
  };
}
