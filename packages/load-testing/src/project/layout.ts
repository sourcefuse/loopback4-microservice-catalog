// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import fs from 'node:fs';
import path from 'node:path';
import {ConfigError} from '../errors';

/** Every package of the monorepo builds `src` into `dist` with tsc. */
const SOURCE_DIR = 'src';
const BUILD_DIR = 'dist';

/** Scenario files, config.ts and generated output all live here. */
export const SCENARIOS_DIR = path.join(SOURCE_DIR, '__tests__', 'load');
export const CONFIG_FILE = path.join(SCENARIOS_DIR, 'config.ts');
export const OUT_DIR = path.join(SCENARIOS_DIR, '.out');

/** The compiled file of a source file of the package. */
export function builtFile(pkgDir: string, source: string): string {
  const built = path
    .join(
      pkgDir,
      BUILD_DIR,
      path.relative(path.join(pkgDir, SOURCE_DIR), source),
    )
    .replace(/\.ts$/, '.js');
  if (!fs.existsSync(built)) {
    throw new ConfigError(
      `No ${path.relative(pkgDir, built)}. Run npm run build.`,
    );
  }
  return built;
}
