// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import fs from 'node:fs';
import path from 'node:path';
import {registeredIn} from '../scenario/builder';
import {isPlainObject, requestsIn} from '../scenario/guards';
import {bracesProblems, headerBracesProblems} from '../scenario/braces';
import {
  builtFile,
  SCENARIO_SUFFIX,
  SCENARIOS_DIR,
  SELECTION_SLUG,
} from './layout';
import {
  browserLimitProblems,
  metricProblems,
  phaseProblems,
  resolveBrowserLimits,
  resolveThresholds,
  thresholdProblems,
} from './config';
import {labelOf, SEPARATOR, slugOf} from '../scenario/label';
import {browsersOf} from '../engine/artillery/browsers';
import type {
  BrowserScenario,
  HttpScenario,
  LoadTestConfig,
  Scenario,
  Thresholds,
  WebVital,
} from '../types';
import {ScenarioError} from '../errors';
import {patternProblems} from '../changes/patterns';
import type {BrowserLimits, LoadedScenario} from './types';

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
  const browsers = browsersOf(config);
  return findScenarioFiles(path.join(pkgDir, SCENARIOS_DIR))
    .flatMap(source =>
      registeredBy(builtFile(pkgDir, source)).map(scenario => ({
        scenario,
        source,
      })),
    )
    .flatMap<{
      scenario: Scenario;
      source: string;
      vitals?: readonly WebVital[];
    }>(({scenario, source}) => {
      checkScenario(scenario);
      return scenario.browser
        ? browsers.map(browser => ({
            scenario: forBrowser(scenario, browser.name),
            source,
            vitals: browser.vitals,
          }))
        : [{scenario, source}];
    })
    .map(({scenario, source, vitals}) => {
      // The slug names the files of the scenario, so two scenarios cannot share it.
      const slug = slugOf(scenario);
      // `--since` writes `selection.json` into the folder of these files.
      if (slug === SELECTION_SLUG) {
        throw new ScenarioError(
          `The name of "${labelOf(scenario)}" is reserved for the selection report`,
        );
      }
      const same = labels.get(slug);
      if (same !== undefined) {
        throw new ScenarioError(
          `Two scenarios have the same name: "${same}" and "${labelOf(scenario)}"`,
        );
      }
      labels.set(slug, labelOf(scenario));
      return {
        scenario,
        source,
        endpoints: scenario.browser
          ? new Map()
          : thresholdsById(scenario, config.thresholds?.default ?? {}),
        ...(scenario.browser && {
          browser: onlyVitals(
            resolveBrowserLimits(config.thresholds ?? {}, scenario),
            vitals ?? [],
          ),
        }),
      };
    });
}

/**
 * The scenario for one browser. Its name ends with the browser, so that the
 * files and the report rows of each browser stay apart.
 */
function forBrowser(scenario: BrowserScenario, browserName: string): Scenario {
  return {
    ...scenario,
    name: `${scenario.name}${SEPARATOR}${browserName}`,
    browser: {
      ...scenario.browser,
      browserName,
      registeredLabel: labelOf(scenario),
    },
  };
}

/** The limits without the Web Vitals that the browser does not report. */
function onlyVitals(
  limits: BrowserLimits,
  reported: readonly WebVital[],
): BrowserLimits {
  return {
    ...limits,
    vitals: Object.fromEntries(
      Object.entries(limits.vitals).filter(([vital]) =>
        reported.includes(vital as WebVital),
      ),
    ),
  };
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

/**
 * The scenarios that the `load.it` calls of a built file register. A browser
 * scenario keeps the file, so that each worker can load its flow again.
 */
function registeredBy(file: string): Scenario[] {
  const scenarios = registeredIn(file);
  if (scenarios.length === 0) {
    throw new ScenarioError(
      `${file} registers no scenario. Add a load.it(...) or load.browser(...) call to it. If it has one, two copies of @sourceloop/load-testing are installed.`,
    );
  }
  return scenarios.map(scenario =>
    scenario.browser
      ? {...scenario, browser: {...scenario.browser, file}}
      : scenario,
  );
}

/** Throws a `ScenarioError` that lists what is wrong with the scenario. */
function checkScenario(scenario: Scenario): void {
  const requests = requestsIn(scenario.requests);
  const problems = [
    ...(scenario.phases === undefined
      ? []
      : phaseProblems(scenario.phases, 'phases')),
    ...(scenario.browser && typeof scenario.browser.flow !== 'function'
      ? [
          'flow must be a function: load.browser(name, async ({page, step}) => {...})',
        ]
      : []),
    ...patternProblems(scenario.covers, 'covers'),
    ...browserLimitProblems(scenario, ''),
    ...(scenario.browser?.steps !== undefined &&
    !isPlainObject(scenario.browser.steps)
      ? ['steps must be an object of limits, for example {save: {p95: 3000}}']
      : Object.entries(scenario.browser?.steps ?? {}).flatMap(
          ([name, limits]) => metricProblems(limits, `steps.${name}.`),
        )),
    ...metricProblems(scenario.browser?.flowLimits, 'flow.'),
    ...(scenario.browser
      ? []
      : [
          ...thresholdProblems(scenario.thresholds, 'thresholds.'),
          ...headerBracesProblems(scenario),
        ]),
    ...requests.flatMap(req => thresholdProblems(req.options, `${req.id}: `)),
    ...requests.flatMap(bracesProblems),
  ];
  if (problems.length > 0) {
    throw new ScenarioError(`Scenario ${labelOf(scenario)}:`, problems);
  }
}

function thresholdsById(scenario: HttpScenario, defaults: Thresholds) {
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
