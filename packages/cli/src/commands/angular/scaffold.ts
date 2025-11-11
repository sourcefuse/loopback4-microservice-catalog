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

export class AngularScaffold extends Base<{}> {
  private readonly templateFetcher = new TemplateFetcher();
  private readonly mcpInjector = new McpConfigInjector();
  private readonly fileGen = new FileGenerator();

  static readonly description =
    'Scaffold a new Angular project from ARC boilerplate';
  static readonly mcpDescription =
    'Creates a new Angular project using ARC boilerplate with configurable modules and MCP integration.';

  static readonly flags = {
    help: flags.boolean({description: 'Show manual pages'}),
    withAuth: flags.boolean({
      description: 'Include authentication module',
      default: true,
    }),
    withThemes: flags.boolean({
      description: 'Include theme system',
      default: true,
    }),
    withBreadcrumbs: flags.boolean({
      description: 'Include breadcrumb navigation',
      default: true,
    }),
    withI18n: flags.boolean({
      description: 'Include internationalization',
      default: false,
    }),
    templateRepo: flags.string({
      description: 'Template repo (default: sourcefuse/angular-boilerplate)',
      default: 'sourcefuse/angular-boilerplate',
    }),
    templateVersion: flags.string({description: 'Template branch/version'}),
    installDeps: flags.boolean({
      description: 'Install dependencies after scaffold',
      default: false,
    }),
    localPath: flags.string({
      description: 'Local template path (for development)',
    }),
  };

  static readonly mcpFlags = {
    workingDir: flags.string({
      description: 'Working directory for scaffolding',
    }),
  };

  static readonly args = [{name: 'name', description: 'Project name'}];

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

      const result = await instance.scaffoldProject(inputs);

      return {
        content: [
          {
            type: 'text' as const, // ✅ literal type, not generic string
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

  // ---------- MAIN LOGIC ----------
  private async scaffoldProject(inputs: AnyObject): Promise<string> {
    const {name, templateRepo, templateVersion, installDeps, localPath} =
      inputs;
    const targetDir = path.join(process.cwd(), name);

    console.log(`\n📦 Scaffolding Angular project '${name}'...`); // NOSONAR - user feedback

    await this.templateFetcher.smartFetch({
      repo: templateRepo,
      targetDir,
      branch: templateVersion,
      localPath,
    });

    const {includedModules, removedModules} = this.configureModules(
      targetDir,
      inputs,
    );

    this.mcpInjector.injectConfig(targetDir, 'angular');
    this.fileGen.updatePackageJson(targetDir, name);
    if (installDeps) this.fileGen.installDependencies(targetDir);

    return this.buildSuccessMessage(
      name,
      targetDir,
      includedModules,
      removedModules,
      installDeps,
    );
  }

  // ---------- PROMPTS ----------
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

  // ---------- MODULE CONFIGURATION ----------
  private configureModules(
    targetDir: string,
    inputs: AnyObject,
  ): {includedModules: string[]; removedModules: string[]} {
    const modules = [
      {flag: inputs.withAuth, label: 'Authentication', dir: 'auth'},
      {flag: inputs.withThemes, label: 'Themes', dir: 'themes'},
      {flag: inputs.withBreadcrumbs, label: 'Breadcrumbs', dir: 'breadcrumbs'},
    ];

    const includedModules: string[] = [];
    const removedModules: string[] = [];

    modules.forEach(({flag, label, dir}) => {
      if (flag) includedModules.push(label);
      else {
        this.fileGen.removeModule(targetDir, dir);
        removedModules.push(label);
      }
    });

    if (inputs.withI18n) includedModules.push('Internationalization');
    return {includedModules, removedModules};
  }

  // ---------- SUCCESS MESSAGE ----------
  private buildSuccessMessage(
    name: string,
    targetDir: string,
    included: string[],
    removed: string[],
    installDeps: boolean,
  ): string {
    const lines = [
      `✅ Angular project '${name}' scaffolded successfully!`,
      '',
      `📁 Location: ${targetDir}`,
      `🔧 MCP Configuration: ✅ Ready for AI assistance`,
    ];

    if (included.length)
      lines.push(`📦 Modules included: ${included.join(', ')}`);
    if (removed.length)
      lines.push(`🗑️  Modules removed: ${removed.join(', ')}`);

    lines.push(
      '',
      'Next steps:',
      `  cd ${name}`,
      installDeps ? '  npm start' : '  npm install\n  npm start',
      '',
      '💡 Open in Claude Code for AI-powered development!',
    );

    return lines.join('\n');
  }
}
