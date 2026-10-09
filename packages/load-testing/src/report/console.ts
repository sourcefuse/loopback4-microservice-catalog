// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {print} from '../output';
import {BASELINE_FILE, exceedsMax, round} from './compare';
import {P95_TARGETS} from '../project/config';
import type {
  EndpointResult,
  HeavyApis,
  Reporter,
  RunResult,
  ScenarioResult,
} from './types';

const TABLE_HEADER = [
  'Endpoint',
  'Requests',
  'Req/s',
  'p95 ms (limit)',
  'Base ms',
  'Err % (limit)',
  'Result',
];

/** Says what a vuser is, because "users" often means rows of a users table. */
const LEGEND =
  'A vuser is one virtual user. It runs the steps of a scenario one time. Failed means that its run stopped on an error.';

/**
 * Prints the result of the run on the standard output: one block with a
 * table for each scenario, the skipped scenarios, the coverage and a
 * legend. It is the default reporter.
 */
export function consoleReporter(): Reporter {
  return {name: 'console', onRunEnd: printRun};
}

function printRun(result: RunResult): void {
  print('\nResults');
  for (const scenario of result.scenarios) printScenario(scenario);
  for (const name of result.skipped) print(`\nSkipped: ${name}`);
  if (!result.stopped) {
    const {covered, total, specFile} = result.coverage;
    print(`\nCoverage: ${covered} of ${total} endpoints in ${specFile}`);
    if (!result.hasBaseline) {
      print(
        `No ${BASELINE_FILE}. Run once with LOAD_TESTS_UPDATE_BASELINE=1 to record it.`,
      );
    }
    for (const line of heavyApiLines(result.heavyApis)) print(line);
  }
  print(`\n${LEGEND}`);
}

function heavyApiLines(heavyApis: HeavyApis): string[] {
  const {max, endpoints} = heavyApis;
  const count = endpoints.length;
  if (count === 0 && max === 0) return [];
  const lines = [''];
  if (count > 0) {
    const width = Math.max(...endpoints.map(({id}) => id.length));
    lines.push(
      `Heavy APIs: ${count} of at most ${max} (maxHeavyApis in config.ts). A heavy API has a p95 limit above ${P95_TARGETS.supportingApi} ms.`,
      ...endpoints.map(({id, p95}) => `  ${id.padEnd(width)}  ${p95} ms`),
    );
  }
  if (exceedsMax(heavyApis)) {
    lines.push(
      `FAIL: ${count} heavy ${count === 1 ? 'API' : 'APIs'}, but maxHeavyApis is ${max}. Lower the p95 limit of an endpoint to ${P95_TARGETS.supportingApi} ms or less, or raise maxHeavyApis in config.ts.`,
    );
  }
  if (count < max) {
    lines.push(
      `Note: maxHeavyApis is ${max}, but ${describeCount(count)}. Lower maxHeavyApis in config.ts.`,
    );
  }
  return lines;
}

function describeCount(count: number): string {
  if (count === 0) return 'no endpoint is heavy';
  return count === 1 ? '1 endpoint is heavy' : `${count} endpoints are heavy`;
}

function printScenario(scenario: ScenarioResult): void {
  print(`\n${scenario.name}`);
  for (const line of linesOf(scenario)) print(line);
  if (scenario.endpoints.length === 0) return;
  print();
  printTable([TABLE_HEADER, ...scenario.endpoints.map(rowOf)]);
}

function linesOf(scenario: ScenarioResult): string[] {
  if (scenario.error !== undefined) return [`FAIL: ${scenario.error}`];
  const {workload, vusers, hookErrors, problems, baselineNote} = scenario;
  const counts = `${vusers.started} started, ${vusers.completed} completed, ${vusers.failed} failed`;
  return [
    `Workload: ${workload}`,
    vusers.failures.length > 0
      ? `Vusers:   ${counts} (FAIL: ${vusers.failures.join('; ')})`
      : `Vusers:   ${counts} (limit ${vusers.failedLimit}%)`,
    ...(hookErrors > 0
      ? [`Hooks:    ${hookErrors} error(s), not app errors (FAIL)`]
      : []),
    ...problems.map(problem => `FAIL: ${problem}`),
    ...(baselineNote === undefined ? [] : [`Baseline: ${baselineNote}`]),
  ];
}

function rowOf(endpoint: EndpointResult): string[] {
  return [
    endpoint.id,
    String(endpoint.requests),
    formatNumber(endpoint.perSecond),
    withLimit(formatNumber(endpoint.p95), endpoint.p95Limit),
    formatNumber(endpoint.baselineP95),
    withLimit(String(round(endpoint.errorRate)), endpoint.errorRateLimit),
    resultCell(endpoint),
  ];
}

function resultCell({failures, note}: EndpointResult): string {
  if (failures.length > 0) return `FAIL: ${failures.join('; ')}`;
  return note === undefined ? 'pass' : `pass (${note})`;
}

/** A value with its limit next to it, for example `76 (90)`. */
function withLimit(value: string, limit: number): string {
  return `${value} (${round(limit)})`;
}

function formatNumber(value: number | undefined): string {
  return value === undefined ? '-' : String(round(value));
}

function printTable(rows: string[][]): void {
  const widths = rows[0].map((_, i) => Math.max(...rows.map(r => r[i].length)));
  for (const row of rows) {
    print(
      row
        .map((cell, i) => cell.padEnd(widths[i]))
        .join('  ')
        .trimEnd(),
    );
  }
}
