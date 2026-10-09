// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {Scenario} from '../types';
import {ScenarioError} from '../errors';

/** Goes between the `load.describe` names and the name of a scenario. */
const SEPARATOR = ' › ';

/**
 * `group › name`, or `name` for a scenario that no `load.describe` holds.
 * Tables, baselines and messages use it.
 */
export function labelOf({group = [], name}: Scenario): string {
  return [...group, name].join(SEPARATOR);
}

/** The label as a file name: lower-case words, joined with `-`. */
export function slugOf(scenario: Scenario): string {
  const slug = labelOf(scenario)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  if (slug === '') {
    throw new ScenarioError(
      `The scenario name "${labelOf(scenario)}" has no letter or digit`,
    );
  }
  return slug;
}
