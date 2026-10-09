// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import fs from 'node:fs';
import path from 'node:path';
import type {HeavyApis} from '../report/types';
import type {FlowItem, Scenario, ScenarioOptions} from '../types';

/**
 * A scenario that no `load.it` registered. The tests that transpile or run
 * one scenario need only the object.
 */
export function scenarioOf(
  name: string,
  requests: FlowItem[],
  options: ScenarioOptions = {},
): Scenario {
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
