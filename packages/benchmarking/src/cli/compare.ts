// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {type RunFile} from '../types';
import {readRunFile} from '../functions/recorder.function';
import {PERCENT, computeThreshold, typicalOps} from '../stats';

const DECIMAL_PRECISION = 1;
/** Bad usage or a crash. Kept apart from 1, which means a regression. */
const EXIT_ERROR = 2;
const STATUS_WIDTH = 'UNCONFIRMED'.length;
const DEVIATION_WIDTH = 8;
/** A benchmark slower than this part of its threshold is a suspect. */
const SUSPECT_FRACTION = 0.5;
/** Throughput at or above this prints without decimals. */
const WHOLE_OPS_FROM = 100;
const FLAGS = new Set(['--markdown', '--suspects', '--help']);

const USAGE = `Usage: bench-compare <base.json> <head.json> [<base-recheck.json> <head-recheck.json>] [--markdown]
       bench-compare <base.json> <head.json> --suspects

Compares the run files of two builds, benchmark by benchmark. Record both on
the same machine, alternating between the builds. For each side it takes the
mean throughput of all runs, without the runs more than BENCH_OUTLIER_PERCENT
from that side's median. A benchmark regresses when head is slower than base
by more than its threshold: BENCH_NOISE_MULTIPLIER times the run-to-run spread
of the noisier side, clamped to [BENCH_MIN_THRESHOLD, BENCH_THRESHOLD].

--suspects prints "suite<TAB>test" for each benchmark slower than half its
threshold. Run the files that hold them again, on both sides, into a second
pair of run files. With that pair, a regression counts only if it repeats;
otherwise it shows as UNCONFIRMED.

Exits 1 on a regression or when a benchmark of base is missing from head,
and 2 on bad usage or an unreadable file.`;

export type CompareStatus = 'REGRESSION' | 'UNCONFIRMED' | 'IMPROVEMENT' | 'OK';

export type CompareRow = {
  suite: string;
  test: string;
  baseOps: number;
  headOps: number;
  /** Change of head against base, in %. */
  deviation: number;
  threshold: number;
  noise?: number;
  status: CompareStatus;
  /** Deviation, in %, of the second pass, when there was one. */
  recheckDeviation?: number;
};

export type CompareResult = {
  rows: CompareRow[];
  /** Benchmarks only in base: removed, renamed, or crashed on head. */
  onlyInBase: string[];
  /** Benchmarks only in head: new or renamed. */
  onlyInHead: string[];
};

/** The single rule for what counts as a regression. */
function statusOf(deviation: number, threshold: number): CompareStatus {
  if (deviation < -threshold) {
    return 'REGRESSION';
  }
  return deviation > threshold ? 'IMPROVEMENT' : 'OK';
}

function compareTest(
  suite: string,
  test: string,
  baseHistory: number[],
  headHistory: number[],
): CompareRow {
  const baseOps = typicalOps(baseHistory);
  const headOps = typicalOps(headHistory);
  // A base that did nothing, or a side that is not a number, gives no usable
  // deviation. Count it as a regression, so that NaN cannot pass as OK.
  const usable =
    Number.isFinite(baseOps) && baseOps > 0 && Number.isFinite(headOps);
  const deviation = usable
    ? ((headOps - baseOps) / baseOps) * PERCENT
    : -Infinity;
  const {threshold, noise} = computeThreshold(baseHistory, headHistory);
  return {
    suite,
    test,
    baseOps,
    headOps,
    deviation,
    threshold,
    noise,
    status: statusOf(deviation, threshold),
  };
}

function testsOf(file: RunFile): [string, string, number[]][] {
  return Object.entries(file).flatMap(([suite, tests]) =>
    Object.entries(tests).map(([test, entry]): [string, string, number[]] => [
      suite,
      test,
      entry.history ?? [],
    ]),
  );
}

