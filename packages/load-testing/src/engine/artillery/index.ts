// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {Measurement} from '../../report/types';
import type {Engine, EngineRun} from '../types';
import {runArtillery} from './runner';
import {browsersOf, engineOptionsOf} from './browsers';
import type {BrowserEngine} from './browsers';
import {artilleryEnv} from './env';
import {ScenarioError} from '../../errors';
import {labelOf} from '../../scenario/label';
import type {LoadTestConfig, Scenario} from '../../types';
import {BASE_URL_ENV, UI_URL_ENV} from '../../project/layout';
import {checkUrl, checkRunVars, checkToken} from './templates';
import {writeScenario} from './transpiler';

/**
 * The default engine. It writes an Artillery script for the scenario, runs
 * it with the Artillery CLI, and reads the report that Artillery wrote.
 * Before each browser scenario, it runs the `check` of its browser, which
 * for Chromium starts it with the `launchOptions` of the package. The engine does
 * not keep the result, so it holds no state from one scenario to the next.
 */
export function artillery(): Engine {
  return {
    name: 'artillery',
    async run(input: EngineRun): Promise<Measurement> {
      if (input.scenario.browser) {
        // A browser scenario has no template fill, so only the JSON that the
        // processor holds must work: a cycle or a BigInt throws here.
        JSON.stringify(input.runVars);
      } else {
        checkRunVars(input.runVars);
      }
      checkToken(input.token);
      const urlName = input.scenario.browser ? UI_URL_ENV : BASE_URL_ENV;
      checkUrl(input.baseUrl, urlName);
      const env = artilleryEnv({
        url: input.baseUrl,
        token: input.token,
        extraNames: input.config.artillery?.env,
        urlName,
      });
      const browser = input.scenario.browser
        ? browserOf(input.scenario, input.config)
        : undefined;
      const scriptPath = writeScenario(
        input.pkgDir,
        input.scenario,
        input.config.artillery?.config,
        input.phases,
        input.runVars,
        browser,
      );
      await browser?.check?.({
        env,
        options: engineOptionsOf(browser, input.config.artillery?.config),
        signal: input.signal,
      });
      return runArtillery(scriptPath, input.endpointIds, env, input.signal);
    },
  };
}

/**
 * The browser of a browser scenario: the one that its label names, or the
 * first of `artillery.browsers` for a scenario that the loader did not mark.
 */
function browserOf(scenario: Scenario, config: LoadTestConfig): BrowserEngine {
  const browsers = browsersOf(config);
  const name = scenario.browser?.browserName;
  const found =
    name === undefined ? browsers[0] : browsers.find(b => b.name === name);
  if (found === undefined) {
    throw new ScenarioError(
      `Scenario ${labelOf(scenario)}: artillery.browsers has no browser "${name}"`,
    );
  }
  return found;
}
