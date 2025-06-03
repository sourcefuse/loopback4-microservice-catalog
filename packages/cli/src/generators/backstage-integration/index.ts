// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BaseGenerator} from '../../base-generator';
import {BackstageIntegrationOptions} from '../../types';
export default class BackstageIntegrationGenerator extends BaseGenerator<BackstageIntegrationOptions> {
  cwd?: string;
  constructor(
    public args: string[],
    public opts: BackstageIntegrationOptions,
  ) {
    super(args, opts);
  }

  async writing() {
    await this.copyTemplateAsync();
  }
}
