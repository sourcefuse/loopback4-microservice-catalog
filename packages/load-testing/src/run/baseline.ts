// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BASELINE_FILE, hostChanged, saveRun} from '../report/compare';
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
    baseUrl?: string;
    uiUrl?: string;
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
    uiUrl: run.uiUrl,
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
 * The lines that say the baseline comes from another API or web app, or
 * undefined when there is no baseline or the URLs are the same. The p95 of
 * another host does not tell much about this one.
 */
export function baselineUrlNote(
  baseline: Baseline | undefined,
  baseUrl: string | undefined,
  uiUrl?: string,
): string | undefined {
  const notes = [
    ...(hostChanged(baseline?.baseUrl, baseUrl)
      ? [`The baseline is from ${baseline?.baseUrl}, not ${baseUrl}.`]
      : []),
    ...(hostChanged(baseline?.uiUrl, uiUrl)
      ? [
          `The baseline of the web app is from ${baseline?.uiUrl}, not ${uiUrl}.`,
        ]
      : []),
  ];
  return notes.length > 0 ? notes.join('\n') : undefined;
}
