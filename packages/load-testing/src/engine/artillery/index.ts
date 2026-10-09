// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {Measurement} from '../../report/types';
import type {Engine, EngineRun} from '../types';
import {runArtillery} from './runner';
import {artilleryEnv} from './env';
import {checkRunVars, checkToken} from './templates';
import {writeScenario} from './transpiler';

/**
 * The default engine. It writes an Artillery script for the scenario, runs
 * it with the Artillery CLI, and reads the report that Artillery wrote.
 */
export function artillery(): Engine {
  return {
    name: 'artillery',
    async run(input: EngineRun): Promise<Measurement> {
      checkRunVars(input.runVars);
      checkToken(input.token);
      const scriptPath = writeScenario(
        input.pkgDir,
        input.scenario,
        input.config.artillery?.config,
        input.phases,
        input.runVars,
      );
      return runArtillery(
        scriptPath,
        input.endpointIds,
        artilleryEnv(
          input.baseUrl,
          input.token,
          process.env,
          input.config.artillery?.env,
        ),
        input.signal,
      );
    },
  };
}
