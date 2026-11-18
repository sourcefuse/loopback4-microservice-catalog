// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import fs from 'node:fs';
import path from 'node:path';
import {OUT_DIR, SELECTION_SLUG} from '../project/layout';
import {print} from '../output';
import type {ChangeSelection} from './select';

/** The file in `.out` that holds the selection. Its format is stable: see the README. */
const SELECTION_FILE = path.join(OUT_DIR, `${SELECTION_SLUG}.json`);

const SHORT_SHA = 7;

/** Prints which scenarios `--since` selected, and why. */
export function printSelection(selection: ChangeSelection): void {
  const {scenarios, uncoveredFiles} = selection;
  const picked = scenarios.filter(({state}) => state === 'selected');
  const total = scenarios.filter(({state}) => state !== 'skipped').length;
  print(
    `\nChange detection: --since ${selection.ref} (merge-base ${selection.mergeBase.slice(0, SHORT_SHA)}, HEAD ${selection.head.slice(0, SHORT_SHA)}), ${selection.changedFiles.length} files changed`,
  );
  print(`Selected ${picked.length} of ${total} scenarios`);
  for (const {scenario, state, reason} of scenarios) {
    print(`  ${state}: ${scenario}${reason ? ` (${reason})` : ''}`);
  }
  if (uncoveredFiles.length > 0) {
    print(
      'Warning: these changed files are in the package, and no scenario covers them. A scenario may need a new covers pattern:',
    );
    for (const file of uncoveredFiles) print(`  ${file}`);
  }
  if (selection.nothingSelected)
    print('No scenario is selected, so nothing runs.');
}

/** Removes the `selection.json` of an earlier run, so that no one reads old data. */
export function clearSelection(pkgDir: string): void {
  fs.rmSync(path.join(pkgDir, SELECTION_FILE), {force: true});
}

/** Writes `selection` to `.out/selection.json` of the package. */
export function writeSelection(
  pkgDir: string,
  selection: ChangeSelection,
): void {
  const file = path.join(pkgDir, SELECTION_FILE);
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, `${JSON.stringify(selection, null, 2)}\n`);
}
