// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {createRequire} from 'node:module';
import path from 'node:path';
import {ConfigError} from '../errors';

/**
 * Loads the package `name` from `projectDir`, and never from the folder of
 * this library: the project installs its drivers. Only a package that cannot
 * be found gives a `ConfigError`. Any other error, for example a package that
 * throws when it loads, goes up unchanged.
 */
export function loadDriver<T>(name: string, projectDir: string): T {
  const projectRequire = createRequire(path.join(projectDir, 'package.json'));
  try {
    projectRequire.resolve(name);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'MODULE_NOT_FOUND') {
      throw new ConfigError(
        `The "${name}" package is not installed in ${projectDir}. Install it in the project: npm install --save-dev ${name}`,
      );
    }
    throw err;
  }
  return projectRequire(name) as T;
}