/** Compares two run files, benchmark by benchmark, worst first. */
export function compareReports(base: RunFile, head: RunFile): CompareResult {
  const rows: CompareRow[] = [];
  const onlyInBase: string[] = [];
  for (const [suite, test, baseHistory] of testsOf(base)) {
    const headHistory = head[suite]?.[test]?.history ?? [];
    if (headHistory.length === 0) {
      onlyInBase.push(`${suite} › ${test}`);
      continue;
    }
    if (baseHistory.length > 0) {
      rows.push(compareTest(suite, test, baseHistory, headHistory));
    }
  }
  const onlyInHead = testsOf(head)
    .filter(([suite, test]) => !base[suite]?.[test])
    .map(([suite, test]) => `${suite} › ${test}`);
  rows.sort((a, b) => a.deviation - b.deviation);
  return {rows, onlyInBase, onlyInHead};
}

/**
 * Benchmarks slower than half their threshold. Noise rarely moves a benchmark
 * that far, so these are worth a second pass before the verdict.
 */
export function suspectsOf(result: CompareResult): CompareRow[] {
  return result.rows.filter(
    row => row.deviation < -row.threshold * SUSPECT_FRACTION,
  );
}

/**
 * Applies a second pass: a regression stands only if the second pass regresses
 * too. Noise rarely pushes a benchmark past its threshold twice; a real slowdown
 * does it every time. A regression without a second pass stands.
 */
export function confirmRegressions(
  result: CompareResult,
  recheck: CompareResult,
): CompareResult {
  const again = new Map(
    recheck.rows.map(row => [`${row.suite}\n${row.test}`, row]),
  );
  const rows = result.rows.map(row => {
    const second = again.get(`${row.suite}\n${row.test}`);
    if (row.status !== 'REGRESSION' || !second) {
      return row;
    }
    const status: CompareStatus =
      second.status === 'REGRESSION' ? 'REGRESSION' : 'UNCONFIRMED';
    return {...row, status, recheckDeviation: second.deviation};
  });
  return {...result, rows};
}

function formatOps(value: number): string {
  return value >= WHOLE_OPS_FROM
    ? value.toFixed(0)
    : value.toFixed(DECIMAL_PRECISION);
}

