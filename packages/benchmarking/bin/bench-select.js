#!/usr/bin/env node
// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
require('../dist/cli/select.js')
  .main(process.argv.slice(2))
  .catch(error => {
    process.stderr.write(
      `bench-select: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    return 2;
  })
  .then(code => {
    // A loaded benchmark file can open a handle, such as a database pool, that
    // would keep the process alive. Exit after stdout drains, so a pipe gets
    // the whole list.
    process.stdout.write('', () => process.exit(code));
  });
