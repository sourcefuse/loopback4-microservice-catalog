// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {ConfigError, errorMessage} from '../errors';

/** What a change-based run knows about the git history. */
export type Changes = {
  /** The folder that the patterns of `covers` and `runAllWhen` are relative to. */
  root: string;
  /** The package folder, relative to `root`, with `/` as the separator. */
  pkgPath: string;
  /** The ref that the user passed. */
  ref: string;
  mergeBase: string;
  head: string;
  /** Changed files, relative to `root`, with `/` as the separator. */
  files: string[];
  /** Every file of HEAD under `root`, relative to `root`. */
  tracked: string[];
};

/** The list of every file of a big monorepo is large, so the default buffer is too small. */
const GIT_MAX_BUFFER_BYTES = 256 * 1024 * 1024;

/** The variable that holds the absolute path of the git program. */
export const GIT_ENV = 'LOAD_TESTS_GIT';

/** Without the variable, the program is the `git` of the PATH. */
function gitProgram(): string {
  const configured = process.env[GIT_ENV];
  if (configured === undefined || configured === '') {
    return 'git'; // NOSONAR: the default is the git of the CI machine, and GIT_ENV sets a fixed path.
  }
  if (!path.isAbsolute(configured)) {
    throw new ConfigError(`${GIT_ENV} must be an absolute path: ${configured}`);
  }
  return configured;
}

function git(cwd: string, args: string[]): string {
  const program = gitProgram();
  try {
    return execFileSync(program, args, {
      cwd,
      encoding: 'utf8',
      maxBuffer: GIT_MAX_BUFFER_BYTES,
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trimEnd();
  } catch (err) {
    const {stderr} = err as {stderr?: Buffer | string};
    throw new ConfigError(
      `git ${args.join(' ')} failed: ${String(stderr ?? err).trim()}`,
    );
  }
}

/**
 * The nearest folder above `pkgDir`, up to `gitRoot`, whose package.json has
 * `workspaces`. When there is none, `gitRoot`.
 */
function workspaceRoot(pkgDir: string, gitRoot: string): string {
  const rel = path.relative(gitRoot, pkgDir);
  // Walk up from the parent of the package to the git root.
  for (let depth = rel.split(path.sep).length - 1; depth >= 0; depth--) {
    const dir = path.join(gitRoot, ...rel.split(path.sep).slice(0, depth));
    const file = path.join(dir, 'package.json');
    if (!fs.existsSync(file)) continue;
    let workspaces: unknown;
    try {
      ({workspaces} = JSON.parse(fs.readFileSync(file, 'utf8')) as {
        workspaces?: unknown;
      });
    } catch {
      throw new ConfigError(`${file} is not valid JSON`);
    }
    if (workspaces !== undefined) return dir;
  }
  return gitRoot;
}

/** Turns paths that git gives from the git root into paths from `root`. Drops those outside it. */
function relativeTo(root: string, gitRoot: string, paths: string[]): string[] {
  return paths
    .map(file => path.relative(root, path.join(gitRoot, file)))
    .filter(
      file => file !== '' && file !== '..' && !file.startsWith(`..${path.sep}`),
    )
    .map(file => file.split(path.sep).join('/'));
}

const pathsOf = (text: string) => text.split('\0').filter(file => file !== '');

/**
 * Finds the files that changed from the merge-base of `ref` and HEAD to HEAD.
 * Only commits count. A rename gives both paths. A ref that git cannot
 * resolve, for example in a shallow clone, is a `ConfigError`.
 */
export function changesSince(pkgDir: string, ref: string): Changes {
  if (ref.startsWith('-')) {
    throw new ConfigError(`--since ${ref}: a ref must not start with "-"`);
  }
  const dir = fs.realpathSync(pkgDir);
  const gitRoot = fs.realpathSync(git(dir, ['rev-parse', '--show-toplevel']));
  const root = workspaceRoot(dir, gitRoot);
  const head = git(dir, ['rev-parse', 'HEAD']);
  let mergeBase: string;
  try {
    mergeBase = git(dir, ['merge-base', ref, 'HEAD']);
  } catch (cause) {
    throw new ConfigError(
      `--since ${ref}: git found no common commit of ${ref} and HEAD (${errorMessage(cause)}). Check the ref. In a shallow clone, fetch more history first.`,
      [],
      {cause},
    );
  }
  const changed = git(dir, [
    'diff',
    '--name-only',
    '--no-renames',
    '-z',
    mergeBase,
    head,
  ]);
  const tracked = git(dir, [
    'ls-tree',
    '-r',
    '--full-tree',
    '--name-only',
    '-z',
    head,
  ]);
  return {
    root,
    pkgPath: path.relative(root, dir).split(path.sep).join('/'),
    ref,
    mergeBase,
    head,
    files: relativeTo(root, gitRoot, pathsOf(changed)),
    tracked: relativeTo(root, gitRoot, pathsOf(tracked)),
  };
}
