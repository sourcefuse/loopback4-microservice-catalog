// Copyright (c) 2023 Sourcefuse Technologies
// Released under the MIT License.
// https://opensource.org/licenses/MIT

import {flags} from '@oclif/command';
import Base from '../../command-base';
import {AnyObject, ReactScaffoldOptions} from '../../types';

export class ReactScaffold extends Base<ReactScaffoldOptions> {
  static readonly description =
    'Scaffold a new React project from ARC boilerplate';
  static readonly mcpDescription =
    'Creates a new React project using ARC boilerplate with MCP integration.';

  static readonly flags = {
    help: flags.boolean({description: 'Show manual pages'}),
    templateRepo: flags.string({
      description: 'Template repository (org/repo)',
      default: 'sourcefuse/react-boilerplate-ts-ui',
      required: false,
    }),
    templateVersion: flags.string({
      description: 'Template branch or version',
      required: false,
    }),
    installDeps: flags.boolean({
      description: 'Install dependencies after scaffolding',
      default: false,
      required: false,
    }),
    localPath: flags.string({
      description: 'Local path to template',
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
    await super.generate('react-scaffold', ReactScaffold);
  }

  static async mcpRun(inputs: AnyObject) {
    return Base.mcpResponse(inputs, 'react-scaffold', []);
  }
}
