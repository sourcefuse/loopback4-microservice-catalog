#!/usr/bin/env node
// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
try {
  process.exitCode = require('../dist/cli/compare.js').main(
    process.argv.slice(2),
  );
} catch (error) {
  // Exit 1 means a regression, so an unreadable file must not end with it.
  process.stderr.write(
    `bench-compare: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 2;
}
