// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import fs from 'node:fs';
import path from 'node:path';
import {ConfigError} from '../errors';
import type {Coverage} from './types';

/**
 * The OpenAPI spec, relative to the package. The package commits it here.
 * `node ./dist/openapi-spec src/openapi.json` regenerates it.
 */
export const SPEC_FILE = path.join('src', 'openapi.json');

const METHODS = new Set(['get', 'post', 'put', 'patch', 'delete']);
/** LoopBack serves these in every app. They are not application endpoints. */
const NOT_COUNTED = new Set(['/ping', '/openapi.json']);

/** Reads the spec that the package commits. The apps serve it only behind Basic auth. */
export function readSpec(pkgDir: string): unknown {
  const file = path.join(pkgDir, SPEC_FILE);
  if (!fs.existsSync(file)) {
    throw new ConfigError(
      `No ${SPEC_FILE} in ${pkgDir}. Build the app, run \`node ./dist/openapi-spec ${SPEC_FILE}\`, and commit the file.`,
    );
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/** Endpoint ids in the spec, as `METHOD /path/{param}`. */
export function specEndpoints(spec: unknown): string[] {
  const paths = (spec as {paths?: Record<string, object>}).paths ?? {};
  return Object.entries(paths)
    .filter(([p]) => !NOT_COUNTED.has(p) && !p.startsWith('/explorer'))
    .flatMap(([p, operations]) =>
      Object.keys(operations)
        .filter(method => METHODS.has(method))
        .map(method => `${method.toUpperCase()} ${p}`),
    );
}

export function coverage(declared: string[], spec: string[]): Coverage {
  const known = new Set(spec);
  const ids = [...new Set(declared)];
  return {
    unknown: ids.filter(id => !known.has(id)),
    covered: ids.filter(id => known.has(id)).length,
    total: known.size,
  };
}
