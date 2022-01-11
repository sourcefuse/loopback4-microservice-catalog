// Copyright IBM Corp. 2017,2020. All Rights Reserved.
// Node module: @loopback/cli
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';
const ExtensionGenerator = require('@loopback/cli/generators/extension');
const fs = require('fs');
const path = require('path');

module.exports = class EGenerator extends ExtensionGenerator {
  // Note: arguments and options should be defined in the constructor.
  constructor(args, opts) {
    super(args, opts);
  }

  _setupGenerator() {
    return super._setupGenerator();
  }

  setOptions() {
    if (this.shouldExit()) {
      return }
    return super.setOptions()
  }

  promptProjectName() {
    if (this.shouldExit()) {
      return }
    return super.promptProjectName()
  }

  promptProjectDir() {
    if (this.shouldExit()) {
      return }
    return super.promptProjectDir()
  }

  promptComponent() {
    if (this.shouldExit()) {
      return }
    return super.promptComponent()
  }

  promptOptions() {
    if (this.shouldExit()) {
      return }
    return super.promptOptions()
  }

  promptYarnInstall() {
    if (this.shouldExit()) {
      return }
    return super.promptYarnInstall()
  }

  scaffold() {
    return super.scaffold();
  }

  install() {
    const packageJsonFile = path.join(process.cwd(), 'package.json');
    const packageJson = require(packageJsonFile);
    const scripts = packageJson.scripts;
    scripts.preinstall =
      'npm i @loopback/build@6.4.0 --no-save && npm run build';
    scripts.prune = 'npm prune --production';
    packageJson.scripts = scripts;
    fs.writeFileSync(packageJsonFile, JSON.stringify(packageJson), null, 2);
    return super.install();
  }

  end() {
    return super.end();
  }
};
