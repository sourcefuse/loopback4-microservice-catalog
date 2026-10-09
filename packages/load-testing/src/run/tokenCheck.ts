// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {RunError} from '../errors';
import {phaseSeconds} from '../scenario/workload';
import type {TokenCheck} from '../types';
import {secondsLeft} from './target';

/**
 * Seconds that the token must outlive the load. The last requests of
 * Artillery, `after` and the cleanups use the same token, and they run after
 * the phases end.
 */
const TOKEN_MARGIN_SECONDS = 120;

/**
 * The check that runs when no `tokenCheck` is set. It stops a scenario whose
 * load takes longer than the access token lives. The engine sends one token
 * for the whole load, so every request after the token expires would fail
 * with 401.
 */
export const defaultTokenCheck: TokenCheck = ({token, phases}) => {
  const left = secondsLeft(token);
  // A token with no expiry claim cannot expire, as far as we can tell.
  if (left === undefined) return;
  const seconds = phaseSeconds(phases);
  if (seconds === undefined) {
    throw new RunError(
      'The time of a phase cannot be read, so the load cannot be compared with the life of the access token. Write a time as a number of seconds, or as a text such as 20m.',
    );
  }
  if (seconds + TOKEN_MARGIN_SECONDS >= left) {
    throw new RunError(
      `The load takes ${seconds} s, and the end of the run needs ${TOKEN_MARGIN_SECONDS} s more, but the access token expires in ${Math.floor(left)} s. Make the load shorter, or give the login client a longer token life.`,
    );
  }
};
