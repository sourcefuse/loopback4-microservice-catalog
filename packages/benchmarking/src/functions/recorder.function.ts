// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import {dirname} from 'node:path';
import {config} from '../config';
import {type RunFile} from '../types';
import {BenchmarkingError} from '../errors/benchmarking.error';
import {ReporterError} from '../errors/reporter.error';

/** Reads a run file. A missing file is empty; an unreadable one throws. */
export function readRunFile(file: string): RunFile {
  if (!existsSync(file)) {
    return {};
  }
  const parsed: unknown = JSON.parse(readFileSync(file, 'utf-8'));
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new TypeError(`"${file}" does not hold a JSON object`);
  }
  return parsed as RunFile;
}

/**
 * Replaces the file in one step, so an interrupted run cannot leave a truncated
 * file behind.
 */
function writeRunFile(data: RunFile): void {
  mkdirSync(dirname(config.reportFile), {recursive: true});
  const temporary = `${config.reportFile}.tmp`;
  try {
    writeFileSync(temporary, JSON.stringify(data, null, 2));
    renameSync(temporary, config.reportFile);
  } catch (error) {
    rmSync(temporary, {force: true});
    throw error;
  }
}

/**
 * Appends the throughput of one run to `BENCH_REPORT_FILE`. Every run is kept:
 * `bench-compare` needs all runs of each side to measure their spread.
 *
 * An unreadable file stops the run instead of being replaced. Otherwise one bad
 * write would silently drop the runs that the other side is compared against.
 */
export function recordRun(
  suite: string,
  test: string,
  throughput: number,
): void {
  try {
    const data = readRunFile(config.reportFile);
    const history = data[suite]?.[test]?.history ?? [];
    data[suite] = {...data[suite], [test]: {history: [...history, throughput]}};
    writeRunFile(data);
  } catch (error) {
    if (error instanceof BenchmarkingError) {
      throw error;
    }
    throw new ReporterError(suite, test, error);
  }
}
