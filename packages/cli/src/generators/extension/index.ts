// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject, ExtensionOptions} from '../../types';
import BaseExtensionGenerator from '../../extension-generator';
import {join} from 'path';
import {JSON_SPACING} from '../../utils';
import fs from 'fs';

export default class ExtensionGenerator extends BaseExtensionGenerator<ExtensionOptions> {
  constructor(public args: string[], public opts: ExtensionOptions) {
    super(args, opts);
  }

  initializing() {
    if (!this.fs.exists(join(this.destinationPath(), 'lerna.json'))) {
      this.exit('Can create an extension only from the root of a monorepo');
    } else {
      this.options.name = this.options.name ?? 'module';
    }
  }

  _setupGenerator() {
    return super._setupGenerator();
  }

  async setOptions() {
    return super.setOptions();
  }

  //Loopback4 prompts
  async promptProjectName() {
    const promtAns = await super.promptProjectName();
    this.destinationRoot(join('packages', this.projectInfo.name));
    return promtAns;
  }

  async promptComponent() {
    return super.promptComponent();
  }

  async promptOptions() {
    return super.promptOptions();
  }

  scaffold() {
    return super.scaffold();
  }

  install() {
    if (!this.shouldExit()) {
      const packageJsonFile = join(this.destinationPath(), 'package.json');
      const packageJson = this.fs.readJSON(packageJsonFile) as AnyObject;
      packageJson.name = `@local/${packageJson.name}`;
      packageJson.license = 'MIT';
      const scripts = packageJson.scripts;
      scripts.preinstall = 'npm i @loopback/build --no-save && npm run build';
      scripts.prune = 'npm prune --production';
      packageJson.scripts = scripts;
      fs.writeFileSync(
        packageJsonFile,
        JSON.stringify(packageJson, undefined, JSON_SPACING),
      );
      return super.install();
    } else {
      return false;
    }
  }

  addScope() {
    let czConfig = this.fs.read(
      join(this.destinationPath(), '../../', '.cz-config.js'),
    );
    const lastScopeIndex = czConfig.indexOf(
      '[',
      czConfig.lastIndexOf('scopes'),
    );
    const offset = 2;
    const firstPart = czConfig.slice(0, lastScopeIndex + offset);
    const secPart = czConfig.slice(lastScopeIndex + offset);
    const stringToAdd = `{name: \'${this.options.name}\'}, \n`;

    czConfig = firstPart + stringToAdd + secPart;
    fs.writeFile(
      join(this.destinationPath(), '../../', '.cz-config.js'),
      czConfig,
      {
        flag: 'w',
      },
      function () {
        //This is intentional.
      },
    );
  }

  end() {
    return super.end();
  }
}
