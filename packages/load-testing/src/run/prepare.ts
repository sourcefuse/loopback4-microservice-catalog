// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {readConfig} from '../project/config';
import {loadScenarios} from '../project/loader';
import {selectScenarios} from '../scenario/select';
import {coverage, readSpec, specEndpoints} from '../project/spec';
import {login, readTarget} from './target';
import type {LoadTestConfig} from '../types';
import {print} from '../output';
import {ConfigError} from '../errors';
import {usesToken} from '../scenario/token';
import {labelOf} from '../scenario/label';
import {findHeavyEndpoints} from '../project/heavy';
import type {Coverage, HeavyEndpoint, LoadedScenario} from '../project/types';
import type {Session, Target} from './types';

/** What a run needs before its first scenario. */
type Prepared = {
  target: Target;
  config: LoadTestConfig;
  scenarios: LoadedScenario[];
  skipped: LoadedScenario[];
  /** Undefined when the run has no login. */
  session?: Session;
  /** How many endpoints of `src/openapi.json` the scenarios cover. */
  endpointCoverage: Coverage;
  /** Heavy endpoints over all loaded scenarios, also the skipped ones. */
  heavyEndpoints: HeavyEndpoint[];
};

/**
 * Reads the config and the scenarios, finds the heavy endpoints of all loaded
 * scenarios, checks the endpoints against the spec,
 * and logs in when `LOAD_TESTS_USERNAME` is set. A scenario that uses `token()`
 * with no login is a `ConfigError`, before any login or hook. `signal` stops
 * the login.
 */
export async function prepare(
  pkgDir: string,
  env: NodeJS.ProcessEnv,
  signal?: AbortSignal,
): Promise<Prepared> {
  const target = readTarget(env);
  const config = readConfig(pkgDir);
  const all = loadScenarios(pkgDir, config);
  const {run: scenarios, skipped} = selectScenarios(all, env);
  if (scenarios.length < all.length - skipped.length) {
    print(`Only ${scenarios.length} of ${all.length} scenarios run (.only)`);
  }
  const needLogin = scenarios.filter(({scenario}) => usesToken(scenario));
  if (target.login === undefined && needLogin.length > 0) {
    throw new ConfigError(
      'token() needs a login: set LOAD_TESTS_USERNAME, LOAD_TESTS_PASSWORD, LOAD_TESTS_CLIENT_ID and LOAD_TESTS_CLIENT_SECRET, or remove token() from these scenarios:',
      needLogin.map(({scenario}) => labelOf(scenario)),
    );
  }
  const declared = scenarios.flatMap(s => [...s.endpoints.keys()]);
  const endpointCoverage = coverage(declared, specEndpoints(readSpec(pkgDir)));
  if (endpointCoverage.unknown.length > 0) {
    throw new ConfigError(
      `src/openapi.json has no ${endpointCoverage.unknown.join(', ')}`,
    );
  }
  return {
    target,
    config,
    scenarios,
    skipped,
    session:
      target.login && (await login({...target, login: target.login}, signal)),
    endpointCoverage,
    heavyEndpoints: findHeavyEndpoints(all),
  };
}
