// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BaseGenerator} from '../../base-generator';
import {BackstageIntegrationOptions} from '../../types';
export default class BackstageIntegrationGenerator extends BaseGenerator<
  BackstageIntegrationOptions
> {
  cwd?: string;
  constructor(public args: string[], public opts: BackstageIntegrationOptions) {
    super(args, opts);
  }

  async writing() {
    if (!this.options.owner) {
      const {owner, description} = await this.prompt([
        {
          type: 'input',
          name: 'owner',
          message: 'Username of the repo owner: ',
        },
        {
          type: 'input',
          name: 'description',
          message: 'Description of the project: ',
        },
      ]);
      this.options.owner = owner;
      this.options.description = description;
    }
    this.copyTemplates();
  }
}
