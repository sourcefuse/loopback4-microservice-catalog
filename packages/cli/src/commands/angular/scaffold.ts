// Copyright (c) 2023 Sourcefuse Technologies
// Released under the MIT License.
// https://opensource.org/licenses/MIT

import {flags} from '@oclif/command';
import {IConfig} from '@oclif/config';
import * as path from 'node:path';
import Base from '../../command-base';
import {AngularScaffoldOptions, AnyObject, PromptFunction} from '../../types';
import {FileGenerator} from '../../utilities/file-generator';
import {McpConfigInjector} from '../../utilities/mcp-injector';
import {TemplateFetcher} from '../../utilities/template-fetcher';

export class AngularScaffold extends Base<AngularScaffoldOptions> {
  private readonly templateFetcher = new TemplateFetcher();
  private readonly mcpInjector = new McpConfigInjector();
  private readonly fileGen = new FileGenerator();
  static readonly description =
    'Scaffold a new Angular project from ARC boilerplate';

  static readonly mcpDescription =
    'Creates a new Angular project using ARC boilerplate with MCP integration.';

  static readonly flags = {
    help: flags.boolean({description: 'Show manual pages'}),
    // Keep only minimal options requested
    templateRepo: flags.string({
      description: 'Template repository (owner/repo or local path)',
      default: 'sourcefuse/angular-boilerplate',
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
    const {args, flags: opts} = this.parse(AngularScaffold);
    const name = args.name ?? (await this.promptProjectName());
    const result = await this.scaffoldProject({name, ...opts});
    this.log(result);
  }

  static async mcpRun(inputs: AnyObject) {
    const cwd = process.cwd();
    try {
      if (inputs.workingDir) process.chdir(inputs.workingDir);

      const instance = new AngularScaffold(
        [],
        {} as IConfig,
        {} as PromptFunction,
      );
      const result = await instance.scaffoldProject(
        inputs as AngularScaffoldOptions,
      );

      return {
        content: [
          {
            type: 'text' as const,
            text: result,
            isError: false,
          },
        ],
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        content: [
          {
            type: 'text' as const,
            text: `Error: ${msg}`,
            isError: true,
          },
        ],
      };
    } finally {
      process.chdir(cwd);
    }
  }

  // ------------------- MAIN LOGIC -------------------
  private async scaffoldProject(
    inputs: AngularScaffoldOptions,
  ): Promise<string> {
    const name = inputs.name!;
    if (!name || String(name).trim().length === 0) {
      throw new Error('Project name is required');
    }

    const templateRepo =
      inputs.templateRepo ?? 'sourcefuse/angular-boilerplate';
    const installDeps = !!inputs.installDeps;
    const targetDir = path.join(process.cwd(), name);

    // user-visible log (kept intentionally for CLI UX)
    console.log(`\n📦 Scaffolding Angular project '${name}'...`); // NOSONAR

    await this.templateFetcher.smartFetch({
      repo: templateRepo,
      targetDir,
    });

    // inject MCP config so AI tools can interact with the created project
    this.mcpInjector.injectConfig(targetDir, 'angular');
    this.fileGen.updatePackageJson(targetDir, name);

    if (installDeps) {
      this.fileGen.installDependencies(targetDir);
    }

    return this.buildSuccessMessage(name, targetDir, installDeps);
  }

  // ------------------- PROMPT -------------------
  private async promptProjectName(): Promise<string> {
    const {value} = await this.prompt([
      {
        type: 'input',
        name: 'value',
        message: 'Enter your project name:',
        validate: (v: string) => !!v || 'Project name is required',
      },
    ]);
    return value;
  }

  // ------------------- SUCCESS MESSAGE -------------------
  private buildSuccessMessage(
    name: string,
    targetDir: string,
    installDeps: boolean,
  ) {
    const lines = [
      `✅ Angular project '${name}' scaffolded successfully!`,
      '',
      `📁 Location: ${targetDir}`,
      `🔧 MCP Configuration: Ready`,
      '',
      'Next steps:',
      `  cd ${name}`,
      installDeps ? '  npm start' : '  npm install\n  npm start',
      '',
      '💡 Open in Claude or Copilot for AI-assisted development!',
    ];

    return lines.join('\n');
  }
}
