// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {Measurement} from '../../report/types';
import type {Engine, EngineRun} from '../types';
import {runArtillery} from './runner';
import {checkChromium} from './chromium';
import {artilleryEnv} from './env';
import {isPlainObject} from '../../scenario/guards';
import type {ArtilleryConfig} from './types';
import {BASE_URL_ENV, UI_URL_ENV} from '../../project/layout';
import {checkUrl, checkRunVars, checkToken} from './templates';
import {writeScenario} from './transpiler';

/**
 * The default engine. It writes an Artillery script for the scenario, runs
 * it with the Artillery CLI, and reads the report that Artillery wrote.
 * Before each browser scenario, it checks that Chromium starts with the
 * `launchOptions` of the `artillery.config` of the package. The engine does
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
      const scriptPath = writeScenario(
        input.pkgDir,
        input.scenario,
        input.config.artillery?.config,
        input.phases,
        input.runVars,
      );
      if (input.scenario.browser) {
        await checkChromium(
          env,
          launchOptionsOf(input.config.artillery?.config),
          input.signal,
        );
      }
      return runArtillery(scriptPath, input.endpointIds, env, input.signal);
    },
  };
}

/**
 * The `launchOptions` that the script of a browser scenario gets: the library
 * sets none, so they come from the `artillery.config` of the package.
 */
function launchOptionsOf(
  config: ArtilleryConfig | undefined,
): Record<string, unknown> {
  const options: unknown = config?.engines?.playwright?.launchOptions;
  return isPlainObject(options) ? options : {};
}
