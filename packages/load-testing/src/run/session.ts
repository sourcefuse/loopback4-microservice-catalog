// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {LoadedScenario} from '../project/types';
import type {Session, Target} from './types';

/**
 * Wraps `runOne` so that it gets a fresh access token. A run can take longer
 * than an access token lives, so `refreshSession` is called before each
 * scenario. It decides by itself if the token is old enough.
 * When there is no session (no login), `runOne` gets no token. `signal`
 * stops a refresh that is in progress.
 */
export function withFreshToken<T>(
  target: Target,
  initial: Session | undefined,
  refreshSession: (
    target: Target,
    session: Session,
    signal?: AbortSignal,
  ) => Promise<Session>,
  runOne: (loaded: LoadedScenario, token?: string) => Promise<T>,
  signal?: AbortSignal,
): (loaded: LoadedScenario) => Promise<T> {
  let session = initial;
  return async loaded => {
    if (session) session = await refreshSession(target, session, signal);
    return runOne(loaded, session?.accessToken);
  };
}
