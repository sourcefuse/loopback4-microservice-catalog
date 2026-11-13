// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import {
  dirname,
  join,
  matchesGlob,
  posix,
  relative,
  resolve,
  sep,
} from 'node:path';
import Mocha from 'mocha';
import {describeError} from '../describe-error';
import {takeLinks} from '../functions/bench-links.function';

/** Bad usage, a stale link, or a file that does not load. */
const EXIT_ERROR = 2;
const TESTS_DIR = 'src/__tests__';
/** Spec files of other test types. A change to one cannot affect a benchmark. */
const OTHER_SPEC = /\.(unit|acceptance|integration)\.ts$/;
const SKIPPED_DIRS = new Set(['node_modules', 'dist', 'coverage', '.git']);

const USAGE = `Usage: bench-select --changed <file> [--root <dir>] [--all <glob>]... <built benchmark files>

Run it in the package directory. It prints the subset of the given built
benchmark files (dist/**/*.js) that a change can affect, one per line, and
the reason for each on stderr. <file> lists the changed paths relative to the
repository root, one per line, as "git diff --name-only --no-renames" prints
them. --root is the repository root; by default it is the nearest directory,
from here upward, whose package.json has "workspaces", or else this one.

It loads each file through Mocha, without running a test, and reads its
bench.links(...) call. A file runs when its source file changed, when a
changed path matches one of its links, or when it has no bench.links call.
Every file runs when a changed path is a package file outside src, a test
helper, a file in the repository root, a file of a workspace package that
this package depends on, or a match for an --all glob. Markdown files and
spec files of other test types are ignored.

Exits 2 when a link matches no file in the package, when a file does not
load, or when the source of a built file is missing.`;

export type BenchFile = {
  /** The path as given on the command line. */
  path: string;
  /** Its source, relative to the package, for example src/__tests__/x.benchmark.ts. */
  source: string;
  /** Globs from its bench.links call; undefined when it has none. */
  links?: string[];
};

export type SelectInput = {
  /** The package path relative to the repository root, for example services/x. */
  packagePath: string;
  files: BenchFile[];
  /** Changed paths relative to the repository root. */
  changed: string[];
  /** Repository-relative paths of the workspace packages this one depends on. */
  dependencyPaths: string[];
  /** Globs of repository-relative paths that run every file. */
  allGlobs: string[];
};

/** The selected files, by path, with the reason for each. */
export type Selection = Map<string, string>;

function isUnder(path: string, dir: string): boolean {
  return dir === '' || path.startsWith(`${dir}/`);
}

/** Why a changed path runs every file, if it does. */
function runAllReason(file: string, input: SelectInput): string | undefined {
  const glob = input.allGlobs.find(pattern => matchesGlob(file, pattern));
  if (glob) return `${file} matches --all ${glob}`;
  if (file.endsWith('.md')) return undefined;
  if (isUnder(file, input.packagePath)) {
    const path = posix.relative(input.packagePath, file);
    if (input.files.some(bench => bench.source === path)) return undefined;
    if (isUnder(path, TESTS_DIR)) {
      return OTHER_SPEC.test(path) ? undefined : `test helper ${file} changed`;
    }
    return isUnder(path, 'src') ? undefined : `package file ${file} changed`;
  }
  const dependency = input.dependencyPaths.find(dir => isUnder(file, dir));
  if (dependency) return `dependency ${dependency} changed (${file})`;
  return file.includes('/') ? undefined : `root file ${file} changed`;
}

function ownReason(bench: BenchFile, changed: string[]): string | undefined {
  if (!bench.links) return 'no bench.links call, always runs';
  if (changed.includes(bench.source)) return 'the benchmark file changed';
  for (const file of changed) {
    const link = bench.links.find(pattern => matchesGlob(file, pattern));
    if (link) return `${file} matches ${link}`;
  }
  return undefined;
}

/** Picks the files that a change can affect. */
export function selectFiles(input: SelectInput): Selection {
  const selection: Selection = new Map();
  const allReason = input.changed
    .map(file => runAllReason(file, input))
    .find(reason => reason !== undefined);
  const ownChanges = input.changed
    .filter(file => isUnder(file, input.packagePath))
    .map(file => posix.relative(input.packagePath, file));
  for (const bench of input.files) {
    const reason = allReason ?? ownReason(bench, ownChanges);
    if (reason) selection.set(bench.path, reason);
  }
  return selection;
}

/** Links that match no file of the package, as "source: glob" lines. */
export function staleLinks(
  files: BenchFile[],
  packageFiles: string[],
): string[] {
  return files.flatMap(bench =>
    (bench.links ?? [])
      .filter(link => !packageFiles.some(file => matchesGlob(file, link)))
      .map(link => `${bench.source}: ${link}`),
  );
}

function toPosix(path: string): string {
  return path.split(sep).join('/');
}

function listFiles(root: string, dir = root): string[] {
  return readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    if (SKIPPED_DIRS.has(entry.name)) return [];
    const path = join(dir, entry.name);
    return entry.isDirectory()
      ? listFiles(root, path)
      : [toPosix(relative(root, path))];
  });
}

