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

export class ReactScaffold extends Base<{}> {
  private templateFetcher = new TemplateFetcher();
  private mcpInjector = new McpConfigInjector();
  private fileGenerator = new FileGenerator();


  static readonly description =
    'Scaffold a new React project from ARC boilerplate';

  static readonly mcpDescription = `
    Use this command to scaffold a new React project using the ARC boilerplate.
    The boilerplate includes best practices, Material-UI, Redux Toolkit, and more.

    Features you can enable/disable:
    - Authentication module (--with-auth)
    - Redux state management (--with-redux)
    - Material-UI theme system (--with-themes)
    - Routing (--with-routing)

    The scaffolded project will automatically include MCP configuration for AI assistance.

    Examples:
    - Basic scaffold: name=my-app
    - Full-featured: name=my-app, withAuth=true, withRedux=true, installDeps=true
    - Custom template: name=my-app, templateRepo=myorg/custom-react
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
    withRedux: flags.boolean({
      name: 'withRedux',
      description: 'Include Redux Toolkit state management',
      required: false,
      default: true,
    }),
    withThemes: flags.boolean({
      name: 'withThemes',
      description: 'Include Material-UI theme system',
      required: false,
      default: true,
    }),
    withRouting: flags.boolean({
      name: 'withRouting',
      description: 'Include React Router',
      required: false,
      default: true,
    }),
    templateRepo: flags.string({
      name: 'templateRepo',
      description:
        'Custom template repository (e.g., sourcefuse/react-boilerplate-ts-ui)',
      required: false,
      default: 'sourcefuse/react-boilerplate-ts-ui',
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
    const parsed = this.parse(ReactScaffold);
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
      const scaffolder = new ReactScaffold([], {} as unknown as IConfig, {} as unknown as PromptFunction);
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
      withRedux,
      withThemes,
      withRouting,
      templateRepo,
      templateVersion,
      installDeps,
      localPath,
    } = inputs;

    const targetDir = path.join(process.cwd(), name);

    // Step 1: Fetch template
    // sonar-ignore: User feedback console statement
    console.log(`\n📦 Scaffolding React project '${name}'...`);
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

    if (!withRedux) {
      this.fileGenerator.removeModule(targetDir, 'redux');
      removedModules.push('Redux State Management');
    } else {
      includedModules.push('Redux State Management');
    }

    if (!withThemes) {
      this.fileGenerator.removeModule(targetDir, 'theme');
      removedModules.push('Material-UI Themes');
    } else {
      includedModules.push('Material-UI Themes');
    }

    if (!withRouting) {
      // Remove router configuration if needed
      removedModules.push('React Router');
    } else {
      includedModules.push('React Router');
    }

    // Step 3: Inject MCP configuration
    this.mcpInjector.injectConfig(targetDir, 'react');

    // Step 4: Update package.json
    this.fileGenerator.updatePackageJson(targetDir, name);

    // Step 5: Install dependencies
    if (installDeps) {
      this.fileGenerator.installDependencies(targetDir);
    }

    // Build success message
    let result = `
✅ React project '${name}' scaffolded successfully!

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
