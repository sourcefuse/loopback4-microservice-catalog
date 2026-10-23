// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {readConfig} from '../project/config';
import {loadScenarios} from '../project/loader';
import {selectScenarios} from '../scenario/select';
import {coverage, readSpec, SPEC_FILE, specEndpoints} from '../project/spec';
import {login, readTarget} from './target';
import type {LoadTestConfig} from '../types';
import {print} from '../output';
import {ConfigError} from '../errors';
import {usesToken} from '../scenario/token';
import {labelOf} from '../scenario/label';
import {findHeavyEndpoints} from '../project/heavy';
import type {Coverage, HeavyEndpoint, LoadedScenario} from '../project/types';
import type {RunResult} from '../report/types';
import type {Session, Target} from './types';

/** The config and the scenarios of a package, before any URL or login. */
type LoadedPackage = {
  config: LoadTestConfig;
  scenarios: LoadedScenario[];
  skipped: LoadedScenario[];
  /**
   * How many endpoints of `src/openapi.json` the scenarios cover. Undefined
   * when the package has no spec.
   */
  endpointCoverage?: Coverage;
  /** Heavy endpoints over all loaded scenarios, also the skipped ones. */
  heavyEndpoints: HeavyEndpoint[];
};

/** What a run needs before its first scenario. */
type Prepared = LoadedPackage & {
  target: Target;
  /** Undefined when the run has no login. */
  session?: Session;
};

/**
 * Reads the config and the scenarios, finds the heavy endpoints of all loaded
 * scenarios, and checks the endpoints against the spec. It reads no URL.
 */
export function loadPackage(
  pkgDir: string,
  env: NodeJS.ProcessEnv,
): LoadedPackage {
  const config = readConfig(pkgDir);
  const all = loadScenarios(pkgDir, config);
  const {run: scenarios, skipped} = selectScenarios(all, env);
  if (all.some(({scenario}) => scenario.only)) {
    print(`Only ${scenarios.length} of ${all.length} scenarios run (.only)`);
  }
  const declared = scenarios.flatMap(s => [...s.endpoints.keys()]);
  const spec = readSpec(pkgDir);
  const endpointCoverage =
    spec === undefined ? undefined : coverage(declared, specEndpoints(spec));
  if (endpointCoverage && endpointCoverage.unknown.length > 0) {
    throw new ConfigError(
      `src/openapi.json has no ${endpointCoverage.unknown.join(', ')}`,
    );
  }
  return {
    config,
    scenarios,
    skipped,
    endpointCoverage,
    heavyEndpoints: findHeavyEndpoints(all),
  };
}

/** The coverage line of the result. A package with no spec gets `noSpec`. */
export function coverageOf(
  endpointCoverage: Coverage | undefined,
): RunResult['coverage'] {
  return endpointCoverage
    ? {
        covered: endpointCoverage.covered,
        total: endpointCoverage.total,
        specFile: SPEC_FILE,
      }
    : {covered: 0, total: 0, specFile: SPEC_FILE, noSpec: true};
}

/**
 * Loads the package, reads the URLs that its scenarios need, and logs in
 * when `LOAD_TESTS_USERNAME` is set. A scenario that uses `token()` with no
 * login is a `ConfigError`, before any login or hook. `signal` stops the
 * login.
 */
export async function prepare(
  pkgDir: string,
  env: NodeJS.ProcessEnv,
  signal?: AbortSignal,
): Promise<Prepared> {
  const loaded = loadPackage(pkgDir, env);
  const {scenarios} = loaded;
  const target = readTarget(env, {
    // The API client of `before` and `after` uses the base URL, also in a browser scenario.
    api: scenarios.some(
      ({scenario}) =>
        scenario.browser === undefined ||
        scenario.before !== undefined ||
        scenario.after !== undefined,
    ),
    ui: scenarios.some(({scenario}) => scenario.browser !== undefined),
  });
  const needLogin = scenarios.filter(({scenario}) => usesToken(scenario));
  if (target.login === undefined && needLogin.length > 0) {
    throw new ConfigError(
      'token() needs a login: set LOAD_TESTS_USERNAME, LOAD_TESTS_PASSWORD, LOAD_TESTS_CLIENT_ID and LOAD_TESTS_CLIENT_SECRET, or remove token() from these scenarios:',
      needLogin.map(({scenario}) => labelOf(scenario)),
    );
  }
  return {
    ...loaded,
    target,
    session:
      target.login && (await login({...target, login: target.login}, signal)),
  };
}
