// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {readConfig} from '../project/config';
import {loadScenarios} from '../project/loader';
import {selectScenarios} from '../scenario/select';
import {coverage, readSpec, SPEC_FILE, specEndpoints} from '../project/spec';
import {loginAll, readTarget} from './target';
import type {LoadTestConfig} from '../types';
import {print} from '../output';
import {changesSince} from '../changes/git';
import {selectByChanges} from '../changes/select';
import type {ChangeSelection} from '../changes/select';
import {ConfigError} from '../errors';
import {usesToken} from '../scenario/token';
import {labelOf} from '../scenario/label';
import {findHeavyEndpoints} from '../project/heavy';
import type {Coverage, HeavyEndpoint, LoadedScenario} from '../project/types';
import type {RunResult} from '../report/types';
import type {Session, Target} from './types';

/** Seconds that the login may wait in total on 429, when `config.ts` does not say. */
const DEFAULT_LOGIN_WAIT_SECONDS = 300;

/** The config and the scenarios of a package, before any URL or login. */
export type LoadedPackage = {
  config: LoadTestConfig;
  scenarios: LoadedScenario[];
  skipped: LoadedScenario[];
  /** What `--since` selected. Undefined without `--since`. */
  selection?: ChangeSelection;
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
  /** One session for each pool user. Empty when the run has no login. */
  sessions: Session[];
};

/**
 * Reads the config and the scenarios, finds the heavy endpoints of all loaded
 * scenarios, and checks the endpoints against the spec. It reads no URL.
 */
export function loadPackage(
  pkgDir: string,
  env: NodeJS.ProcessEnv,
  since?: string,
): LoadedPackage {
  const config = readConfig(pkgDir);
  const all = loadScenarios(pkgDir, config);
  const {run: picked, skipped} = selectScenarios(all, env);
  if (all.some(({scenario}) => scenario.only)) {
    print(`Only ${picked.length} of ${all.length} scenarios run (.only)`);
  }
  const changed =
    since === undefined
      ? undefined
      : selectByChanges(
          {picked, skipped},
          changesSince(pkgDir, since),
          pkgDir,
          config.runAllWhen ?? [],
        );
  const scenarios = changed?.selected ?? picked;
  const declared = picked.flatMap(s => [...s.endpoints.keys()]);
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
    selection: changed?.selection,
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
 * when `LOAD_TESTS_USERS_FILE` is set. A scenario that uses `token()` with no
 * login is a `ConfigError`, before any login or hook. `signal` stops the
 * login. `loaded` is the package, when the caller has loaded it already.
 */
export async function prepare(
  pkgDir: string,
  env: NodeJS.ProcessEnv,
  signal?: AbortSignal,
  loaded: LoadedPackage = loadPackage(pkgDir, env),
): Promise<Prepared> {
  const {scenarios} = loaded;
  const target = readTarget(
    env,
    {
      // The API client of `before` and `after` uses the base URL, also in a browser scenario.
      api: scenarios.some(
        ({scenario}) =>
          scenario.browser === undefined ||
          scenario.before !== undefined ||
          scenario.after !== undefined,
      ),
      ui: scenarios.some(({scenario}) => scenario.browser !== undefined),
    },
    loaded.config.apis,
  );
  const needLogin = scenarios.filter(({scenario}) => usesToken(scenario));
  if (target.login === undefined && needLogin.length > 0) {
    throw new ConfigError(
      'token() needs a login: set LOAD_TESTS_USERS_FILE, LOAD_TESTS_CLIENT_ID and LOAD_TESTS_CLIENT_SECRET, or remove token() from these scenarios:',
      needLogin.map(({scenario}) => labelOf(scenario)),
    );
  }
  // A run that selects nothing does not log in.
  const sessions =
    target.login && scenarios.length > 0
      ? await loginAll(
          {...target, login: target.login},
          loaded.config.loginWaitSeconds ?? DEFAULT_LOGIN_WAIT_SECONDS,
          signal,
        )
      : [];
  return {
    ...loaded,
    // The passwords are needed only for the login above.
    target: target.login
      ? {...target, login: {...target.login, users: []}}
      : target,
    sessions,
  };
}
