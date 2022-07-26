// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BaseGenerator} from '../../base-generator';
import {ScaffoldOptions} from '../../types';
import BackstageIntegrationGenerator from '../backstage-integration';
export default class ScaffoldGenerator extends BaseGenerator<ScaffoldOptions> {
  cwd?: string;
  constructor(public args: string[], public opts: ScaffoldOptions) {
    super(args, opts);
  }

  async prompting() {
    if (!this.options.name) {
      const {name} = await this.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Name of the directory in which the project is scaffolded:',
        },
      ]);
      this.options.name = name;
    }
  }

  async ticketNumberPrompt() {
    if (!this.options.issuePrefix) {
      const {issuePrefix} = await this.prompt([
        {
          type: 'input',
          name: 'issuePrefix',
          message: 'Enter the issue Prefix:',
        },
      ]);
      this.options.issuePrefix = issuePrefix;
    }
  }

  async configuring() {
    this._setRoot();
    this.spawnCommandSync('git', ['init']);
  }

  async writing() {
    this._setRoot();
    await this.createFolders([]);
    this.copyTemplates();
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
  }

  async install() {
    this.spawnCommandSync('npm', ['i']);
  }

  private _setRoot() {
    if (this.options.cwd) {
      this.destinationRoot(this.options.cwd);
    } else {
      this.destinationRoot(this.options.name);
    }
  }
}
