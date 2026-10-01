# Docker builds for ARC monorepos

This page explains how a monorepo made with `sl scaffold` and `sl microservice` builds its Docker images. It also explains how the pipeline picks a build mode. There are three modes:

| Mode | File | When the pipeline uses it | Details |
| --- | --- | --- | --- |
| Code build | `Dockerfile.code` | The service changed, but no full-build trigger fired | [Code builds](#code-builds) |
| Traced full build | `Dockerfile.nft` | A full-build trigger fired and `USE_NFT_BUILD` is on (default) | [Traced full builds](#traced-nft-full-builds) |
| Legacy full build | `Dockerfile` | A full-build trigger fired and `USE_NFT_BUILD` is off | [Legacy full builds](#legacy-full-builds) |

Most builds are code builds. A full build is only necessary when the set of installed files can change.

## Files

The scaffold writes these files at the repo root:

```text
Dockerfile.deps                      shared deps image for traced builds, never pushed
scripts/node-file-tracer.js          runtime dependency tracer (@vercel/nft)
scripts/get-full-build-packages.sh   decides which packages need a full build
.dockerignore                        build context is the repo root
JenkinsFile                          only with --jenkinsfile
```

The microservice generator writes these files in each service or facade:

```text
Dockerfile        legacy full build
Dockerfile.nft    traced full build
Dockerfile.code   code build
package.json      docker:build:full, docker:build:nft, docker:build:code,
                  docker:push, docker:tag, docker:retag, helm-update, nft
```

All three Dockerfiles take `SERVICE_NAME` and `FROM_FOLDER` as build args, and the build context is always the repo root. They also make the same runtime layout, which is the repo layout: the root `node_modules` is at `/home/node/app/node_modules`, the service is at `/home/node/app/<services|facades>/<name>` with its own nested `node_modules`, local packages are at `/home/node/app/packages`, and `WORKDIR` is the service folder. Keep it that way. npm nests a package in the service's `node_modules` only when its version conflicts with the hoisted one. If we merge the nested folder into the root one, every package gets the service's version. A code build puts `dist` on top of whichever full build came last. If the layouts drift apart, a code build writes files to the wrong place.

Images built before this layout have `dist` at `/home/node/app`. The first build after an upgrade must be a full build of every package (`BUILD_ALL_PACKAGES=true`).

## How the pipeline picks a mode

The `Detect-changes` stage runs `scripts/get-full-build-packages.sh <last commit>`. The script prints the services and facades that need a full build. Every other changed package gets a code build.

A package needs a full build when one of these is true:

| Trigger | Scope |
| --- | --- |
| No last commit, or git does not know it (first build, force-push) | All packages |
| `patches/**`, `Dockerfile.deps` or `scripts/node-file-tracer.js` changed | All packages |
| The `nft` block of the root `package.json` changed | All packages |
| `package-lock.json` changed and no workspace `package.json` changed | All packages |
| The package's `Dockerfile` or `Dockerfile.nft` changed | That package |
| The package's `dependencies`, `devDependencies` or `nft` changed | That package |
| The `dependencies` or `devDependencies` of an `@local/*` package it uses changed | That package |
| Its `src/` imports a bare specifier that it did not import before, e.g. a declared but unused dependency or `lodash/fp` | That package |
| An `@local/*` package it uses has such a new import | That package |

This table matches the header comment of `get-full-build-packages.sh`. Change both together.

A version bump, a script change, a source change or a change to `Dockerfile.code` does not trigger a full build. None of them changes `node_modules`.

The new-import rule exists because a traced image only has the files that the old `dist` loaded. A code build copies only the new `dist`. If that `dist` loads a module that the old one did not, the container fails at boot with `Cannot find module`. The script compares the bare `import`, `export … from`, `require()` and `import()` specifiers in `src/` between the last commit and HEAD. Node built-ins (`fs`, `node:path`, `fs/promises`) do not count. The check has limits:

- `import type` lines and specifiers in comments can cause a full build that is not necessary. That is safe, only slower.
- A computed specifier such as `require(name)` is not found. The tracer cannot follow it either, so it must be in `nft.alwaysCopy`, which a full build then picks up.

The lockfile rule has a gap. With npm workspaces, the root lockfile changes each time a workspace adds a dependency. The script cannot tell whether a workspace change or a transitive update changed the lockfile, so it only treats the lockfile as a trigger when no workspace `package.json` changed. If a transitive security fix and a direct dependency change land in the same build window, only the package whose `package.json` changed gets the fix. We decide that case ourselves: keep those changes in separate builds, or run the pipeline one time with `BUILD_ALL_PACKAGES=true`.

When the script marks every image, the `Detect-changes` stage sets `BUILD_ALL_PACKAGES=true`. `lerna --since` only sees changes inside package folders, so without this the push, tag and helm stages would skip images that a root file triggered.

### Conventions the script depends on

The script reads folder names and package names, and needs `git`, `jq` and `node` on the build agent. It stops with an error when `jq` or `node` is missing or `git diff` fails. The Jenkinsfile installs `jq` when the agent has none. It picks the binary with `dpkg --print-architecture`, so it works on amd64 and arm64 agents. On another agent type, change that download URL. If our repo is different, we edit the script. Its header comment names the line to change for each convention.

- Deployable apps are in `services/*` and `facades/*`.
- A package is an image only if its `package.json` has a `docker:build:full` script.
- Local shared packages are in `packages/<folder>`, and their npm name is `@local/<folder>`. The script maps `packages/core/package.json` to `@local/core` by that rule. A local package named `@acme/core` will not trigger a full build of the services that use it until we change the `@local/` prefix.
- Root files have fixed names: `Dockerfile.deps`, `scripts/node-file-tracer.js`, `patches/`.

## Jenkins parameters

| Parameter | Effect |
| --- | --- |
| `USE_NFT_BUILD` | Traced full builds when on (default), legacy full builds when off |
| `BUILD_ALL_PACKAGES` | Full build of every package, no `--since` filter |
| `BUILD_ENV` | Environment tag to build for. Also the base image tag for code builds |
| `PROMOTION_CHAIN` | Order of environments, e.g. `dev,qa,production` |
| `BYPASS_IMAGE_PROMOTION` | Build new images in a higher environment instead of retagging |

Only the first environment in `PROMOTION_CHAIN` builds images. A higher environment pulls the image tag of the previous one (`docker:retag`), pushes it with its version, and tags it for its own environment. A hotfix build or `BYPASS_IMAGE_PROMOTION` skips the retag and builds. A `BUILD_ENV` that is not in `PROMOTION_CHAIN` fails the build.

`helm-update` writes the image tag into `$WORKSPACE/$HELM_VALUES_YAML_PATH-values.yaml`. The key is the service folder name in camelCase, so `auth-service` becomes `authService`. The Jenkinsfile sets `HELM_VALUES_YAML_PATH` to `<helm path>/<env>`, so the file for `dev` is `<helm path>/dev-values.yaml`. If our chart uses other keys or file names, we edit the script in the service's `package.json`.

The Jenkinsfile clones the helm repo into `<project>-helm/` in the workspace. So `--helmPath` must start with `<project>-helm/`, for example `<project>-helm/values`. Another path makes `helm-update` edit a file outside the helm clone.

## Code builds

`Dockerfile.code` starts `FROM <repo>/<image>:<env>`, the last image that the pipeline tagged for this environment. It deletes the old `dist`, copies in the new host-built one, and copies `package.json`, `public` and the env files. It runs no install, so it takes seconds.

A code build needs only the published image, not the deps image. A new import is a full-build trigger, so the base image already has every module that the new `dist` loads.

The delete step matters. `COPY` merges into a folder that already exists, so a file that we removed from the source would stay in the image. With LoopBack that causes real bugs: the booter scans `dist/controllers` and still loads a deleted controller.

Two things to watch:

- A code build only works when an image for that environment exists. That is why the first build of a repo and the first build of a new service are full builds (no last commit, or a new `Dockerfile`).
- Each code build adds layers on top of the previous code build. After many code builds in a row the image has a long layer chain, and the old `dist` layers still use space. A full build starts a new chain, so we run `BUILD_ALL_PACKAGES=true` from time to time, for example before a release.

## Traced (NFT) full builds

This is the default full build. It has two parts: one shared deps image per pipeline run, and one trace per service.

### The shared deps image

`npm run docker:build:deps` builds `Dockerfile.deps` as `<root package name>-deps:local`. It copies the root manifest, the lockfile and every workspace `package.json` (no source), and runs `npm ci --omit=dev` one time for the whole monorepo. Every `Dockerfile.nft` then starts `FROM` this image, so services no longer run their own install. That is why the pipeline can run traced builds with `--concurrency 4` ([Legacy full builds](#legacy-full-builds) explains the limit of the old way).

The deps image does all the work that must happen after the install and before the tracer reads `node_modules`:

- Patching. If the repo has `patches/`, the image runs `patch-package`. The tracer copies files as they are on disk, so it must see the patched versions.
- Native addons. `npm ci --ignore-scripts` skips install scripts, so a package that ships a `.node` binary (bcrypt, argon2, sharp) has no binary for this platform. `Dockerfile.deps` has a commented example that rebuilds the addon and loads it one time. A bad binary then fails the build, not the first login request.
- Cleanup (optional). `node-prune` or `clean-modules` does not make a traced image smaller, because the tracer copies only files that the app loads. It only makes the deps image and the trace a little faster.

The deps image also installs a pinned `@vercel/nft` globally, so the tracer does not depend on project dependencies. The tracer uses `path.matchesGlob` and `fs.globSync`, so the deps image needs Node 22 or later. The templates use Node 24.

### The per-service trace

`Dockerfile.nft` copies the host-built `dist` of the service into the deps image and runs:

```sh
node scripts/node-file-tracer.js services/<name>/dist --workspace services/<name>
```

The tracer follows the real `require()` and `import` graph from every file in `dist` and prints the file list. `cpio -pdm` copies exactly those files into a clean tree, and the runtime stage copies that tree.

The pipeline builds `dist` on the host before this runs. If we run `docker:build:nft` by hand, we run `npm run build --workspaces` first.

### What a tracer cannot see

Static tracing only finds files that code reaches through `require()` or `import`. LoopBack and some libraries load files in other ways. Most of these failures do not crash the app. The app starts, then fails when it uses the missing file.

LoopBack booters scan `dist/controllers` and `dist/repositories` in our own code, and nothing imports those files. We give the tracer the whole `dist` folder, so each file is its own entry point.

Dependencies can use booters too. Some `@sourceloop/*` services register their own controllers with a booter that scans the package's own `dist`. Our code never imports those controllers, so the tracer does not find them. The app starts, and the routes return 404. This is the worst case, because a boot test passes. The root `traceGlobs` rule handles it for `@sourceloop/*`.

Some packages load only by name. A LoopBack datasource with `connector: 'postgresql'` makes the juggler try `require('loopback-connector-postgresql')` at runtime, so there is no static require to follow. Sequelize dialects (`pg`, `mysql2`) and native addons that pick a binary by name work the same way. We list these packages in `alwaysCopy`.

Static assets have no require graph at all. Swagger UI, the swagger-stats UI and the rest-explorer template serve HTML, CSS and fonts from a folder. We list those folders in `copyDirs`.

### The `nft` config

The tracer reads an `nft` block from the root `package.json` and from each `--workspace` folder. The lists merge, so a service only declares what it adds to the root.

```json
{
  "nft": {
    "alwaysCopy": ["loopback-connector-postgresql"],
    "copyDirs": ["node_modules/swagger-ui-dist"],
    "traceGlobs": [
      {"packages": "@sourceloop/*", "files": "dist/**/*.controller.js"}
    ]
  }
}
```

`alwaysCopy` lists packages that are loaded by name at runtime. The tracer traces each one from its entry point. Each name must be in the `dependencies` of the workspace that lists it, or the build fails. Without this check, npm hoisting can resolve the name from an unrelated service, and our image works only until that other service drops the dependency.

`copyDirs` lists folders to copy whole, with no tracing. Paths are relative to the workspace that lists them, and a missing folder fails the build. If a package is not hoisted, the root path does not exist. We then move that `copyDirs` entry to the service's `package.json` and use the nested `node_modules` path.

`traceGlobs` rules apply to packages that are already in the traced set. For each package whose name matches `packages`, the tracer adds every file matching `files` as an entry and traces again, until a pass adds nothing. A rule that matches too much adds some dead files. A rule that matches too little brings back the 404s.

The scaffold writes a root `copyDirs` for `swagger-ui-dist`, `swagger-stats-sf/ux` and `@loopback/rest-explorer/templates`. It also writes a root `traceGlobs` rule for `@sourceloop/*` controllers. The microservice generator adds each `loopback-connector-*` dependency of the service to `alwaysCopy`.

#### When we must add our own entries

We add entries each time we add something that loads code or files without a static import:

- A new datasource connector, a Sequelize dialect, or any plugin that takes a module name from config. Add the package to that service's `alwaysCopy` and `dependencies`.
- A dependency with its own booter or file scan, outside `@sourceloop/*`. Add a `traceGlobs` rule for the folders its booter scans. Models, repositories, providers and observers can all be booted, not only controllers.
- A library that reads templates, email views, SQL files, JSON schemas or locale files from its own folder. Add the folder to `copyDirs`.
- Our own non-JS runtime files, for example templates in a service. Copy them in the service's Dockerfiles, like `public`.

The `nft` block is part of the build now. When we change the runtime dependencies of a service, we check its `nft` entries in the same pull request.

### Testing before we trust it

A clean build proves very little here. Every case in "What a tracer cannot see" builds without an error, and most of them also start without an error. To know the traced image has what the app needs, we exercise what the app does:

- every route, including routes from `@sourceloop/*` components,
- every datasource and cache,
- every asset path (explorer, swagger UI, stats UI),
- every branch that loads a module only for some inputs.

We do this one time before the traced build becomes the default for a project. We do it again when something changes what the tracer sees:

- a new dependency loaded by name,
- a new booter-based package,
- an `@vercel/nft` upgrade,
- a framework upgrade that changes how files are found.

That is why `Dockerfile.deps` pins `@vercel/nft`. An upgrade changes tracer output, so it is not a routine version bump.

## Legacy full builds

`Dockerfile` does the whole build in the image: `npm ci`, `patch-package` when the repo has `patches/`, `npm run build --workspaces`, `npm prune --omit=dev`, then it copies the result. It needs no deps image and no host build.

It is slow. Each image runs its own `npm ci` over the full monorepo lockfile, and parallel installs can use all of the agent's memory. That is why the pipeline runs legacy builds with `--concurrency 1`. The traced build runs one shared install, so it can use `--concurrency 4`.

This image copies `node_modules` whole, so cleanup makes it smaller. `Dockerfile` has a commented `clean-modules` step after the prune. We prefer `clean-modules` to `node-prune` because it runs from npm and needs no download script.

We keep this build as a safety net. If a traced image is wrong and we do not have the right `nft` entry yet, we set `USE_NFT_BUILD=false` for that run and release. That needs no code change and does not block the release. We fix the trace config later.

## Local packages in a service

A generated service has no `@local/*` dependencies, so its Dockerfiles list none. When we add one, we fill in the `[local packages n/m]` blocks in that service's `Dockerfile.nft` and `Dockerfile.code`. The comments give the exact lines. `Dockerfile` needs no change, because it copies all of `packages/`.

If we forget, the build still passes. The service then fails at boot, or when it first loads that package.

## Adding this to an existing repo

1. Copy the root files listed in [Files](#files) from `packages/cli/src/generators/scaffold/templates`. Add the `docker:build:deps` script and the root `nft` block from `package.json.tpl`, with our own project name in the deps image tag.
2. Copy the three Dockerfiles from `packages/cli/src/generators/microservice/templates` into each service or facade. To get the docker scripts, generate a throwaway service with `sl microservice` and copy them from its `package.json`.
3. Fill in the local package blocks, and add `alwaysCopy` for the connectors each service uses.
4. Check the script conventions above against our folders and package names.
5. Build every image with the traced build and test it as described in [Testing before we trust it](#testing-before-we-trust-it) before we make it the default.
