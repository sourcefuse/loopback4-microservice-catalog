// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import fs from 'node:fs';
import {HOOK_ERROR_PREFIX} from './processor';
import {MS_PER_SECOND, RunError} from '../../errors';
import type {EndpointStats, Measurement, VuserCounts} from '../../report/types';

type Aggregate = {
  counters: Record<string, number>;
  summaries: Record<string, {p95: number}>;
  /** Times in ms since 1970. Null when the run counted nothing. */
  firstCounterAt?: number | null;
  lastCounterAt?: number | null;
};

type Report = {aggregate: Aggregate};

/** The report as Artillery wrote it. Each counter group is missing when Artillery counted nothing. */
type RawReport = {aggregate?: Partial<Aggregate>};

const METRICS = 'plugins.metrics-by-endpoint';

/** The first HTTP status that counts as an error. */
const FIRST_ERROR_STATUS = 400;

/** The parsed report. A missing, broken or odd file is a RunError. */
function readReport(reportPath: string): RawReport {
  const invalid = (cause?: unknown) =>
    new RunError(`Artillery wrote no valid report: ${reportPath}`, {cause});
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  } catch (cause) {
    throw invalid(cause);
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw invalid();
  }
  return parsed;
}

/**
 * Reads the report that Artillery wrote, and gives what the run measured.
 * `ids` are the endpoint ids of the scenario.
 */
export function readRun(reportPath: string, ids: string[]): Measurement {
  const {aggregate} = readReport(reportPath);
  if (aggregate === undefined) {
    throw new RunError(
      `${reportPath} has no aggregate: Artillery wrote no result`,
    );
  }
  const report: Report = {
    aggregate: {counters: {}, summaries: {}, ...aggregate},
  };
  return {
    endpoints: parseReport(report, ids),
    hookErrors: countHookErrors(report),
    vusers: countVusers(report),
    seconds: measuredSeconds(report),
  };
}

function countVusers(report: Report): VuserCounts {
  const {counters} = report.aggregate;
  return {
    started: counters['vusers.created'] ?? 0,
    completed: counters['vusers.completed'] ?? 0,
    failed: counters['vusers.failed'] ?? 0,
  };
}

/** Seconds from the first to the last count, or 0 when nothing was counted. */
function measuredSeconds(report: Report): number {
  const {firstCounterAt, lastCounterAt} = report.aggregate;
  if (typeof firstCounterAt !== 'number') return 0;
  if (typeof lastCounterAt !== 'number') return 0;
  return (lastCounterAt - firstCounterAt) / MS_PER_SECOND;
}

/** Counts the errors whose message starts with `HOOK_ERROR_PREFIX`. */
function countHookErrors(report: Report): number {
  return Object.entries(report.aggregate.counters)
    .filter(([key]) => key.startsWith(`errors.${HOOK_ERROR_PREFIX}`))
    .reduce((sum, [, value]) => sum + value, 0);
}

function parseReport(
  report: Report,
  ids: string[],
): Map<string, EndpointStats> {
  const {counters, summaries} = report.aggregate;
  return new Map(
    ids.map(id => {
      const prefix = `${METRICS}.${id}.`;
      const stats: EndpointStats = {
        count: 0,
        failed: 0,
        p95: summaries[`${METRICS}.response_time.${id}`]?.p95,
      };
      for (const [key, value] of Object.entries(counters)) {
        if (!key.startsWith(prefix)) continue;
        const metric = key.slice(prefix.length);
        const status = /^codes\.(\d+)$/.exec(metric)?.[1];
        if (status === undefined && !metric.startsWith('errors.')) continue;
        stats.count += value;
        if (status === undefined || Number(status) >= FIRST_ERROR_STATUS)
          stats.failed += value;
      }
      return [id, stats];
    }),
  );
}