type Manifest = {
  name?: string;
  workspaces?: string[] | {packages?: string[]};
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

function readManifest(dir: string): Manifest | undefined {
  const file = join(dir, 'package.json');
  return existsSync(file)
    ? (JSON.parse(readFileSync(file, 'utf-8')) as Manifest)
    : undefined;
}

function workspaceGlobs(manifest: Manifest | undefined): string[] | undefined {
  const workspaces = manifest?.workspaces;
  return Array.isArray(workspaces) ? workspaces : workspaces?.packages;
}

function findRoot(start: string): string {
  for (let dir = start; ; dir = dirname(dir)) {
    if (workspaceGlobs(readManifest(dir))) return dir;
    if (dirname(dir) === dir) return start;
  }
}

/** Workspace directories, repository-relative, from `dir/*` and plain entries. */
function workspaceDirs(root: string): string[] {
  return (workspaceGlobs(readManifest(root)) ?? []).flatMap(glob => {
    const entry = glob.replace(/\/+$/, '');
    if (!entry.endsWith('/*')) return [entry];
    const parent = entry.slice(0, -2);
    return existsSync(join(root, parent))
      ? readdirSync(join(root, parent)).map(name => `${parent}/${name}`)
      : [];
  });
}

/** Repository-relative paths of the workspace packages a package depends on, transitively. */
export function dependencyPaths(root: string, packagePath: string): string[] {
  const byName = new Map<string, {path: string; dependencies: string[]}>();
  let own: string[] = [];
  for (const path of workspaceDirs(root)) {
    const manifest = readManifest(join(root, path));
    if (!manifest?.name) continue;
    const dependencies = [
      manifest.dependencies,
      manifest.devDependencies,
      manifest.peerDependencies,
    ].flatMap(field => Object.keys(field ?? {}));
    byName.set(manifest.name, {path, dependencies});
    if (path === packagePath) own = dependencies;
  }
  const seen = new Set<string>();
  const pending = [...own];
  while (pending.length) {
    const workspace = byName.get(pending.pop()!);
    if (!workspace || seen.has(workspace.path)) continue;
    seen.add(workspace.path);
    pending.push(...workspace.dependencies);
  }
  return [...seen].sort();
}

/** The source of a built file, by the dist to src rule of `lb-tsc`. */
function sourceOf(packageDir: string, path: string): string {
  const built = toPosix(relative(packageDir, resolve(path)));
  if (!built.startsWith('dist/') || !built.endsWith('.js')) {
    throw new Error(`"${path}" is not a built file under dist/`);
  }
  const source = built.replace(/^dist\//, 'src/').replace(/\.js$/, '.ts');
  if (!existsSync(join(packageDir, source))) {
    throw new Error(`the source of "${path}" (${source}) does not exist`);
  }
  return source;
}

/**
 * Loads the files through Mocha, which defines `describe` and `it` without
 * running any test, and collects the links of each file.
 */
async function readLinks(paths: string[]): Promise<Map<string, string[]>> {
  const mocha = new Mocha();
  const links = new Map<string, string[]>();
  const absolute = new Map(paths.map(path => [resolve(path), path]));
  mocha.suite.on(Mocha.Suite.constants.EVENT_FILE_PRE_REQUIRE, () =>
    takeLinks(),
  );
  mocha.suite.on(
    Mocha.Suite.constants.EVENT_FILE_POST_REQUIRE,
    (_context: unknown, file: string) => {
      const found = takeLinks();
      if (found.length) links.set(absolute.get(file) ?? file, found);
    },
  );
  absolute.forEach((_path, file) => mocha.addFile(file));
  await mocha.loadFilesAsync();
  return links;
}

type Args = {changed?: string; root?: string; all: string[]; files: string[]};

function parseArgs(args: string[]): Args | undefined {
  const parsed: Args = {all: [], files: []};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--changed' || arg === '--root' || arg === '--all') {
      const value = args[++i];
      if (value === undefined) return undefined;
      if (arg === '--all') parsed.all.push(value);
      else parsed[arg === '--changed' ? 'changed' : 'root'] = value;
    } else if (arg.startsWith('--')) {
      return undefined;
    } else {
      parsed.files.push(arg);
    }
  }
  return parsed.changed ? parsed : undefined;
}

function fail(message: string): number {
  process.stderr.write(`bench-select: ${message}\n`);
  return EXIT_ERROR;
}

/**
 * Runs the command and returns the exit code. The bin script ends the process
 * after it, because a loaded file can leave a handle open.
 */
export async function main(args: string[]): Promise<number> {
  const parsed = parseArgs(args);
  if (!parsed) {
    process.stderr.write(`${USAGE}\n`);
    return EXIT_ERROR;
  }
  const packageDir = process.cwd();
  const root = resolve(parsed.root ?? findRoot(packageDir));
  const packagePath = toPosix(relative(root, packageDir));
  let files: BenchFile[];
  try {
    const links = await readLinks(parsed.files);
    files = parsed.files.map(path => ({
      path,
      source: sourceOf(packageDir, path),
      links: links.get(path),
    }));
  } catch (error) {
    return fail(describeError(error));
  }
  const stale = staleLinks(files, listFiles(packageDir));
  if (stale.length) {
    return fail(
      `links that match no file in ${packagePath || '.'}:\n  ${stale.join('\n  ')}`,
    );
  }
  const changed = readFileSync(parsed.changed!, 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
  const selection = selectFiles({
    packagePath,
    files,
    changed,
    dependencyPaths: dependencyPaths(root, packagePath),
    allGlobs: parsed.all,
  });
  for (const [path, reason] of selection) {
    console.info(path);
    process.stderr.write(`  ${path}: ${reason}\n`);
  }
  process.stderr.write(
    `bench-select: ${selection.size} of ${files.length} files selected\n`,
  );
  return 0;
}
