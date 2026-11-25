// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/** How many different failed requests print, for each scenario. */
const DUMPS_SHOWN = 3;

/** How many different `Error:` lines print, for each scenario. */
const ERRORS_SHOWN = 3;

/** A line that the plugin prints for a scenario error, for example `Error: connect ECONNREFUSED`. */
const ERROR_LINE = /^Error: /;

type Check = {ok?: boolean; type?: string};

/**
 * The expect plugin with `outputFormat: json` prints one line for each
 * request that has checks: `{"name":..., "url":..., "results":[...]}`. A line
 * is one write, so lines of different workers do not mix.
 */
function parseExpectLine(
  line: string,
): {url: string; failed: string[]} | undefined {
  if (!line.startsWith('{"')) return undefined;
  try {
    const data = JSON.parse(line) as {url?: unknown; results?: unknown};
    if (!Array.isArray(data.results)) return undefined;
    const failed = (data.results as Check[])
      .filter(result => result.ok === false)
      .map(result => String(result.type));
    return {url: String(data.url), failed};
  } catch {
    return undefined;
  }
}

/**
 * The text of a scenario error line, or undefined for any other line. The
 * plugin prints `Error: <message>`, and with the json format
 * `{"ok":false,"error":"<message>"}`.
 */
function errorOf(line: string): string | undefined {
  if (ERROR_LINE.test(line)) return line;
  if (!line.startsWith('{"ok":false,"error":')) return undefined;
  try {
    const {error} = JSON.parse(line) as {error?: unknown};
    return typeof error === 'string' ? error : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Makes the output of Artillery short. `accept` returns the lines to print for
 * a line of the output. A line of a passing check prints nothing. The first
 * `DUMPS_SHOWN` failed requests that differ in url and check print, and so do
 * the first `ERRORS_SHOWN` different `Error:` lines. Every other line of a
 * failure is counted, and `summary()` says how many. The caller also writes
 * every line to a file, so nothing is lost.
 */
export function createCompactFilter(): {
  accept(line: string): string[];
  summary(): string | undefined;
} {
  const shown = new Set<string>();
  const errorsShown = new Set<string>();
  let hidden = 0;
  let hiddenErrors = 0;

  return {
    accept(line: string): string[] {
      const expectLine = parseExpectLine(line);
      if (expectLine) {
        if (expectLine.failed.length === 0) return [];
        const id = `${expectLine.url} ${expectLine.failed.join(',')}`;
        if (shown.has(id) || shown.size >= DUMPS_SHOWN) {
          hidden++;
          return [];
        }
        shown.add(id);
        return [line];
      }
      const error = errorOf(line);
      if (error === undefined) return [line];
      if (errorsShown.has(error) || errorsShown.size >= ERRORS_SHOWN) {
        hiddenErrors++;
        return [];
      }
      errorsShown.add(error);
      return [line];
    },
    summary(): string | undefined {
      const parts = [
        ...(hidden > 0 ? [`+${hidden} more failed requests`] : []),
        ...(hiddenErrors > 0 ? [`+${hiddenErrors} more error lines`] : []),
      ];
      return parts.length > 0 ? parts.join(', ') : undefined;
    },
  };
}
