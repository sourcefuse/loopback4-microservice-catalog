// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {flags} from '@oclif/command';
// eslint-disable-next-line @typescript-eslint/naming-convention
import Base from '../command-base';
import {AnyObject, ExtensionOptions} from '../types';
import {buildOptions} from '../utils';

export class Extension extends Base<ExtensionOptions> {
  static readonly description =
    'This generates a local package in the packages folder of a ARC generated monorepo. This package can then be installed and used inside other modules in the monorepo.';
  static readonly mcpDescription = `
    Use this command to generate or add a local packages in the ARC based monorepo following the ARC standards and best practices.
    The generated package can be used as an extension to the existing services or facades in the monorepo.
    It can also be used to create reusable components that can be shared across multiple services or facades.
    The package will be created in the packages folder of the monorepo.
    You can use 'npm install @local/<package-name>' to install the package in other modules of the monorepo.
    You can not update existing packages using this.
    Refer existing packages if any for discovering the parameters not provided by the user, or ask the user directly
    `;

  static readonly mcpFlags = {
    workingDir: flags.string({
      name: 'workingDir',
      description: 'path of the root directory of the monorepo',
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
  static readonly args = [
    {name: 'name', description: 'Name of the extension', required: false},
  ];

  async run() {
    await super.generate('extension', Extension);
  }

  static async mcpRun(inputs: AnyObject) {
    return Base.mcpResponse(
      {
        config: JSON.stringify({
          ...buildOptions,
          applicationName: inputs.name,
          description: `ARC based ${inputs.name}`,
        }),
        ...inputs,
      },
      'extension',
      [inputs.name, '-y'],
    );
  }
}
