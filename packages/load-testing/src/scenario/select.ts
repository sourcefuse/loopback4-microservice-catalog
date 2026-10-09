// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {Scenario} from '../types';
import {labelOf} from './label';
import {ConfigError, ScenarioError} from '../errors';

function isCi(env: NodeJS.ProcessEnv): boolean {
  return (
    env.CI !== undefined && !['', '0', 'false'].includes(env.CI.toLowerCase())
  );
}

/**
 * Picks the scenarios to run. A scenario with `skip` never runs. When a
 * scenario has `only`, just the scenarios with `only` and no `skip` run. When
 * there are none, nothing runs and all scenarios are skipped. A `.only` that
 * stays in a file would hide the other scenarios of the package, so it stops
 * the run when `CI` is set. So does a run where every scenario is skipped:
 * a green gate must not hide that nothing ran.
 */
export function selectScenarios<T extends {scenario: Scenario}>(
  all: T[],
  env: NodeJS.ProcessEnv,
): {run: T[]; skipped: T[]} {
  const only = all.filter(item => item.scenario.only);
  if (only.length > 0 && isCi(env)) {
    throw new ScenarioError(
      `.only is not allowed when CI is set: ${only.map(item => labelOf(item.scenario)).join(', ')}`,
    );
  }
  const live = all.filter(item => !item.scenario.skip);
  if (live.length === 0 && isCi(env)) {
    throw new ConfigError('No scenario runs: every scenario has .skip');
  }
  const picked =
    only.length > 0 ? only.filter(item => !item.scenario.skip) : live;
  return {
    run: picked,
    skipped: picked.length > 0 ? all.filter(item => item.scenario.skip) : all,
  };
}
