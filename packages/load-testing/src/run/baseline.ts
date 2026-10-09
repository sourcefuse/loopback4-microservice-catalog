// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BASELINE_FILE, saveRun} from '../report/compare';
import type {Baseline} from '../report/types';
import type {Outcome} from './types';

/**
 * Adds the run to the baseline file when `LOAD_TESTS_UPDATE_BASELINE=1`, and
 * says what happened. A run that failed stays out, also when only `after` or
 * a cleanup failed, unless `LOAD_TESTS_FORCE_BASELINE=1`. `print` and
 * `printError` are where the messages go.
 */
export function saveBaselineIfAsked(
  run: {
    pkgDir: string;
    baseUrl: string;
    baseline?: Baseline;
    outcome: Outcome;
    passed: boolean;
  },
  env: NodeJS.ProcessEnv,
  output: {print: (line: string) => void; printError: (line: string) => void},
): void {
  if (env.LOAD_TESTS_UPDATE_BASELINE !== '1') return;
  const saved = saveRun(run.pkgDir, {
    baseUrl: run.baseUrl,
    baseline: run.baseline,
    measured: run.outcome.measured,
    failed: !run.passed,
    force: env.LOAD_TESTS_FORCE_BASELINE === '1',
  });
  if (saved) output.print(`\nSaved ${BASELINE_FILE}`);
  else {
    output.printError(
      `\nBaseline not changed: the run failed. Set LOAD_TESTS_FORCE_BASELINE=1 to add it anyway.`,
    );
  }
}

/**
 * The line that says the baseline comes from another URL, or undefined when
 * there is no baseline or the URL is the same. The p95 of another host does
 * not tell much about this one.
 */
export function baselineUrlNote(
  baseline: Baseline | undefined,
  baseUrl: string,
): string | undefined {
  return baseline && baseline.baseUrl !== baseUrl
    ? `The baseline is from ${baseline.baseUrl}, not ${baseUrl}.`
    : undefined;
}
