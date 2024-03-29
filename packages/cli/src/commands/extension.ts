﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {flags} from '@oclif/command';
// eslint-disable-next-line @typescript-eslint/naming-convention
import Base from '../command-base';
import {ExtensionOptions} from '../types';

export class Extension extends Base<ExtensionOptions> {
  static readonly description = 'add an extension';

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
}
