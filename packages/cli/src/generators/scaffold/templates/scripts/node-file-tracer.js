#!/usr/bin/env node
/**
 * Runtime-dependency tracer built on @vercel/nft. Traces the real
 * require()/import graph of the given entry files/directories and prints
 * the resulting file list (one per line, relative to cwd) to stdout. Used
 * by Dockerfiles to copy only the files actually needed at runtime instead
 * of `npm prune` + `clean-modules` deleting everything else out of a full
 * node_modules tree.
 *
 * Three things a project's dependency graph can hide from static tracing:
 *
 * 1. Convention-based file discovery in the app's own code (e.g. LoopBack's
 *    @loopback/boot scanning a directory for controllers/repositories/models
 *    at runtime via fs.readdir + dynamic require, not static imports).
 *    Passing a directory as an entry (rather than a single file) traces
 *    every file under it as its own entry, so each file's own require()s
 *    are still resolved statically even if nothing else in the graph
 *    reaches it.
 *
 * 1b. The same convention-based discovery, but inside a node_modules
 *    package (e.g. @sourceloop/authentication-service registers its own
 *    LoopBack component whose booter globs that package's own
 *    dist/controllers at runtime). The app never lists those controller
 *    files as an entry, so unlike 1 there's nothing to point the tracer
 *    at, and nothing in the require() graph reaches them either — a
 *    clean boot with routes silently missing (404 instead of a crash) is
 *    the symptom. Fixed via `nft.traceGlobs`: for any already-traced
 *    node_modules package whose name matches `packages`, every file under
 *    it matching `files` is also traced as an entry, repeated to a
 *    fixpoint — see the example rule below. Only applies to real
 *    node_modules packages — a workspace's own code is covered by 1
 *    instead, since npm workspace symlinks are realpathed away by the
 *    time NFT reports a file. Over-matching a package without a booter is
 *    harmless (dead files, or already traced); under-matching reproduces
 *    the silent 404s, so a new booter-based dependency needs its own rule.
 *
 * 2. Modules resolved by a dynamic string at runtime (e.g. LoopBack
 *    datasources: `connector: 'postgresql'` -> `loopback-connector-postgresql`)
 *    are invisible to static tracing — there's no static require() for NFT
 *    to follow. List them via `nft.alwaysCopy` in the package.json of
 *    whichever workspace needs them; each entry must be a real dependency
 *    of that workspace (checked at trace time, not just resolvable via
 *    hoisting) and is traced from its own entrypoint like any other module.
 *
 * 3. Assets served from a resolved directory at runtime (e.g. swagger-ui's
 *    static HTML/CSS/fonts, served via `path.resolve(__dirname)`) can't be
 *    traced at all — there's no require() graph inside a stylesheet. List
 *    the directory via `nft.copyDirs`; every file under it is copied
 *    as-is, unfiltered. Root package.json can declare `copyDirs`/`alwaysCopy`/
 *    `traceGlobs` for anything every workspace needs; workspace and root
 *    lists merge.
 */

// Usage:
//   node node-file-tracer.js <file-or-dir> [<file-or-dir> ...]
//                       [--workspace <dir-containing-package.json>]...
//
// package.json "nft" shape (all fields optional, root + workspace merge):
//   {
//     "alwaysCopy": ["loopback-connector-postgresql"],
//     "copyDirs": ["node_modules/swagger-ui-dist"],
//     "traceGlobs": [
//       { "packages": "@sourceloop/*", "files": "dist/**/*.controller.js" }
//     ]
//   }

const { nodeFileTrace } = require("@vercel/nft");
const fs = require("node:fs");
const path = require("node:path");

function readPkg(dir, base) {
  const pkgPath = path.join(base, dir, "package.json");
  if (!fs.existsSync(pkgPath)) return {};
  return JSON.parse(fs.readFileSync(pkgPath, "utf8"));
}

function parseArgs(argv) {
  const entries = [];
  const workspaces = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--workspace") {
      const workspace = argv[++i];
      if (!workspace || workspace.startsWith("--")) {
        throw new Error("--workspace requires a value");
      }
      workspaces.push(workspace);
    } else entries.push(arg);
  }
  return { entries, workspaces };
}

function listFiles(entry, base) {
  const abs = path.resolve(entry);
  const stat = fs.statSync(abs);
  if (stat.isFile()) return [path.relative(base, abs)];
  const out = [];
  for (const d of fs.readdirSync(abs, { withFileTypes: true })) {
    const full = path.join(abs, d.name);
    if (d.isDirectory()) out.push(...listFiles(full, base));
    else if (/\.[mc]?js$/.test(d.name)) out.push(path.relative(base, full));
  }
  return out;
}

function listAllFiles(entry, base) {
  const abs = path.resolve(entry);
  const out = [];
  for (const d of fs.readdirSync(abs, { withFileTypes: true })) {
    const full = path.join(abs, d.name);
    if (d.isDirectory()) out.push(...listAllFiles(full, base));
    else out.push(path.relative(base, full));
  }
  return out;
}

