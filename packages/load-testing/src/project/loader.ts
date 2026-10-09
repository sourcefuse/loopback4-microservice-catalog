// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import fs from 'node:fs';
import path from 'node:path';
import {takeRegistered} from '../scenario/builder';
import {requestsIn} from '../scenario/guards';
import {bracesProblems, headerBracesProblems} from '../scenario/braces';
import {builtFile, SCENARIOS_DIR} from './layout';
import {phaseProblems, resolveThresholds, thresholdProblems} from './config';
import {labelOf, slugOf} from '../scenario/label';
import type {LoadTestConfig, Scenario, Thresholds} from '../types';
import {ScenarioError} from '../errors';
import type {LoadedScenario} from './types';

const SCENARIO_SUFFIX = '.load.ts';

/** The file name of the baseline in `.out`, without `.json`. A script cannot use it. */
const BASELINE_SLUG = 'baseline';

/**
 * Loads every `*.load.ts` file under `src/__tests__/load`, in file-name
 * order, and takes the scenarios that its `load.it` calls register, in the
 * order of the calls. A scenario comes from the file that `tsc` made from
 * its source, so the package must be built first.
 */
export function loadScenarios(
  pkgDir: string,
  config: LoadTestConfig,
): LoadedScenario[] {
  const labels = new Map<string, string>();
  return findScenarioFiles(path.join(pkgDir, SCENARIOS_DIR))
    .flatMap(source => registeredBy(builtFile(pkgDir, source)))
    .map(scenario => {
      // The slug names the files of the scenario, so two scenarios cannot share it.
      const slug = slugOf(scenario);
      if (slug === BASELINE_SLUG) {
        throw new ScenarioError(
          `The scenario name "${labelOf(scenario)}" gives the file name "${BASELINE_SLUG}", which the baseline file uses. Rename the scenario.`,
        );
      }
      const same = labels.get(slug);
      if (same !== undefined) {
        throw new ScenarioError(
          `Two scenarios have the same name: "${same}" and "${labelOf(scenario)}"`,
        );
      }
      labels.set(slug, labelOf(scenario));
      checkScenario(scenario);
      return {
        scenario,
        endpoints: thresholdsById(scenario, config.thresholds?.default ?? {}),
      };
    });
}

function findScenarioFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    throw new ScenarioError(`No ${dir}. Add at least one *.load.ts file.`);
  }
  const files = fs
    .readdirSync(dir, {recursive: true})
    .filter(
      (entry): entry is string =>
        typeof entry === 'string' && entry.endsWith(SCENARIO_SUFFIX),
    )
    .sort()
    .map(entry => path.join(dir, entry));
  if (files.length === 0) {
    throw new ScenarioError(`No *.load.ts file in ${dir}`);
  }
  return files;
}

/** The scenarios that the `load.it` calls of a built file register. */
function registeredBy(file: string): Scenario[] {
  // Drops what an earlier file left behind.
  takeRegistered();
  require(file);
  const scenarios = takeRegistered();
  if (scenarios.length === 0) {
    throw new ScenarioError(
      `${file} registers no scenario. Add a load.it(...) call to it. If it has one, two copies of @sourceloop/load-testing are installed.`,
    );
  }
  return scenarios;
}

/** Throws a `ScenarioError` that lists what is wrong with the scenario. */
function checkScenario(scenario: Scenario): void {
  const requests = requestsIn(scenario.requests);
  const problems = [
    ...(scenario.phases === undefined
      ? []
      : phaseProblems(scenario.phases, 'phases')),
    ...thresholdProblems(scenario.thresholds, 'thresholds.'),
    ...headerBracesProblems(scenario),
    ...requests.flatMap(req => thresholdProblems(req.options, `${req.id}: `)),
    ...requests.flatMap(bracesProblems),
  ];
  if (problems.length > 0) {
    throw new ScenarioError(`Scenario ${labelOf(scenario)}:`, problems);
  }
}

function thresholdsById(scenario: Scenario, defaults: Thresholds) {
  const requests = requestsIn(scenario.requests);
  const ids = [...new Set(requests.map(req => req.id))];
  return new Map(
    ids.map(id => [
      id,
      resolveThresholds(
        defaults,
        scenario.thresholds ?? {},
        ...requests.filter(req => req.id === id).map(req => req.options),
      ),
    ]),
  );
}
