﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {flags} from '@oclif/command';
import Base from '../command-base';
import {ScaffoldOptions} from '../types';

export class Scaffold extends Base<ScaffoldOptions> {
  static description = 'create a project scaffold';

  static flags = {
    help: flags.boolean({
      name: 'help',
      description: 'show manual pages',
      type: 'boolean',
    }),
    issuePrefix: flags.string({
      name: 'issuePrefix',
      description: 'Prefix to be used for issues(e.g. GH-)',
    }),
    cwd: flags.string({
      name: 'working-directory',
      description:
        'Directory where project will be scaffolded, instead of the project name',
    }),
    integrateWithBackstage: flags.boolean({
      name: 'integrateWithBackstage',
      description: 'Do you want to include backstage integration files?',
    }),
    owner: flags.string({
      name: 'owner',
      description: 'owner of the repo',
    }),
    description: flags.string({
      name: 'description',
      description: 'description of the repo',
    }),
  };
  static args = [
    {name: 'name', description: 'name of the project', required: false},
  ];

  async run() {
    await super.generate('scaffold', Scaffold);
  }
}
