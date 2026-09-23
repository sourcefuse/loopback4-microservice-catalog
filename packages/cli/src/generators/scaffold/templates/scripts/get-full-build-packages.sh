#!/bin/bash
#
# Decides which services and facades need a FULL Docker build. All other
# changed packages get a CODE build (new dist on top of the last image).
#
# Usage:  bash scripts/get-full-build-packages.sh [LAST_COMMIT]
# Output: comma-separated package names, for `lerna --scope` / `--ignore`.
#         Empty output means no package needs a full build.
#
# Requires: git, jq.
#
# ---------------------------------------------------------------------------
# Conventions this script assumes. If our repo does not follow one of them,
# change the line named in the "Edit" note.
# ---------------------------------------------------------------------------
#
# 1. Deployable apps live in `services/*` and `facades/*`.
#    Edit: the `for search_dir in services facades` loop.
#
# 2. Only a package with a `docker:build:full` script in its package.json
#    is a Docker image. Other packages are skipped.
#    Edit: the `jq -e '.scripts["docker:build:full"]'` check.
#
# 3. Shared local packages live in `packages/<folder>` and their npm name is
#    `@local/<folder>` (e.g. packages/core -> @local/core). A service uses a
#    local package by listing `@local/<folder>` in its dependencies.
#    Edit: the `packages/*/package.json` match and the `@local/` prefix.
#
# 4. Each service or facade has `Dockerfile` (legacy full build) and
#    `Dockerfile.nft` (traced full build). `Dockerfile.code` is NOT a
#    full-build trigger, because a code build does not change dependencies.
#
# 5. The shared deps image is `Dockerfile.deps` at the repo root, the tracer
#    is `scripts/node-file-tracer.js`, and npm patches live in `patches/`.
#
# ---------------------------------------------------------------------------
# A package gets a full build when ANY of these is true:
# ---------------------------------------------------------------------------
#   a. No LAST_COMMIT, or git does not know the commit (first build, force-push).
#   b. A root file that goes into every image changed: `patches/**`,
#      `Dockerfile.deps`, `scripts/node-file-tracer.js`, the root `nft` config,
#      or `package-lock.json` with no workspace package.json change.
#   c. The package's own `Dockerfile` or `Dockerfile.nft` changed.
#   d. The package's `dependencies`, `devDependencies` or `nft` changed.
#      A version bump or a script change alone does NOT count.
#   e. The `dependencies` or `devDependencies` of a `@local/*` package that
#      it uses changed. Source changes in a local package do NOT count, a
#      code build copies the new local dist too.
#
# Known gap: when a lockfile-only fix (e.g. a transitive security bump) and a
# direct dependency change land in the same diff window, rule (b) cannot see
# the lockfile fix. Keep such changes in separate builds, or run the pipeline
# with BUILD_ALL_PACKAGES=true to force full builds.

set -o pipefail

# Keeps deps/devDeps/nft only. `-S` sorts keys so that key order is not a change.
readonly JQ_DEPS_FILTER='{dependencies: (.dependencies // {}), devDependencies: (.devDependencies // {}), nft: (.nft // {})}'
readonly LOCAL_SCOPE='@local/'

last_commit="${1:-}"
build_all=false
changed_files=()
changed_local_pkgs=()

# Returns 0 when the deps/devDeps/nft of $1 differ between last_commit and HEAD.
deps_changed() {
    local file="$1" old new
    old=$(git show "$last_commit:$file" 2>/dev/null | jq -cS "$JQ_DEPS_FILTER" 2>/dev/null)
    new=$(jq -cS "$JQ_DEPS_FILTER" "$file" 2>/dev/null)
    [[ "$old" != "$new" ]]
}

array_contains() {
    local needle="$1"; shift
    for element; do [[ "$element" == "$needle" ]] && return 0; done
    return 1
}

if [[ -z "$last_commit" ]]; then
    build_all=true
elif ! git rev-parse --verify "$last_commit^{commit}" &>/dev/null; then
    echo "Warning: commit '$last_commit' not found, building all packages" >&2
    build_all=true
else
    while IFS= read -r file; do changed_files+=("$file"); done \
        < <(git diff --name-only "$last_commit" HEAD)

    # Rule (b): root changes go into every image.
    for file in "${changed_files[@]}"; do
        if [[ "$file" == patches/* || "$file" == "Dockerfile.deps" || "$file" == "scripts/node-file-tracer.js" ]]; then
            build_all=true
            break
        fi
        if [[ "$file" == "package.json" ]]; then
            old_nft=$(git show "$last_commit:package.json" 2>/dev/null | jq -cS '.nft // {}' 2>/dev/null)
            new_nft=$(jq -cS '.nft // {}' package.json 2>/dev/null)
            if [[ "$old_nft" != "$new_nft" ]]; then
                build_all=true
                break
            fi
        fi
        if [[ "$file" == "package-lock.json" ]]; then
            # With npm workspaces the root lockfile changes each time any
            # workspace adds a dependency. Only a lockfile change WITHOUT a
            # workspace package.json change is a transitive update that can
            # touch every image.
            workspace_pkg_changed=false
            for f in "${changed_files[@]}"; do
                if [[ "$f" == */package.json ]]; then
                    workspace_pkg_changed=true
                    break
                fi
            done
            if ! $workspace_pkg_changed; then
                build_all=true
                break
            fi
        fi
    done

    # Rule (e), part 1: collect local packages whose dependencies changed.
    if ! $build_all; then
        for file in "${changed_files[@]}"; do
            if [[ "$file" == packages/*/package.json ]] && deps_changed "$file"; then
                pkg_folder="${file#packages/}"
                changed_local_pkgs+=("${LOCAL_SCOPE}${pkg_folder%/package.json}")
            fi
        done
    fi
fi

packages_needing_full_build=()

for search_dir in services facades; do
    [[ -d "$search_dir" ]] || continue

    for pkg_json in "$search_dir"/*/package.json; do
        [[ -f "$pkg_json" ]] || continue
        jq -e '.scripts["docker:build:full"]' "$pkg_json" &>/dev/null || continue

        pkg_name=$(jq -r '.name' "$pkg_json")
        [[ -z "$pkg_name" || "$pkg_name" == "null" ]] && continue

        pkg_dir="${pkg_json%/package.json}"
        needs_full_build=$build_all

        # Rules (c) and (d).
        if ! $needs_full_build; then
            for file in "${changed_files[@]}"; do
                if [[ "$file" == "$pkg_dir/Dockerfile" || "$file" == "$pkg_dir/Dockerfile.nft" ]] \
                    || { [[ "$file" == "$pkg_json" ]] && deps_changed "$pkg_json"; }; then
                    needs_full_build=true
                    break
                fi
            done
        fi

        # Rule (e), part 2: the package uses a local package from part 1.
        if ! $needs_full_build && [[ ${#changed_local_pkgs[@]} -gt 0 ]]; then
            while IFS= read -r dep; do
                if array_contains "$dep" "${changed_local_pkgs[@]}"; then
                    needs_full_build=true
                    break
                fi
            done < <(jq -r --arg scope "$LOCAL_SCOPE" '
                [(.dependencies // {}), (.devDependencies // {})] | add // {}
                | keys[] | select(startswith($scope))
            ' "$pkg_json")
        fi

        $needs_full_build && packages_needing_full_build+=("$pkg_name")
    done
done

( IFS=','; echo "${packages_needing_full_build[*]}" )
