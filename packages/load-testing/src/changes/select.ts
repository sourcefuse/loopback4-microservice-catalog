// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import path from 'node:path';
import {ConfigError} from '../errors';
import {OUT_DIR, SCENARIO_SUFFIX, SCENARIOS_DIR} from '../project/layout';
import type {LoadedScenario} from '../project/types';
import {labelOf} from '../scenario/label';
import type {Changes} from './git';

/** The lockfiles of the root that make every scenario run. */
const LOCKFILES = new Set([
  'package-lock.json',
  'npm-shrinkwrap.json',
  'yarn.lock',
  'pnpm-lock.yaml',
]);

export type SelectionState = 'selected' | 'not selected' | 'skipped';

/** One scenario in the selection report. */
export type SelectionEntry = {
  scenario: string;
  state: SelectionState;
  /** Why the scenario is selected. Not set for the other states. */
  reason?: string;
};

/** What a run with `--since` selected. It is the content of `selection.json`. */
export type ChangeSelection = {
  ref: string;
  mergeBase: string;
  head: string;
  /** The changed files, relative to the workspace root. */
  changedFiles: string[];
  scenarios: SelectionEntry[];
  /**
   * Changed files in the folder of the package that no scenario covers and
   * no trigger names. A scenario may need a new `covers` pattern.
   */
  uncoveredFiles: string[];
  nothingSelected: boolean;
};

// A path with glob characters, such as `routes/[id]/page.ts`, must still match itself.
const matches = (file: string, pattern: string) =>
  file === pattern || path.matchesGlob(file, pattern);

/** The package-relative folder as a prefix of root-relative paths, with a final `/`. */
const prefixOf = (pkgPath: string) => (pkgPath === '' ? '' : `${pkgPath}/`);

/**
 * The changed files that make every scenario of the package run, each with
 * the trigger that it matched. The triggers are fixed (the files of the
 * load folder that are not scenario files, the package.json of the package,
 * the package.json and the lockfiles of the root) and `runAllWhen`.
 */
function runAllTriggers(
  files: string[],
  pkgPath: string,
  runAllWhen: string[],
): Array<{file: string; trigger: string}> {
  const prefix = prefixOf(pkgPath);
  const loadDir = `${prefix}${SCENARIOS_DIR.split(path.sep).join('/')}/`;
  const outDir = `${prefix}${OUT_DIR.split(path.sep).join('/')}/`;
  const fixed = (file: string): string | undefined => {
    if (file.startsWith(loadDir)) {
      return file.endsWith(SCENARIO_SUFFIX) || file.startsWith(outDir)
        ? undefined
        : 'a file of the load folder that is not a scenario file';
    }
    if (file === `${prefix}package.json`) return 'package.json of the package';
    if (file === 'package.json' || LOCKFILES.has(file)) {
      return 'package.json or lockfile of the root';
    }
    return undefined;
  };
  return files.flatMap(file => {
    const pattern = runAllWhen.find(p => matches(file, p));
    const trigger =
      fixed(file) ??
      (pattern === undefined ? undefined : `runAllWhen ${pattern}`);
    return trigger ? [{file, trigger}] : [];
  });
}

/** Throws a `ConfigError` that lists the scenarios that `--since` cannot judge. */
function checkCovers(items: LoadedScenario[], tracked: string[]): void {
  // Each pattern is looked up once, however many scenarios use it.
  const found = new Map<string, boolean>();
  const exists = (pattern: string): boolean => {
    let hit = found.get(pattern);
    if (hit === undefined) {
      hit = tracked.some(f => matches(f, pattern));
      found.set(pattern, hit);
    }
    return hit;
  };
  const problems = items.flatMap(({scenario}) => {
    const label = labelOf(scenario);
    if (!scenario.covers?.length) return [`${label}: has no covers`];
    return scenario.covers
      .filter(pattern => !exists(pattern))
      .map(pattern => `${label}: covers "${pattern}" matches no file`);
  });
  if (problems.length > 0) {
    throw new ConfigError(
      '--since needs covers on every scenario, and each pattern must match a file:',
      problems,
    );
  }
}

/**
 * Splits the scenarios that run (`picked`) into those that the changes select
 * and those that they do not. A scenario is selected when a changed file
 * matches one of its `covers` patterns, when its own scenario file changed,
 * or when a run-all trigger matched. It throws a `ConfigError` for a
 * scenario with no `covers`, or a pattern that matches no file. The
 * `skipped` scenarios only appear in the report.
 */
export function selectByChanges(
  {picked, skipped}: {picked: LoadedScenario[]; skipped: LoadedScenario[]},
  changes: Changes,
  pkgDir: string,
  runAllWhen: string[],
): {selected: LoadedScenario[]; selection: ChangeSelection} {
  checkCovers(picked, changes.tracked);
  const {files, pkgPath} = changes;
  const prefix = prefixOf(pkgPath);
  const changed = new Set(files);
  const triggers = runAllTriggers(files, pkgPath, runAllWhen);
  const [all] = triggers;
  const used = new Set<string>(triggers.map(({file}) => file));
  const sourceOf = (source: string) =>
    path.posix.join(
      prefix,
      path.relative(pkgDir, source).split(path.sep).join('/'),
    );
  // A changed file of a skipped scenario is not a missing `covers`.
  skipped.forEach(({source}) => used.add(sourceOf(source)));
  const reasons = picked.map(({scenario, source}) => {
    const sourceFile = sourceOf(source);
    const covered = (scenario.covers ?? []).flatMap(pattern =>
      files
        .filter(file => matches(file, pattern))
        .map(file => ({file, pattern})),
    );
    covered.forEach(({file}) => used.add(file));
    const changedSource = changed.has(sourceFile);
    if (changedSource) used.add(sourceFile);
    if (all) return `run all: ${all.file} matched ${all.trigger}`;
    const [first] = covered;
    if (first) return `covers: ${first.file} matched ${first.pattern}`;
    return changedSource ? `scenario file changed: ${sourceFile}` : undefined;
  });
  const selected = picked.filter((_, i) => reasons[i]);
  return {
    selected,
    selection: {
      ref: changes.ref,
      mergeBase: changes.mergeBase,
      head: changes.head,
      changedFiles: files,
      scenarios: [
        ...picked.map(({scenario}, i): SelectionEntry => ({
          scenario: labelOf(scenario),
          state: reasons[i] ? 'selected' : 'not selected',
          ...(reasons[i] && {reason: reasons[i]}),
        })),
        ...skipped.map(({scenario}): SelectionEntry => ({
          scenario: labelOf(scenario),
          state: 'skipped',
        })),
      ],
      uncoveredFiles: files.filter(
        file => file.startsWith(prefix) && !used.has(file),
      ),
      nothingSelected: selected.length === 0,
    },
  };
}
