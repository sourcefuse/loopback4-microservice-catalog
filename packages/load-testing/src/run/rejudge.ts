// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import fs from 'node:fs';
import path from 'node:path';
import {readRun} from '../engine/artillery/measure';
import {REPORT_SUFFIX, reportPathOf} from '../engine/artillery/runner';
import {ConfigError, RunError} from '../errors';
import {resolveThresholds} from '../project/config';
import {OUT_DIR} from '../project/layout';
import type {LoadedScenario} from '../project/types';
import {readBaseline} from '../report/compare';
import {failedScenario, judgeRun, judgeScenario} from '../report/report';
import type {Measurement, RunResult} from '../report/types';
import {labelOf, slugOf} from '../scenario/label';
import {describeWorkload, phasesOf} from '../scenario/workload';
import {coverageOf, loadPackage} from './prepare';

const NO_REPORT =
  'No report file: the last run of this scenario failed or did not start.';

/**
 * Deletes the report files in `.out`, so that `rejudge` judges only the run
 * that follows. The engine deletes a report file only when the load of its
 * scenario starts, and a scenario can fail before that.
 */
export function clearReports(pkgDir: string): void {
  const outDir = path.join(pkgDir, OUT_DIR);
  if (!fs.existsSync(outDir)) return;
  for (const file of fs.readdirSync(outDir)) {
    if (file.endsWith(REPORT_SUFFIX)) fs.rmSync(path.join(outDir, file));
  }
}

/**
 * Judges the last run again from the report files that Artillery wrote in
 * `.out`, with no load and no URL. A scenario that was selected but has no
 * report file failed or did not start in the last run. `run`
 * deletes the old report files first, so a file is never from an older run.
 * `after` and the cleanups do not run again, so a failure of theirs in the
 * last run does not count here.
 */
export function rejudge(pkgDir: string, env: NodeJS.ProcessEnv): RunResult {
  const {config, scenarios, skipped, endpointCoverage, heavyEndpoints} =
    loadPackage(pkgDir, env);
  const outDir = path.join(pkgDir, OUT_DIR);
  const reportOf = ({scenario}: LoadedScenario) =>
    reportPathOf(outDir, slugOf(scenario));
  const reported = scenarios.filter(loaded => fs.existsSync(reportOf(loaded)));
  if (reported.length === 0) {
    throw new ConfigError(
      `No report file in ${outDir}. Run load-testing run first.`,
    );
  }
  const baseline = readBaseline(pkgDir);
  const vuserLimits = resolveThresholds(config.thresholds?.default ?? {});
  const results = scenarios.map(loaded => {
    if (!reported.includes(loaded)) {
      return failedScenario(labelOf(loaded.scenario), NO_REPORT);
    }
    let measured: Measurement;
    try {
      measured = readRun(reportOf(loaded), [...loaded.endpoints.keys()]);
    } catch (err) {
      // A broken file of one scenario must not hide the others.
      if (err instanceof RunError) {
        return failedScenario(labelOf(loaded.scenario), err.message);
      }
      throw err;
    }
    const workload = describeWorkload(phasesOf(loaded.scenario, config));
    return judgeScenario(
      loaded,
      {...measured, workload, problems: []},
      {baseline, vuserLimits},
    ).result;
  });
  return judgeRun(results, {
    skipped: skipped.map(({scenario}) => labelOf(scenario)),
    coverage: coverageOf(endpointCoverage),
    heavyApis: {endpoints: heavyEndpoints, max: config.maxHeavyApis ?? 0},
    hasBaseline: baseline !== undefined,
    stopped: false,
  });
}