function formatPercent(value: number, signed = false): string {
  const sign = signed && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(DECIMAL_PRECISION)}%`;
}

function formatDeviation(row: CompareRow): string {
  const deviation = formatPercent(row.deviation, true);
  return row.recheckDeviation === undefined
    ? deviation
    : `${deviation} (re-check ${formatPercent(row.recheckDeviation, true)})`;
}

const MARKDOWN_HEADER = [
  '| Status | Suite | Test | Base ops/s | Head ops/s | Deviation | Threshold | Noise |',
  '|---|---|---|---:|---:|---:|---:|---:|',
];

/** Escapes `|`, so a title cannot break the table. */
function cell(text: string): string {
  return text.split('|').join(String.raw`\|`);
}

function markdownRow(row: CompareRow): string {
  const noise = row.noise === undefined ? '–' : formatPercent(row.noise);
  return `| ${row.status} | ${cell(row.suite)} | ${cell(row.test)} | ${formatOps(row.baseOps)} | ${formatOps(row.headOps)} | ${formatDeviation(row)} | ±${formatPercent(row.threshold)} | ${noise} |`;
}

function countOf(result: CompareResult, status: CompareStatus): number {
  return result.rows.filter(row => row.status === status).length;
}

/** The comparison as Markdown, for a CI summary or a PR comment. */
export function toMarkdown(result: CompareResult): string {
  const unconfirmed = countOf(result, 'UNCONFIRMED');
  const unconfirmedNote = unconfirmed
    ? `, ${unconfirmed} unconfirmed (did not repeat when run again)`
    : '';
  const missing = result.onlyInBase.length;
  const missingNote = missing ? `, ${missing} missing from head (fails)` : '';
  const lines = [
    `**${countOf(result, 'REGRESSION')} regressions${unconfirmedNote}${missingNote}, ${countOf(result, 'IMPROVEMENT')} improvements, ${countOf(result, 'OK')} within threshold** (${result.rows.length} benchmarks compared)`,
    '',
    ...MARKDOWN_HEADER,
    ...result.rows.filter(row => row.status !== 'OK').map(markdownRow),
    '',
    '<details><summary>All benchmarks</summary>',
    '',
    ...MARKDOWN_HEADER,
    ...result.rows.map(markdownRow),
    '',
    '</details>',
  ];
  for (const [label, tests] of [
    ['Missing from head (fails)', result.onlyInBase],
    ['Only in head', result.onlyInHead],
  ] as const) {
    if (tests.length) {
      lines.push('', `${label}: ${tests.join(', ')}`);
    }
  }
  return lines.join('\n');
}

/** The comparison as plain text: only the rows that are not OK. */
export function toText(result: CompareResult): string {
  const lines = result.rows
    .filter(row => row.status !== 'OK')
    .map(
      row =>
        `${row.status.padEnd(STATUS_WIDTH)} ${formatDeviation(row).padStart(DEVIATION_WIDTH)} (threshold ±${formatPercent(row.threshold)})  ${row.suite} › ${row.test}`,
    );
  lines.push(
    `${countOf(result, 'REGRESSION')} regressions in ${result.rows.length} benchmarks compared`,
  );
  if (result.onlyInBase.length) {
    lines.push(`Missing from head: ${result.onlyInBase.join(', ')}`);
  }
  return lines.join('\n');
}

/**
 * Unlike the recorder, a missing file here is a usage error. Each entry must
 * have a `history` array, so that a wrong file cannot pass as "no change".
 */
function readReport(file: string): RunFile {
  const data = readRunFile(file);
  if (Object.keys(data).length === 0) {
    throw new Error(`"${file}" is missing or holds no runs`);
  }
  for (const [suite, tests] of Object.entries(data)) {
    for (const [test, entry] of Object.entries(tests ?? {})) {
      if (!Array.isArray((entry as {history?: unknown})?.history)) {
        throw new TypeError(
          `"${file}": ${suite} › ${test} has no history array`,
        );
      }
    }
  }
  return data;
}

type CompareArgs = {files: string[]; suspectsOnly: boolean; markdown: boolean};

/** The parsed arguments, or `undefined` for bad usage. */
function parseArgs(args: string[]): CompareArgs | undefined {
  const files = args.filter(arg => !arg.startsWith('--'));
  const unknown = args.some(arg => arg.startsWith('--') && !FLAGS.has(arg));
  const suspectsOnly = args.includes('--suspects');
  const validCount =
    files.length === 2 || (!suspectsOnly && files.length === 4);
  if (!validCount || unknown) return undefined;
  return {files, suspectsOnly, markdown: args.includes('--markdown')};
}

/**
 * A benchmark missing from head may be a crash on head, which must not hide
 * a slowdown. Remove a benchmark on purpose by accepting this failure once.
 */
function exitCodeOf(result: CompareResult): number {
  const regressed = result.rows.some(row => row.status === 'REGRESSION');
  return regressed || result.onlyInBase.length > 0 ? 1 : 0;
}

/**
 * Runs the command. Returns the exit code: 0 for no regression, 1 for a
 * regression or a benchmark missing from head, 2 for bad usage.
 *
 * @throws when a run file cannot be read. The bin script turns that into 2.
 */
export function main(args: string[]): number {
  if (args.includes('--help')) {
    console.info(USAGE);
    return 0;
  }
  const parsed = parseArgs(args);
  if (!parsed) {
    process.stderr.write(`${USAGE}\n`);
    return EXIT_ERROR;
  }
  const [base, head, baseRecheck, headRecheck] = parsed.files.map(readReport);
  let result = compareReports(base, head);
  if (result.rows.length === 0 && result.onlyInBase.length === 0) {
    process.stderr.write('bench-compare: no benchmark to compare\n');
    return EXIT_ERROR;
  }
  if (parsed.suspectsOnly) {
    suspectsOf(result).forEach(row =>
      console.info(`${row.suite}\t${row.test}`),
    );
    return 0;
  }
  if (baseRecheck && headRecheck) {
    result = confirmRegressions(
      result,
      compareReports(baseRecheck, headRecheck),
    );
  }
  console.info(parsed.markdown ? toMarkdown(result) : toText(result));
  return exitCodeOf(result);
}
