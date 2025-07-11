﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {join} from 'path';
import {BaseGenerator} from '../../base-generator';
import {ScaffoldOptions} from '../../types';
const chalk = require('chalk'); //NOSONAR
// eslint-disable-next-line @typescript-eslint/naming-convention
import BackstageIntegrationGenerator from '../backstage-integration';
const JENKINSFILE_TEMPLATE = join(
  '..',
  '..',
  'jenkins',
  'templates',
  'jenkinsfile.tpl',
);
export default class ScaffoldGenerator extends BaseGenerator<ScaffoldOptions> {
  cwd?: string;
  constructor(
    public args: string[],
    public opts: ScaffoldOptions,
  ) {
    super(args, opts);
  }

  async configuring() {
    this._setRoot();
    await this.spawnCommand('git', ['init']);
  }

  async writing() {
    this._setRoot();
    await this.createFolders([]);
    await this.copyTemplateAsync();
    await this.createFolders(['facades', 'services', 'packages']);
    if (this.options.integrateWithBackstage) {
      this.composeWith(
        {
          Generator: BackstageIntegrationGenerator,
          path: require.resolve('../backstage-integration'),
        },
        this.options,
      );
    }
    if (this.options.jenkinsfile) {
      await this._createJenkinsFileAsync();
    }
    await this._addDocs();
  }
  async _createJenkinsFileAsync() {
    try {
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      await this.fs.copyTplAsync(
        this.templatePath(JENKINSFILE_TEMPLATE),
        this.destinationPath(`JenkinsFile`),
        {
          project: this.options.name,
          projectName: this.options.name?.toUpperCase(),
          helmPath: this.options.helmPath,
        },
      );
    } catch (error) {
      this.log(chalk.cyan(`Error while adding jenkinsfile{error.message}`));
    }
  }
  async install() {
    await this.spawnCommand('npm', ['i']);
  }
  async _addDocs() {
    const sourcePath = `${this.destinationRoot()}/README.md`;
    const destinationPath = `${this.destinationRoot()}/docs/README.md`;
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(sourcePath, destinationPath);
  }

  private _setRoot() {
    if (this.options.cwd) {
      this.destinationRoot(this.options.cwd);
    } else {
      this.destinationRoot(this.options.name);
    }
  }
}
