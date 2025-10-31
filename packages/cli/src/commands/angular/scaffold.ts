// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
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
  private templateFetcher = new TemplateFetcher();
  private mcpInjector = new McpConfigInjector();
  private fileGenerator = new FileGenerator();

  static readonly description =
    'Scaffold a new Angular project from ARC boilerplate';

  static readonly mcpDescription = `
    Use this command to scaffold a new Angular project using the ARC boilerplate.
    The boilerplate includes best practices, Nebular UI, multi-project workspace, and more.

    Features you can enable/disable:
    - Authentication module (--with-auth)
    - Theme system (--with-themes)
    - Breadcrumb navigation (--with-breadcrumbs)
    - Internationalization (--with-i18n)

    The scaffolded project will automatically include MCP configuration for AI assistance.

    Examples:
    - Basic scaffold: name=my-app
    - Full-featured: name=my-app, withAuth=true, withThemes=true, installDeps=true
    - Custom template: name=my-app, templateRepo=myorg/custom-angular
  `;

  static readonly mcpFlags = {
    workingDir: flags.string({
      name: 'workingDir',
      description: 'Working directory for scaffolding',
      required: false,
    }),
  };

  static readonly flags = {
    help: flags.boolean({
      name: 'help',
      description: 'Show manual pages',
      type: 'boolean',
    }),
    withAuth: flags.boolean({
      name: 'withAuth',
      description: 'Include authentication module',
      required: false,
      default: true,
    }),
    withThemes: flags.boolean({
      name: 'withThemes',
      description: 'Include theme system',
      required: false,
      default: true,
    }),
    withBreadcrumbs: flags.boolean({
      name: 'withBreadcrumbs',
      description: 'Include breadcrumb navigation',
      required: false,
      default: true,
    }),
    withI18n: flags.boolean({
      name: 'withI18n',
      description: 'Include internationalization',
      required: false,
      default: false,
    }),
    templateRepo: flags.string({
      name: 'templateRepo',
      description: 'Custom template repository (e.g., sourcefuse/angular-boilerplate)',
      required: false,
      default: 'sourcefuse/angular-boilerplate',
    }),
    templateVersion: flags.string({
      name: 'templateVersion',
      description: 'Template version/branch to use',
      required: false,
    }),
    installDeps: flags.boolean({
      name: 'installDeps',
      description: 'Install dependencies after scaffolding',
      required: false,
      default: false,
    }),
    localPath: flags.string({
      name: 'localPath',
      description: 'Local path to template (for development)',
      required: false,
    }),
  };

  static readonly args = [
    {
      name: 'name',
      description: 'Name of the project',
      required: false,
    },
  ];

  async run() {
    const parsed = this.parse(AngularScaffold);
    const name = parsed.args.name;
    const inputs = {name, ...parsed.flags};

    if (!inputs.name) {
      const answer = await this.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'What is the name of your project?',
          validate: (input: string) =>
            input.length > 0 || 'Name is required',
        },
      ]);
      inputs.name = answer.name;
    }

    const result = await this.scaffoldProject(inputs);
    this.log(result);
  }

  static async mcpRun(inputs: AnyObject) {
    const originalCwd = process.cwd();
    if (inputs.workingDir) {
      process.chdir(inputs.workingDir);
    }

    try {
      const scaffolder = new AngularScaffold([], {} as unknown as IConfig, {} as unknown as PromptFunction);
      const result = await scaffolder.scaffoldProject(inputs);
      process.chdir(originalCwd);
      return {
        content: [{type: 'text' as const, text: result, isError: false}],
      };
    } catch (err) {
      process.chdir(originalCwd);
      return {
        content: [
          {
            type: 'text' as const,
            text: `Error: ${err instanceof Error ? err.message : err}`,
            isError: true,
          },
        ],
      };
    }
  }

  private configureModules(
    targetDir: string,
    inputs: AnyObject,
  ): {includedModules: string[]; removedModules: string[]} {
    const includedModules: string[] = [];
    const removedModules: string[] = [];

    const moduleConfigs = [
      {flag: inputs.withAuth, name: 'Authentication', module: 'auth'},
      {flag: inputs.withThemes, name: 'Themes', module: 'themes'},
      {
        flag: inputs.withBreadcrumbs,
        name: 'Breadcrumbs',
        module: 'breadcrumbs',
      },
    ];

    for (const {flag, name, module} of moduleConfigs) {
      if (flag === false) {
        this.fileGenerator.removeModule(targetDir, module);
        removedModules.push(name);
      } else {
        includedModules.push(name);
      }
    }

    if (inputs.withI18n) {
      includedModules.push('Internationalization');
    }

    return {includedModules, removedModules};
  }

  private buildSuccessMessage(
    name: string,
    targetDir: string,
    includedModules: string[],
    removedModules: string[],
    installDeps: boolean,
  ): string {
    let result = `
✅ Angular project '${name}' scaffolded successfully!

📁 Location: ${targetDir}
🔧 MCP Configuration: ✅ Ready for AI assistance
`;

    if (includedModules.length > 0) {
      result += `📦 Modules included: ${includedModules.join(', ')}\n`;
    }

    if (removedModules.length > 0) {
      result += `🗑️  Modules removed: ${removedModules.join(', ')}\n`;
    }

    result += `
Next steps:
  cd ${name}
  ${installDeps ? '' : 'npm install\n  '}npm start

💡 Open in Claude Code for AI-powered development!
`;

    return result;
  }

  private async scaffoldProject(inputs: AnyObject): Promise<string> {
    const {name, templateRepo, templateVersion, installDeps, localPath} =
      inputs;

    const targetDir = path.join(process.cwd(), name);

    // Step 1: Fetch template
    // sonar-ignore: User feedback console statement
    console.log(`\n📦 Scaffolding Angular project '${name}'...`);
    await this.templateFetcher.smartFetch({
      repo: templateRepo,
      targetDir,
      branch: templateVersion,
      localPath,
    });

    // Step 2: Configure modular features
    const {includedModules, removedModules} = this.configureModules(
      targetDir,
      inputs,
    );

    // Step 3: Inject MCP configuration
    this.mcpInjector.injectConfig(targetDir, 'angular');

    // Step 4: Update package.json
    this.fileGenerator.updatePackageJson(targetDir, name);

    // Step 5: Install dependencies
    if (installDeps) {
      this.fileGenerator.installDependencies(targetDir);
    }

    // Build success message
    return this.buildSuccessMessage(
      name,
      targetDir,
      includedModules,
      removedModules,
      installDeps,
    );
  }
}
