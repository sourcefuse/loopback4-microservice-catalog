// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {flags} from '@oclif/command';
// eslint-disable-next-line @typescript-eslint/naming-convention
import Base from '../command-base';
import {UpdateOptions} from '../generators/update/types/types';

export class Update extends Base<UpdateOptions> {
  static readonly description = 'update the dependencies of a loopback project';

  static readonly flags = {
    help: flags.boolean({
      name: 'help',
      description: 'show manual pages',
      type: 'boolean',
    }),
  };

  async run() {
    await super.generate('update', Update);
  }
}
