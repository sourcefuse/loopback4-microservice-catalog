// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { BaseGenerator } from '../../base-generator';
import { ScaffoldOptions } from '../../types';
import BackstageIntegrationGenerator from '../backstage-integration';
export default class ScaffoldGenerator extends BaseGenerator<ScaffoldOptions> {
  cwd?: string;
  constructor(public args: string[], public opts: ScaffoldOptions) {
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
  }

  async install() {
    await this.spawnCommand('npm', ['i']);
  }

  private _setRoot() {
    if (this.options.cwd) {
      this.destinationRoot(this.options.cwd);
    } else {
      this.destinationRoot(this.options.name);
    }
  }
}
