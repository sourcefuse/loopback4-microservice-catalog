#!/usr/bin/env bash
# This script copies the migration script from sourceloop to migration folder.
set -x
set -e

ROOT_DIR="$(pwd)"
MIGRATIONS_DIR="$ROOT_DIR/migration"
cd "$MIGRATIONS_DIR"
npm i --omit=dev
cd "$ROOT_DIR"
