// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {flags} from '@oclif/command';
import * as path from 'path';
import Base from '../../command-base';
import {AnyObject} from '../../types';
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
      const scaffolder = new AngularScaffold([], {} as any, {} as any);
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

  private async scaffoldProject(inputs: AnyObject): Promise<string> {
    const {
      name,
      withAuth,
      withThemes,
      withBreadcrumbs,
      withI18n,
      templateRepo,
      templateVersion,
      installDeps,
      localPath,
    } = inputs;

    const targetDir = path.join(process.cwd(), name);

    // Step 1: Fetch template
    console.log(`\n📦 Scaffolding Angular project '${name}'...`);
    await this.templateFetcher.smartFetch({
      repo: templateRepo,
      targetDir,
      branch: templateVersion,
      localPath,
    });

    // Step 2: Configure modular features
    const includedModules: string[] = [];
    const removedModules: string[] = [];

    if (!withAuth) {
      this.fileGenerator.removeModule(targetDir, 'auth');
      removedModules.push('Authentication');
    } else {
      includedModules.push('Authentication');
    }

    if (!withThemes) {
      this.fileGenerator.removeModule(targetDir, 'themes');
      removedModules.push('Themes');
    } else {
      includedModules.push('Themes');
    }

    if (!withBreadcrumbs) {
      this.fileGenerator.removeModule(targetDir, 'breadcrumbs');
      removedModules.push('Breadcrumbs');
    } else {
      includedModules.push('Breadcrumbs');
    }

    if (withI18n) {
      includedModules.push('Internationalization');
    }

    // Step 3: Inject MCP configuration
    this.mcpInjector.injectConfig(targetDir, 'angular');

    // Step 4: Update package.json
    this.fileGenerator.updatePackageJson(targetDir, name);

    // Step 5: Install dependencies
    if (installDeps) {
      this.fileGenerator.installDependencies(targetDir);
    }

    // Build success message
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
}
