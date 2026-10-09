// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {CLI_ONLY_PREFIX} from '../../project/config';
import {TOKEN_ENV} from './requests';

const BASE_URL_ENV = 'LOAD_TESTS_BASE_URL';

/**
 * The names that Artillery gets from the CLI by default, and every name
 * that starts with `LC_`. A name is compared without regard to letter case.
 * This is not a sandbox. It keeps the secrets of a CI job (for example
 * `GITHUB_TOKEN`) out of `{{ $env.NAME }}` in a script and out of the
 * plugins of Artillery. `NODE_` and `ARTILLERY_` are not prefixes here,
 * because `NODE_AUTH_TOKEN` and `ARTILLERY_CLOUD_API_KEY` are secrets. Other
 * names go in `artillery.env` of the config.
 */
const DEFAULT_ENV_NAMES = new Set([
  'PATH',
  'HOME',
  'USERPROFILE',
  'TMPDIR',
  'TMP',
  'TEMP',
  'LANG',
  'TZ',
  'TERM',
  'COLORTERM',
  'NO_COLOR',
  'FORCE_COLOR',
  'CI',
  'HTTP_PROXY',
  'HTTPS_PROXY',
  'SSL_CERT_FILE',
  'SSL_CERT_DIR',
  'NODE_OPTIONS',
  'NODE_EXTRA_CA_CERTS',
  'NODE_PATH',
  'NODE_ENV',
  'NODE_NO_WARNINGS',
  'NODE_TLS_REJECT_UNAUTHORIZED',
  'ARTILLERY_WORKERS',
  'SYSTEMROOT',
  'WINDIR',
  'COMSPEC',
  'PATHEXT',
  'APPDATA',
  'LOCALAPPDATA',
]);

/** Locale variables (`LC_ALL`, `LC_CTYPE`) go through, so the output keeps its encoding. */
const LOCALE_PREFIX = 'LC_';

/**
 * The environment of Artillery: the variables of `DEFAULT_ENV_NAMES`, and the
 * ones in `extraNames` (`artillery.env` of the config), when the CLI has
 * them. A name that starts with `LOAD_TESTS_` never goes through. The script
 * reads two variables, and this function sets both: the base URL (the hooks
 * use the same one, without a slash at the end) and the token. It sets the
 * token only when `token` is given, that is when the CLI has a login and the
 * scenario uses `token()`.
 */
export function artilleryEnv(
  baseUrl: string,
  token?: string,
  env: NodeJS.ProcessEnv = process.env,
  extraNames: string[] = [],
): NodeJS.ProcessEnv {
  const extra = new Set(extraNames.map(name => name.toUpperCase()));
  const out: NodeJS.ProcessEnv = Object.fromEntries(
    Object.entries(env).filter(([name]) => {
      const key = name.toUpperCase();
      return (
        !key.startsWith(CLI_ONLY_PREFIX) &&
        (DEFAULT_ENV_NAMES.has(key) ||
          key.startsWith(LOCALE_PREFIX) ||
          extra.has(key))
      );
    }),
  );
  out[BASE_URL_ENV] = baseUrl;
  /*
   * The token goes from the CLI to Artillery in the environment, never on
   * disk. Without a token, an old value in the environment of the CLI must
   * not reach the script.
   */
  if (token !== undefined) out[TOKEN_ENV] = token;
  return out;
}
