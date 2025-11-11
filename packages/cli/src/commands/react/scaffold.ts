// Copyright (c) 2023 Sourcefuse Technologies
// Released under the MIT License.
// https://opensource.org/licenses/MIT

import {flags} from '@oclif/command';
import {IConfig} from '@oclif/config';
import * as path from 'node:path';
import Base from '../../command-base';
import {AnyObject, PromptFunction} from '../../types';
import {FileGenerator} from '../../utilities/file-generator';
import {McpConfigInjector} from '../../utilities/mcp-injector';
import {TemplateFetcher} from '../../utilities/template-fetcher';

export class ReactScaffold extends Base<{}> {
  private readonly templateFetcher = new TemplateFetcher();
  private readonly mcpInjector = new McpConfigInjector();
  private readonly fileGenerator = new FileGenerator();

  static readonly description = 'Scaffold a new React UI boilerplate project.';
  static readonly mcpDescription =
    'Creates a React UI boilerplate from a remote or local template and injects MCP configuration.';

  static readonly flags = {
    help: flags.boolean({description: 'Show manual pages'}),
    templateRepo: flags.string({
      description: 'Template repository (org/repo)',
      default: 'sourcefuse/react-boilerplate-ts-ui',
    }),
    templateVersion: flags.string({description: 'Template branch or version'}),
    installDeps: flags.boolean({
      description: 'Install dependencies after scaffolding',
      default: false,
    }),
    localPath: flags.string({
      description: 'Local path to template (for development)',
    }),
  };

  static readonly args = [
    {name: 'name', description: 'Project name', required: false},
  ];

  async run(): Promise<void> {
    const parsed = this.parse(ReactScaffold);
    const {args, flags: cmdFlags} = parsed;
    let {name} = args;

    if (!name) {
      const answer = await this.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Project name?',
          validate: (input: string) => Boolean(input) || 'Name is required',
        },
      ]);
      name = answer.name;
    }

    const result = await this.scaffoldProject({...cmdFlags, name});
    this.log(result);
  }

  // ✅ FIXED: typed return signature and use of `'text' as const`
  static async mcpRun(inputs: AnyObject): Promise<{
    content: {type: 'text'; text: string; isError?: boolean}[];
  }> {
    const cwd = process.cwd();
    try {
      if (inputs.workingDir) process.chdir(inputs.workingDir);
      const scaffolder = new ReactScaffold(
        [],
        {} as IConfig,
        {} as PromptFunction,
      );
      const result = await scaffolder.scaffoldProject(inputs);
      return {
        content: [{type: 'text' as const, text: result, isError: false}],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {type: 'text' as const, text: `Error: ${message}`, isError: true},
        ],
      };
    } finally {
      process.chdir(cwd);
    }
  }

  private async scaffoldProject(inputs: AnyObject): Promise<string> {
    const {name, templateRepo, templateVersion, installDeps, localPath} =
      inputs;
    const targetDir = path.join(process.cwd(), name);

    console.info(`Creating React project '${name}'...`); // NOSONAR

    await this.templateFetcher.smartFetch({
      repo: templateRepo,
      targetDir,
      branch: templateVersion,
      localPath,
    });

    this.fileGenerator.updatePackageJson(targetDir, name);
    this.mcpInjector.injectConfig(targetDir, 'react');

    if (this.fileGenerator.replaceInFiles) {
      this.fileGenerator.replaceInFiles(
        targetDir,
        'react-boilerplate-ts-ui',
        name,
      );
    }

    if (installDeps) this.fileGenerator.installDependencies(targetDir);

    return this.successMessage(name, targetDir, installDeps);
  }

  private successMessage(name: string, dir: string, deps: boolean): string {
    const depMsg = deps
      ? '📦 Dependencies installed'
      : 'Run `npm install` to set up dependencies';
    return [
      `✅ React UI project '${name}' scaffolded successfully!`,
      '',
      `📁 Location: ${dir}`,
      '🔧 MCP Configuration: Added',
      depMsg,
      '',
      'Next steps:',
      `  cd ${name}`,
      '  npm start',
      '',
    ].join('\n');
  }
}