/**
 * alwaysCopy names must be declared dependencies of the workspace requesting
 * them — resolving purely by name would also succeed via npm hoisting from
 * an unrelated sibling workspace, silently breaking the moment that sibling
 * stops depending on it.
 */
function resolveAlwaysCopy(names, dir, base, pkg) {
  const declared = pkg.dependencies || {};
  return names.map((name) => {
    if (!declared[name]) {
      throw new Error(
        `nft.alwaysCopy: "${name}" is not a dependency of ${dir || "."}`,
      );
    }
    return require.resolve(name, { paths: [path.join(base, dir)] });
  });
}

function resolveCopyDirs(dirs, dir, base) {
  return dirs.flatMap((d) => {
    const abs = path.join(base, dir, d);
    if (!fs.existsSync(abs)) {
      throw new Error(`nft.copyDirs: "${d}" does not exist in ${dir || "."}`);
    }
    return listAllFiles(abs, base);
  });
}

/**
 * Rightmost node_modules segment, so nested (non-hoisted) packages resolve
 * to their own package root rather than an ancestor's, and a workspace
 * prefix (e.g. `services/x/node_modules/...`) stays part of the root
 * instead of being discarded. The prefix group must be greedy-optional
 * (`(.*\/)?`), not a `^|...` alternation — the latter's `^` branch always
 * wins at index 0, so it locks onto the first node_modules and silently
 * misattributes a nested package to its parent.
 *
 * @returns {{root: string, name: string}|null}
 */
function packageRootOf(relFile) {
  const m = relFile.match(/^(.*\/)?(node_modules\/(?:@[^/]+\/[^/]+|[^/]+))\//);
  if (!m) return null;
  return {
    root: (m[1] || "") + m[2],
    name: m[2].slice("node_modules/".length),
  };
}

/**
 * Each node_modules package reachable from the traced closure is checked
 * against the traceGlobs rules at most once across fixpoint iterations:
 * the check globs disk, not the traced set, so a repeat look can never
 * yield anything new. That, plus the finite number of packages on disk,
 * is what guarantees traceToFixpoint terminates.
 */
function findTraceGlobEntries(traced, rules, base, checkedPackages) {
  const packages = new Map();
  for (const f of traced) {
    const pkg = packageRootOf(f);
    if (pkg && !checkedPackages.has(pkg.root)) packages.set(pkg.root, pkg.name);
  }

  const newEntries = [];
  for (const [root, name] of packages) {
    checkedPackages.add(root);
    for (const rule of rules.filter((r) =>
      path.matchesGlob(name, r.packages),
    )) {
      for (const rel of fs.globSync(rule.files, {
        cwd: path.join(base, root),
      })) {
        const relFile = path.join(root, rel);
        if (!traced.has(relFile)) newEntries.push(path.join(base, relFile));
      }
    }
  }
  return newEntries;
}

async function traceToFixpoint(initialEntries, rules, base) {
  const checkedPackages = new Set();
  const cache = {};
  // nft raises parse warnings inside analyze(), which the shared cache
  // skips once a file's been analysed — so a later pass's `warnings` no
  // longer includes earlier passes' parse failures. Accumulated here,
  // keyed by message since resolve-failure warnings are re-raised as new
  // Error objects (and would otherwise duplicate) on every pass.
  const allWarnings = new Map();
  let entries = initialEntries;

  for (;;) {
    const { fileList, esmFileList, warnings } = await nodeFileTrace(entries, {
      base,
      cache,
    });
    for (const w of warnings) allWarnings.set(w.message, w);
    const traced = new Set([...fileList, ...esmFileList]);
    const newEntries = findTraceGlobEntries(
      traced,
      rules,
      base,
      checkedPackages,
    );
    if (!newEntries.length)
      return { traced, warnings: [...allWarnings.values()] };
    entries = [...entries, ...newEntries];
  }
}

async function main() {
  const { entries: rawEntries, workspaces } = parseArgs(process.argv.slice(2));
  if (!rawEntries.length) {
    console.error(
      "Usage: node-file-tracer.js <file-or-dir> [...] [--workspace <dir>]...",
    );
    process.exit(1);
  }

  const base = process.cwd();
  const scopes = [".", ...workspaces];
  const entries = rawEntries.flatMap((e) => listFiles(e, base));

  const alwaysCopy = scopes.flatMap((dir) => {
    const pkg = readPkg(dir, base);
    return resolveAlwaysCopy(pkg.nft?.alwaysCopy || [], dir, base, pkg);
  });

  const copyDirs = scopes.flatMap((dir) =>
    resolveCopyDirs(readPkg(dir, base).nft?.copyDirs || [], dir, base),
  );

  const traceGlobs = scopes.flatMap(
    (dir) => readPkg(dir, base).nft?.traceGlobs || [],
  );

  const { traced, warnings } = await traceToFixpoint(
    [...entries, ...alwaysCopy],
    traceGlobs,
    base,
  );
  const all = new Set([...traced, ...copyDirs]);

  for (const f of [...all].sort((a, b) => a.localeCompare(b)))
    process.stdout.write(f + "\n");
  for (const w of warnings) process.stderr.write("WARN: " + w.message + "\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
