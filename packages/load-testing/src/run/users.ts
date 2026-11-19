// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {readFileSync} from 'node:fs';
import {ConfigError} from '../errors';
import {isPlainObject} from '../scenario/guards';
import type {PoolUser} from './types';

export const USERS_FILE_ENV = 'LOAD_TESTS_USERS_FILE';

/**
 * Reads the test users from the JSON file that `LOAD_TESTS_USERS_FILE` names.
 * The file is a list of `{username, password}`. A problem is a `ConfigError`.
 * No message shows a password.
 */
export function readUsers(path: string): PoolUser[] {
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch (cause) {
    const code = (cause as NodeJS.ErrnoException).code ?? 'unknown error';
    throw new ConfigError(
      `${USERS_FILE_ENV} cannot be read: ${path} (${code})`,
    );
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    // The parse error is not kept: on some Node versions it quotes the file.
    throw new ConfigError(`${USERS_FILE_ENV} is not JSON`);
  }
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new ConfigError(
      `${USERS_FILE_ENV} must hold a list of {username, password} with at least one user`,
    );
  }
  const seen = new Set<string>();
  return parsed.map((entry: unknown, index) => {
    if (!isPlainObject(entry)) {
      throw new ConfigError(
        `${USERS_FILE_ENV}: entry ${index} must be an object with username and password`,
      );
    }
    const {username, password} = entry;
    if (typeof username !== 'string' || username === '') {
      throw new ConfigError(
        `${USERS_FILE_ENV}: entry ${index} has no username`,
      );
    }
    if (typeof password !== 'string' || password === '') {
      throw new ConfigError(
        `${USERS_FILE_ENV}: the user ${username} has no password`,
      );
    }
    if (seen.has(username)) {
      throw new ConfigError(
        `${USERS_FILE_ENV}: the user ${username} is in the list twice`,
      );
    }
    seen.add(username);
    return {username, password};
  });
}
