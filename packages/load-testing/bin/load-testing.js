#!/usr/bin/env node
// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
require('../dist/cli.js')
  .main(process.argv.slice(2))
  .then(code => {
    process.exitCode = code;
  });
