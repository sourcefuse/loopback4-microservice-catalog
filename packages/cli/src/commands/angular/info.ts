// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {flags} from '@oclif/command';
import {execSync} from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import Base from '../../command-base';
import {AnyObject} from '../../types';
import {FileGenerator} from '../../utilities/file-generator';

export class AngularInfo extends Base<{}> {
  private fileGenerator = new FileGenerator();

  static readonly description =
    'Display Angular project information and statistics';

  static readonly mcpDescription = `
    Use this command to get comprehensive information about an Angular project.

    Information provided:
    - Project name, version, description
    - Available npm scripts
    - Key dependencies and versions (Angular, TypeScript, etc.)
    - Node/NPM versions
    - Project structure and statistics (components, services, modules)
    - Configuration files

    This is useful for:
    - Understanding project setup
    - Verifying versions
    - Getting project statistics
    - Troubleshooting
  `;

  static readonly mcpFlags = {
    workingDir: flags.string({
      name: 'workingDir',
      description: 'Path to the Angular project root directory',
      required: false,
    }),
  };

  static readonly flags = {
    help: flags.boolean({
      name: 'help',
      description: 'Show manual pages',
      type: 'boolean',
    }),
    detailed: flags.boolean({
      name: 'detailed',
      description: 'Show detailed statistics',
      required: false,
      default: false,
    }),
  };

  static readonly args = [];

  async run() {
    const {flags} = this.parse(AngularInfo);
    const inputs = {...flags};

    const result = await this.getProjectInfo(inputs);
    this.log(result);
  }

  static async mcpRun(inputs: AnyObject) {
    const originalCwd = process.cwd();
    if (inputs.workingDir) {
      process.chdir(inputs.workingDir);
    }

    try {
      const infoGatherer = new AngularInfo([], {} as any, {} as any);
      const result = await infoGatherer.getProjectInfo(inputs);
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

  private async getProjectInfo(inputs: AnyObject): Promise<string> {
    const {detailed} = inputs;
    const projectRoot = this.fileGenerator['getProjectRoot']();

    // Read package.json
    const packageJsonPath = path.join(projectRoot, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json not found. Is this an Angular project?');
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    let info = `
📦 Angular Project Information
═══════════════════════════════

Project: ${packageJson.name || 'N/A'}
Version: ${packageJson.version || 'N/A'}
Description: ${packageJson.description || 'N/A'}

`;

    // Node/NPM versions
    try {
      const nodeVersion = execSync('node --version', {encoding: 'utf-8'}).trim();
      const npmVersion = execSync('npm --version', {encoding: 'utf-8'}).trim();
      info += `🔧 Environment
───────────────
Node: ${nodeVersion}
NPM: ${npmVersion}

`;
    } catch (err) {
      // Ignore if node/npm not available
    }

    // Key dependencies
    info += `📚 Key Dependencies
───────────────────
`;
    const deps = packageJson.dependencies || {};
    const devDeps = packageJson.devDependencies || {};
    const allDeps = {...deps, ...devDeps};

    const keyDeps = [
      '@angular/core',
      '@angular/cli',
      'typescript',
      '@nebular/theme',
      'rxjs',
    ];

    keyDeps.forEach(dep => {
      if (allDeps[dep]) {
        info += `${dep}: ${allDeps[dep]}\n`;
      }
    });

    // Scripts
    if (packageJson.scripts) {
      info += `\n⚡ Available Scripts
──────────────────
`;
      Object.keys(packageJson.scripts)
        .slice(0, 10)
        .forEach(script => {
          info += `${script}: ${packageJson.scripts[script]}\n`;
        });
    }

    // Project statistics (if detailed)
    if (detailed) {
      const stats = this.getProjectStatistics(projectRoot);
      info += `\n📊 Project Statistics
────────────────────
${stats}
`;
    }

    // Configuration files
    const configFiles = [
      'angular.json',
      'tsconfig.json',
      'karma.conf.js',
      '.eslintrc.json',
    ];

    info += `\n📄 Configuration Files
──────────────────────
`;
    configFiles.forEach(file => {
      const filePath = path.join(projectRoot, file);
      info += `${file}: ${fs.existsSync(filePath) ? '✅' : '❌'}\n`;
    });

    // MCP Configuration
    const mcpConfigPath = path.join(projectRoot, '.claude', 'mcp.json');
    info += `\n🤖 MCP Configuration
───────────────────
Status: ${fs.existsSync(mcpConfigPath) ? '✅ Configured' : '❌ Not configured'}
`;

    if (fs.existsSync(mcpConfigPath)) {
      info += `Location: .claude/mcp.json
`;
    }

    return info;
  }

  private getProjectStatistics(projectRoot: string): string {
    const srcPath = path.join(projectRoot, 'projects', 'arc', 'src');

    if (!fs.existsSync(srcPath)) {
      return 'Source directory not found';
    }

    let stats = '';

    try {
      // Count components
      const componentCount = this.countFiles(srcPath, '.component.ts');
      stats += `Components: ${componentCount}\n`;

      // Count services
      const serviceCount = this.countFiles(srcPath, '.service.ts');
      stats += `Services: ${serviceCount}\n`;

      // Count modules
      const moduleCount = this.countFiles(srcPath, '.module.ts');
      stats += `Modules: ${moduleCount}\n`;

      // Count directives
      const directiveCount = this.countFiles(srcPath, '.directive.ts');
      stats += `Directives: ${directiveCount}\n`;

      // Count pipes
      const pipeCount = this.countFiles(srcPath, '.pipe.ts');
      stats += `Pipes: ${pipeCount}\n`;
    } catch (err) {
      stats = 'Unable to gather statistics';
    }

    return stats;
  }

  private countFiles(dir: string, extension: string): number {
    let count = 0;

    const walk = (directory: string) => {
      try {
        const files = fs.readdirSync(directory);
        files.forEach(file => {
          const filePath = path.join(directory, file);
          const stats = fs.statSync(filePath);

          if (stats.isDirectory()) {
            walk(filePath);
          } else if (file.endsWith(extension)) {
            count++;
          }
        });
      } catch (err) {
        // Ignore errors
      }
    };

    walk(dir);
    return count;
  }
}
