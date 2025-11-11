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

export class AngularInfo extends Base<{}> {
  private readonly fileGen = new FileGenerator();

  static readonly description =
    'Display Angular project information and statistics';
  static readonly mcpDescription =
    'Displays project details, environment info, dependencies, scripts, and statistics for Angular projects.';

  static readonly flags = {
    help: flags.boolean({description: 'Show manual pages'}),
    detailed: flags.boolean({
      description: 'Show detailed statistics',
      default: false,
    }),
  };

  static readonly mcpFlags = {
    workingDir: flags.string({description: 'Path to Angular project root'}),
  };

  async run(): Promise<void> {
    const {flags: parsedFlags} = this.parse(AngularInfo);
    const output = await this.buildReport(parsedFlags);
    this.log(output);
  }

  static async mcpRun(inputs: AnyObject): Promise<{
    content: {type: 'text'; text: string; isError?: boolean}[];
  }> {
    const cwd = process.cwd();
    try {
      if (inputs.workingDir) process.chdir(inputs.workingDir);
      const instance = new AngularInfo([], {} as IConfig, {} as PromptFunction);
      const result = await instance.buildReport(inputs);

      return {
        content: [
          {
            type: 'text' as const, // ✅ literal type
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

  // ---------- MAIN REPORT BUILDER ----------
  private async buildReport(inputs: AnyObject): Promise<string> {
    const root = this.fileGen['getProjectRoot']();
    const pkg = this.loadPackageJson(root);

    const sections = [
      this.section('📦 Project Information', this.basicInfo(pkg)),
      this.section('🔧 Environment', this.environmentInfo()),
      this.section('📚 Key Dependencies', this.dependencies(pkg)),
      this.section('⚡ Scripts', this.scripts(pkg)),
      inputs.detailed
        ? this.section('📊 Project Statistics', this.statistics(root))
        : '',
      this.section('📄 Configuration Files', this.configFiles(root)),
      this.section('🤖 MCP Configuration', this.mcpConfig(root)),
    ];

    return sections.filter(Boolean).join('\n\n');
  }

  // ---------- SECTIONS ----------
  private section(title: string, body: string): string {
    return body ? `${title}\n${'─'.repeat(title.length)}\n${body.trim()}` : '';
  }

  private loadPackageJson(root: string): AnyObject {
    const pkgPath = path.join(root, 'package.json');
    if (!fs.existsSync(pkgPath)) throw new Error('package.json not found.');
    return JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  }

  private basicInfo(pkg: AnyObject): string {
    return `Name: ${pkg.name ?? 'N/A'}\nVersion: ${pkg.version ?? 'N/A'}\nDescription: ${
      pkg.description ?? 'N/A'
    }`;
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
    const deps = {...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {})};
    const keys = [
      '@angular/core',
      '@angular/cli',
      'typescript',
      '@nebular/theme',
      'rxjs',
    ];
    const found = keys.filter(k => deps[k]).map(k => `${k}: ${deps[k]}`);
    return found.length ? found.join('\n') : 'No key dependencies found';
  }

  private scripts(pkg: AnyObject): string {
    if (!pkg.scripts) return 'No npm scripts found';
    return Object.entries(pkg.scripts)
      .slice(0, 10)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
  }

  private configFiles(root: string): string {
    const files = [
      'angular.json',
      'tsconfig.json',
      'karma.conf.js',
      '.eslintrc.json',
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
    const src = path.join(root, 'projects', 'arc', 'src');
    if (!fs.existsSync(src)) return 'Source directory not found';
    const exts = [
      {ext: '.component.ts', label: 'Components'},
      {ext: '.service.ts', label: 'Services'},
      {ext: '.module.ts', label: 'Modules'},
      {ext: '.directive.ts', label: 'Directives'},
      {ext: '.pipe.ts', label: 'Pipes'},
    ];
    return exts
      .map(e => `${e.label}: ${this.countFiles(src, e.ext)}`)
      .join('\n');
  }

  // ---------- UTILITY ----------
  private countFiles(dir: string, ext: string): number {
    let count = 0;
    const walk = (d: string) => {
      for (const entry of fs.readdirSync(d)) {
        const p = path.join(d, entry);
        const stat = fs.statSync(p);
        if (stat.isDirectory()) walk(p);
        else if (p.endsWith(ext)) count++;
        else continue;
      }
    };
    try {
      walk(dir);
    } catch {
      return 0;
    }
    return count;
  }
}
