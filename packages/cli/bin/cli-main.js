#!/usr/bin/env node
// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: @loopback/cli
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

const pkg = require('../package.json');
const semver = require('semver');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const {
  tabCompletionCommands,
  runTabCompletionCommand,
} = require('@loopback/cli/lib/tab-completion');

// Make sure node version meets the requirement. This code intentionally only
// uses ES5 features so that it can be run with lower versions of Node
// to report the version requirement.
const nodeVer = process.versions.node;
const requiredVer = pkg.engines.node;
const ok = semver.satisfies(nodeVer, requiredVer);
if (!ok) {
  const format =
    'Node.js "%s" is not supported. Please use a version that satisfies "%s".';
  console.warn(chalk.red(format), nodeVer, requiredVer);
}

// remap this so params get passed correctly
// reorganize file
// Intentionally have a separate `main.js` which can use JS features
// supported by required version of Node
const minimist = require('minimist');
const updateNotifier = require('update-notifier');
const main = require('@loopback/cli/lib/cli');

// remap these for the composite CLI
const opts = minimist(process.argv.slice(2), {
  alias: {
    version: 'v', // --version or -v: print versions
    commands: 'l', // --commands or -l: print commands
    help: 'h', // --help or -h: help
  },
});

const args = opts._;

if (args.length === 0) {
  console.error('Either sl or lb4 subcommand must be passed');
  return;
}

const originalCommand = args[0];

switch (originalCommand) {
  case 'lb4':
    lb_cli();
    break;
  default:
    sl_cli();
}

function lb_cli() {
  const optsLocal = minimist(process.argv.slice(3), {
    alias: {
      version: 'v', // --version or -v: print versions
      commands: 'l', // --commands or -l: print commands
      help: 'h', // --help or -h: help
    },
  });
  const originalSubCommand = optsLocal._[0];
  if (tabCompletionCommands.includes(originalSubCommand)) {
    // rename file so it's specific to LB4
    const yoJsonFile = path.join(__dirname, '../.yo-rc.json');
    const config = fs.readJsonSync(yoJsonFile);
    return runTabCompletionCommand(
      config.commands,
      originalSubCommand,
      console.log,
    );
  }

  const mainLocal = require('@loopback/cli/lib/cli');
  const updateNotifierLocal = require('update-notifier');
  // Force version check with `lb4 --version`
  const interval = optsLocal.version ? 0 : undefined;
  updateNotifierLocal({
    pkg: pkg,
    updateCheckInterval: interval,
  }).notify({isGlobal: true});

  mainLocal(optsLocal);
  return undefined;
}

//gut anything lb4 specific and rewire to generators
function sl_cli() {
  console.log("You've hit the awesome Sourceloop CLI");
  const optsLocal = minimist(process.argv.slice(2), {
    alias: {
      version: 'v', // --version or -v: print versions
      commands: 'l', // --commands or -l: print commands
      help: 'h', // --help or -h: help
    },
  });
  //const originalSubCommand = opts._[0];
  // restore auto complete
  // if (tabCompletionCommands.includes(originalSubCommand)) {
  //     // rename file so it's specific to LB4
  //     const yoJsonFile = path.join(__dirname, '../.yo-rc.json');
  //     const config = fs.readJsonSync(yoJsonFile);
  //     return runTabCompletionCommand(config.commands, originalSubCommand, console.log);
  // }

  const mainLocal = require('../lib/cli');
  const updateNotifierLocal = require('update-notifier');
  // Force version check with `lb4 --version`
  const interval = optsLocal.version ? 0 : undefined;
  updateNotifierLocal({
    pkg: pkg,
    updateCheckInterval: interval,
  }).notify({isGlobal: true});

  mainLocal(optsLocal);
}
