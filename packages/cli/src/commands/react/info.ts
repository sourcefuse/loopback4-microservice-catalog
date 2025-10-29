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
      const infoGatherer = new ReactInfo([], {} as any, {} as any);
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
      throw new Error('package.json not found. Is this a React project?');
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    let info = `
📦 React Project Information
════════════════════════════

Project: ${packageJson.name || 'N/A'}
Version: ${packageJson.version || 'N/A'}
Description: ${packageJson.description || 'N/A'}

`;

    // Node/NPM versions
    try {
      const nodeVersion = execSync('node --version', {
        encoding: 'utf-8',
      }).trim();
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
      'react',
      'react-dom',
      'typescript',
      '@mui/material',
      '@reduxjs/toolkit',
      'react-redux',
      'react-router-dom',
      'vite',
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
      'vite.config.ts',
      'tsconfig.json',
      '.env',
      'config.template.json',
      'configGenerator.js',
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
