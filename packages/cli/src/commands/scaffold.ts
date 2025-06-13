// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {flags} from '@oclif/command';
// eslint-disable-next-line @typescript-eslint/naming-convention
import Base from '../command-base';
import {AnyObject, ScaffoldOptions} from '../types';

export class Scaffold extends Base<ScaffoldOptions> {
  static readonly description =
    'Setup a ARC based monorepo using npm workspaces with an empty services, facades and packages folder';
  static readonly mcpDescription = `
    Use this command to generate a npm workspaces based monorepo following the ARC standards and best practices.
    The generated monorepo contains services, facades and packages folders by default.
  `;

  static readonly flags = {
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
    jenkinsfile: flags.boolean({
      name: 'jenkinsfile',
      description:
        'Do you want to create a Jenkinsfile for Helm-based deployment on Kubernetes?',
      required: false,
    }),
    helmPath: flags.string({
      name: 'helmPath',
      description: 'Enter the path for Helm chart:',
      dependsOn: ['jenkinsfile'],
    }),
  };
  static readonly args = [
    {name: 'name', description: 'name of the project', required: false},
  ];

  async run() {
    await super.generate('scaffold', Scaffold);
  }

  static async mcpRun(inputs: AnyObject) {
    return Base.mcpResponse(inputs, 'scaffold', []);
  }
}
