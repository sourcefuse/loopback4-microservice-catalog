// Copyright (c) 2023 Sourcefuse Technologies
// Released under the MIT License.
// https://opensource.org/licenses/MIT

import {flags} from '@oclif/command';
import {IConfig} from '@oclif/config';
import {execSync} from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import Base from '../../command-base';
import {AnyObject, PromptFunction} from '../../types';
import {FileGenerator} from '../../utilities/file-generator';

/**
 * Displays detailed information about a React project.
 */
export class ReactInfo extends Base<{}> {
  private readonly fileGenerator = new FileGenerator();

  static readonly description =
    'Display React project information and statistics';
  static readonly mcpDescription =
    'Provides project details: name, version, dependencies, scripts, environment, and structure statistics.';

  static readonly flags = {
    help: flags.boolean({description: 'Show manual pages'}),
    detailed: flags.boolean({
      description: 'Show detailed project statistics',
      default: false,
    }),
  };

  static readonly mcpFlags = {
    workingDir: flags.string({description: 'React project root directory'}),
  };

  async run(): Promise<void> {
    const {flags: opts} = this.parse(ReactInfo);
    const info = await this.getProjectInfo(opts);
    this.log(info);
  }

  // ✅ FIXED: Proper MCP return type and 'text' literal
  static async mcpRun(inputs: AnyObject): Promise<{
    content: {type: 'text'; text: string; isError?: boolean}[];
  }> {
    const cwd = process.cwd();
    try {
      if (inputs.workingDir) process.chdir(inputs.workingDir);
      const info = await new ReactInfo(
        [],
        {} as IConfig,
        {} as PromptFunction,
      ).getProjectInfo(inputs);
      return {
        content: [{type: 'text' as const, text: info, isError: false}],
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        content: [
          {type: 'text' as const, text: `Error: ${msg}`, isError: true},
        ],
      };
    } finally {
      process.chdir(cwd);
    }
  }

  // ---------- CORE LOGIC ----------

  private async getProjectInfo(inputs: AnyObject): Promise<string> {
    const projectRoot = this.fileGenerator['getProjectRoot']();
    const pkg = this.loadJson(
      path.join(projectRoot, 'package.json'),
      'package.json not found',
    );
    const sections = [
      this.section('📦 Project Info', this.projectInfo(pkg)),
      this.section('🔧 Environment', this.environmentInfo()),
      this.section('📚 Key Dependencies', this.dependencies(pkg)),
      this.section('⚡ Scripts', this.scripts(pkg)),
      this.section('📄 Configuration Files', this.configFiles(projectRoot)),
      this.section('🤖 MCP Configuration', this.mcpConfig(projectRoot)),
    ];

    if (inputs.detailed) {
      sections.push(
        this.section('📊 Project Statistics', this.statistics(projectRoot)),
      );
    }

    return sections.filter(Boolean).join('\n\n');
  }

  // ---------- HELPERS ----------

  private section(title: string, content: string): string {
    return content ? `${title}\n${'─'.repeat(title.length)}\n${content}` : '';
  }

  private loadJson(filePath: string, errorMsg?: string): AnyObject {
    if (!fs.existsSync(filePath))
      throw new Error(errorMsg ?? `Missing file: ${filePath}`);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  private projectInfo(pkg: AnyObject): string {
    return `Name: ${pkg.name ?? 'N/A'}\nVersion: ${
      pkg.version ?? 'N/A'
    }\nDescription: ${pkg.description ?? 'N/A'}`;
  }

  private environmentInfo(): string {
    try {
      const node = execSync('node --version', {encoding: 'utf-8'}).trim(); // NOSONAR
      const npm = execSync('npm --version', {encoding: 'utf-8'}).trim(); // NOSONAR
      return `Node: ${node}\nNPM: ${npm}`;
    } catch {
      return 'Node/NPM environment unavailable';
    }
  }

  private dependencies(pkg: AnyObject): string {
    const deps = {...pkg.dependencies, ...pkg.devDependencies};
    const keys = [
      'react',
      'react-dom',
      'typescript',
      '@mui/material',
      '@reduxjs/toolkit',
      'react-redux',
      'react-router-dom',
      'vite',
    ];
    return (
      keys
        .filter(d => deps[d])
        .map(d => `${d}: ${deps[d]}`)
        .join('\n') ?? 'No key dependencies found'
    );
  }

  private scripts(pkg: AnyObject): string {
    const scripts = pkg.scripts ? Object.entries(pkg.scripts).slice(0, 10) : [];
    return scripts.length
      ? scripts.map(([k, v]) => `${k}: ${v}`).join('\n')
      : 'No npm scripts found';
  }

  private configFiles(root: string): string {
    const files = [
      'vite.config.ts',
      'tsconfig.json',
      '.env',
      'config.template.json',
    ];
    return files
      .map(f => `${f}: ${fs.existsSync(path.join(root, f)) ? '✅' : '❌'}`)
      .join('\n');
  }

  private mcpConfig(root: string): string {
    const file = path.join(root, '.claude', 'mcp.json');
    return fs.existsSync(file)
      ? `Status: ✅ Configured\nLocation: .claude/mcp.json`
      : 'Status: ❌ Not configured';
  }

  private statistics(root: string): string {
    const src = path.join(root, 'src');
    if (!fs.existsSync(src)) return 'Source directory not found';

    const dirs = {
      Components: this.countDirs(path.join(src, 'Components')),
      Pages: this.countDirs(path.join(src, 'Pages')),
      Providers: this.countDirs(path.join(src, 'Providers')),
    };

    const hooks = this.countFiles(path.join(src, 'Hooks'), '.ts');
    const slices = this.countFiles(path.join(src, 'redux'), 'Slice.ts');

    return [
      `Components: ${dirs.Components}`,
      `Pages: ${dirs.Pages}`,
      `Contexts: ${dirs.Providers}`,
      `Hooks: ${hooks}`,
      `Redux Slices: ${slices}`,
    ].join('\n');
  }

  private countFiles(dir: string, ext: string): number {
    if (!fs.existsSync(dir)) return 0;
    let count = 0;
    const traverse = (d: string): void => {
      for (const item of fs.readdirSync(d)) {
        const p = path.join(d, item);
        const stat = fs.statSync(p);
        if (stat.isDirectory()) traverse(p);
        else if (p.endsWith(ext)) count++;
        else continue;
      }
    };
    traverse(dir);
    return count;
  }

  private countDirs(dir: string): number {
    if (!fs.existsSync(dir)) return 0;
    return fs
      .readdirSync(dir)
      .filter(i => fs.statSync(path.join(dir, i)).isDirectory()).length;
  }
}
