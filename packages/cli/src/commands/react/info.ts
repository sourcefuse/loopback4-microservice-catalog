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

export class ReactInfo extends Base<{}> {
  private fileGenerator = new FileGenerator();


  static readonly description =
    'Display React project information and statistics';

  static readonly mcpDescription = `
    Use this command to get comprehensive information about a React project.

    Information provided:
    - Project name, version, description
    - Available npm scripts
    - Key dependencies and versions (React, TypeScript, Material-UI, Redux, etc.)
    - Node/NPM versions
    - Project structure and statistics (components, hooks, pages, slices)
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
      description: 'Path to the React project root directory',
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
    const {flags} = this.parse(ReactInfo);
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
      const infoGatherer = new ReactInfo([], {} as unknown as IConfig, {} as unknown as PromptFunction);
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
      throw new Error('package.json not found. Is this a React project?');
    }
    return JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  }

  private buildBasicInfo(packageJson: AnyObject): string {
    return `
📦 React Project Information
════════════════════════════

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
      'react',
      'react-dom',
      'typescript',
      '@mui/material',
      '@reduxjs/toolkit',
      'react-redux',
      'react-router-dom',
      'vite',
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
      'vite.config.ts',
      'tsconfig.json',
      '.env',
      'config.template.json',
      'configGenerator.js',
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
    const srcPath = path.join(projectRoot, 'src');

    if (!fs.existsSync(srcPath)) {
      return 'Source directory not found';
    }

    let stats = '';

    try {
      // Count components
      const componentsPath = path.join(srcPath, 'Components');
      const componentCount = fs.existsSync(componentsPath)
        ? this.countDirectories(componentsPath)
        : 0;
      stats += `Components: ${componentCount}\n`;

      // Count pages
      const pagesPath = path.join(srcPath, 'Pages');
      const pageCount = fs.existsSync(pagesPath)
        ? this.countDirectories(pagesPath)
        : 0;
      stats += `Pages: ${pageCount}\n`;

      // Count hooks
      const hooksPath = path.join(srcPath, 'Hooks');
      const hookCount = fs.existsSync(hooksPath)
        ? this.countFiles(hooksPath, '.ts')
        : 0;
      stats += `Custom Hooks: ${hookCount}\n`;

      // Count Redux slices
      const reduxPath = path.join(srcPath, 'redux');
      const sliceCount = fs.existsSync(reduxPath)
        ? this.countFiles(reduxPath, 'Slice.ts')
        : 0;
      stats += `Redux Slices: ${sliceCount}\n`;

      // Count contexts
      const providersPath = path.join(srcPath, 'Providers');
      const contextCount = fs.existsSync(providersPath)
        ? this.countDirectories(providersPath)
        : 0;
      stats += `Contexts: ${contextCount}\n`;
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

  private countDirectories(dir: string): number {
    try {
      const items = fs.readdirSync(dir);
      return items.filter(item => {
        const itemPath = path.join(dir, item);
        return fs.statSync(itemPath).isDirectory();
      }).length;
    } catch (err) {
      return 0;
    }
  }
}
