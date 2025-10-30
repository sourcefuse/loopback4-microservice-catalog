// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {flags} from '@oclif/command';
import {IConfig} from '@oclif/config';
import {execSync} from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import Base from '../../command-base';
import {AnyObject, PromptFunction} from '../../types';
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
    const {flags: parsedFlags} = this.parse(AngularInfo);
    const inputs = {...parsedFlags};

    const result = await this.getProjectInfo(inputs);
    this.log(result);
  }

  static async mcpRun(inputs: AnyObject) {
    const originalCwd = process.cwd();
    if (inputs.workingDir) {
      process.chdir(inputs.workingDir);
    }

    try {
      const infoGatherer = new AngularInfo([], {} as unknown as IConfig, {} as unknown as PromptFunction);
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

    const packageJson = this.loadPackageJson(projectRoot);
    let info = this.buildBasicInfo(packageJson);

    info += this.getEnvironmentInfo();
    info += this.getKeyDependencies(packageJson);
    info += this.getScripts(packageJson);

    if (detailed) {
      info += this.getDetailedStatistics(projectRoot);
    }

    info += this.getConfigurationFiles(projectRoot);
    info += this.getMcpConfiguration(projectRoot);

    return info;
  }

  private loadPackageJson(projectRoot: string): AnyObject {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json not found. Is this an Angular project?');
    }
    return JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  }

  private buildBasicInfo(packageJson: AnyObject): string {
    return `
📦 Angular Project Information
═══════════════════════════════

Project: ${packageJson.name || 'N/A'}
Version: ${packageJson.version || 'N/A'}
Description: ${packageJson.description || 'N/A'}

`;
  }

  private getEnvironmentInfo(): string {
    try {
      // sonar-ignore: Using system PATH is required for CLI tool execution
      const nodeVersion = execSync('node --version', {encoding: 'utf-8'}).trim();
      // sonar-ignore: Using system PATH is required for CLI tool execution
      const npmVersion = execSync('npm --version', {encoding: 'utf-8'}).trim();
      return `🔧 Environment
───────────────
Node: ${nodeVersion}
NPM: ${npmVersion}

`;
    } catch (err) {
      // Node/NPM not available - return empty string
      return '';
    }
  }

  private getKeyDependencies(packageJson: AnyObject): string {
    let info = `📚 Key Dependencies
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

    for (const dep of keyDeps) {
      if (allDeps[dep]) {
        info += `${dep}: ${allDeps[dep]}\n`;
      }
    }

    return info;
  }

  private getScripts(packageJson: AnyObject): string {
    if (!packageJson.scripts) {
      return '';
    }

    let info = `\n⚡ Available Scripts
──────────────────
`;
    const scripts = Object.keys(packageJson.scripts).slice(0, 10);
    for (const script of scripts) {
      info += `${script}: ${packageJson.scripts[script]}\n`;
    }

    return info;
  }

  private getDetailedStatistics(projectRoot: string): string {
    const stats = this.getProjectStatistics(projectRoot);
    return `\n📊 Project Statistics
────────────────────
${stats}
`;
  }

  private getConfigurationFiles(projectRoot: string): string {
    const configFiles = [
      'angular.json',
      'tsconfig.json',
      'karma.conf.js',
      '.eslintrc.json',
    ];

    let info = `\n📄 Configuration Files
──────────────────────
`;
    for (const file of configFiles) {
      const filePath = path.join(projectRoot, file);
      info += `${file}: ${fs.existsSync(filePath) ? '✅' : '❌'}\n`;
    }

    return info;
  }

  private getMcpConfiguration(projectRoot: string): string {
    const mcpConfigPath = path.join(projectRoot, '.claude', 'mcp.json');
    const isConfigured = fs.existsSync(mcpConfigPath);

    let info = `\n🤖 MCP Configuration
───────────────────
Status: ${isConfigured ? '✅ Configured' : '❌ Not configured'}
`;

    if (isConfigured) {
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

    try {
      return this.gatherArtifactStatistics(srcPath);
    } catch (err) {
      return 'Unable to gather statistics';
    }
  }

  private gatherArtifactStatistics(srcPath: string): string {
    const artifactTypes = [
      {extension: '.component.ts', label: 'Components'},
      {extension: '.service.ts', label: 'Services'},
      {extension: '.module.ts', label: 'Modules'},
      {extension: '.directive.ts', label: 'Directives'},
      {extension: '.pipe.ts', label: 'Pipes'},
    ];

    return artifactTypes
      .map(({extension, label}) => {
        const count = this.countFiles(srcPath, extension);
        return `${label}: ${count}`;
      })
      .join('\n');
  }

  private countFiles(dir: string, extension: string): number {
    let count = 0;

    const walk = (directory: string) => {
      try {
        const files = fs.readdirSync(directory);
        for (const file of files) {
          const filePath = path.join(directory, file);
          const stats = fs.statSync(filePath);

          if (stats.isDirectory()) {
            walk(filePath);
          } else if (file.endsWith(extension)) {
            count++;
          } else {
            // Not a directory and doesn't match extension - skip
          }
        }
      } catch (err) {
        // Directory not accessible - skip it
      }
    };

    walk(dir);
    return count;
  }
}
