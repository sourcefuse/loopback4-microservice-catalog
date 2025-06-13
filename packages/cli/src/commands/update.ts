// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {flags} from '@oclif/command';
// eslint-disable-next-line @typescript-eslint/naming-convention
import Base from '../command-base';
import {UpdateOptions} from '../generators/update/types/types';
import {AnyObject} from '../types';

export class Update extends Base<UpdateOptions> {
  static readonly description = 'update the dependencies of a loopback project';
  static readonly mcpDescription = `
    Use this command to update the dependencies of a LoopBack project.
    It will update the dependencies in the package.json file and install the latest versions of the dependencies.
    This command is useful when you want to keep your project up-to-date with the latest versions of the dependencies.
  `;

  static readonly mcpFlags = {
    workingDir: flags.string({
      name: 'workingDir',
      description:
        'Absolute path of the root directory of the monorepo, relative paths are not supported yet',
      required: false,
    }),
  };

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

  static async mcpRun(inputs: AnyObject) {
    return Base.mcpResponse(inputs, 'update', []);
  }
}
