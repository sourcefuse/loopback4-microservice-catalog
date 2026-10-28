// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {ConfigError} from '../errors';
import type {Api, ApiClientOptions} from './types';
import {ApiClient} from './api';

/**
 * The clients of `ctx.apis`, one for each URL. A name that `apis` in
 * `config.ts` does not have throws a `ConfigError` when the hook reads it,
 * because TypeScript cannot know the names.
 */
export function namedApis(
  urls: Record<string, string>,
  options: ApiClientOptions,
): Readonly<Record<string, Api>> {
  const clients = Object.fromEntries(
    Object.entries(urls).map(([name, url]) => [
      name,
      new ApiClient(url, options),
    ]),
  );
  return new Proxy(clients, {
    get(target, name) {
      // `await` and `JSON.stringify` read these two names.
      if (
        typeof name === 'symbol' ||
        name === 'then' ||
        name === 'toJSON' ||
        Object.hasOwn(target, name)
      ) {
        return Reflect.get(target, name);
      }
      throw new ConfigError(
        `No API '${name}' in config.ts apis. Known: ${Object.keys(target).join(', ') || 'none'}`,
      );
    },
  });
}
