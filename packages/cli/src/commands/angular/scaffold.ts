// Copyright (c) 2023 Sourcefuse Technologies
// Released under the MIT License.
// https://opensource.org/licenses/MIT

import {flags} from '@oclif/command';
import Base from '../../command-base';
import {AngularScaffoldOptions, AnyObject} from '../../types';

export class AngularScaffold extends Base<AngularScaffoldOptions> {
  static readonly description =
    'Scaffold a new Angular project from ARC boilerplate';

  static readonly mcpDescription =
    'Creates a new Angular project using ARC boilerplate with MCP integration.';

  static readonly flags = {
    help: flags.boolean({description: 'Show manual pages'}),
    templateRepo: flags.string({
      description: 'Template repository (owner/repo or local path)',
      default: 'sourcefuse/angular-boilerplate',
      required: false,
    }),
    templateVersion: flags.string({
      description: 'Template branch, tag, or version',
      required: false,
    }),
    localPath: flags.string({
      description: 'Local path to use instead of remote template',
      required: false,
    }),
    installDeps: flags.boolean({
      description: 'Install dependencies after scaffolding',
      default: false,
      required: false,
    }),
  };

  static readonly mcpFlags = {
    workingDir: flags.string({
      description: 'Working directory for scaffolding',
      required: false,
    }),
  };

  static readonly args = [
    {name: 'name', description: 'Project name', required: false},
  ];

  async run(): Promise<void> {
    await super.generate('angular-scaffold', AngularScaffold);
  }

  static async mcpRun(inputs: AnyObject) {
    return Base.mcpResponse(inputs, 'angular-scaffold', []);
  }
}
