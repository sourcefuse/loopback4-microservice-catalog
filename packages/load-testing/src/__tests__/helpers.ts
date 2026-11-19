// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {main} from '../cli';
import {output} from '../output';
import type {HeavyApis} from '../report/types';
import type {FlowItem, HttpScenario, ScenarioOptions} from '../types';

/**
 * A scenario that no `load.it` registered. The tests that transpile or run
 * one scenario need only the object.
 */
export function scenarioOf(
  name: string,
  requests: FlowItem[],
  options: ScenarioOptions = {},
): HttpScenario {
  return {name, requests, ...options};
}

/**
 * Puts a fake package `name` in `<dir>/node_modules`, with `source` as its
 * `index.js`.
 */
export function writeFakePackage(
  dir: string,
  name: string,
  source: string,
): void {
  const root = path.join(dir, 'node_modules', name);
  fs.mkdirSync(root, {recursive: true});
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({name}));
  fs.writeFileSync(path.join(root, 'index.js'), source);
}

/** A `HeavyApis` with `count` endpoints and the given `max`. */
export function heavy(count: number, max: number): HeavyApis {
  return {
    max,
    endpoints: Array.from({length: count}, (_, i) => ({
      id: `GET /h${i}`,
      p95: 2000,
    })),
  };
}

/** A test user for the pool. */
export const USER = {username: 'u', password: 'p'};

let usersDir: string | undefined;
let usersCount = 0;

/**
 * Writes a users file for `LOAD_TESTS_USERS_FILE` and gives its path. `content`
 * is the text of the file; a list is written as JSON. The files go away when
 * the process ends.
 */
export function usersFileOf(content: unknown): string {
  if (usersDir === undefined) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-users-'));
    usersDir = dir;
    process.on('exit', () => fs.rmSync(dir, {recursive: true, force: true}));
  }
  const file = path.join(usersDir, `users-${usersCount++}.json`);
  fs.writeFileSync(
    file,
    typeof content === 'string' ? content : JSON.stringify(content),
  );
  return file;
}

/**
 * Runs `main` with this environment, and returns its exit code and what it
 * printed. The output comes back after. `main` reads `env` and not
 * `process.env`. Artillery writes to the real output, which this does not
 * capture.
 */
export async function runMain(
  args: string[],
  env: Record<string, string | undefined>,
): Promise<{code: number; out: string}> {
  const text: string[] = [];
  const {out, err} = output;
  output.out = output.err = (chunk: string) => {
    text.push(chunk);
  };
  try {
    return {code: await main(args, env), out: text.join('')};
  } finally {
    output.out = out;
    output.err = err;
  }
}
