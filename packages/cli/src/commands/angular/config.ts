// Copyright (c) 2023 Sourcefuse Technologies
// Released under the MIT License.
// https://opensource.org/licenses/MIT

import {flags} from '@oclif/command';
import {IConfig} from '@oclif/config';
import fs from 'node:fs';
import path from 'node:path';
import Base from '../../command-base';
import {AnyObject, PromptFunction} from '../../types';
import {FileGenerator} from '../../utilities/file-generator';

export class AngularConfig extends Base<{}> {
  private readonly fileGen = new FileGenerator();

  static readonly description =
    'Update Angular environment configuration files';
  static readonly mcpDescription =
    'Updates Angular environment.ts files across environments (dev, prod, staging) with provided API, auth, and client settings.';

  static readonly mcpFlags = {
    workingDir: flags.string({description: 'Angular project root directory'}),
  };

  static readonly flags = {
    help: flags.boolean({description: 'Show manual pages'}),
    environment: flags.enum({
      description: 'Environment to update',
      options: ['development', 'production', 'staging'],
      default: 'development',
    }),
    apiUrl: flags.string({description: 'Base API URL'}),
    authServiceUrl: flags.string({description: 'Authentication service URL'}),
    clientId: flags.string({description: 'OAuth client ID'}),
    publicKey: flags.string({description: 'Public key for authentication'}),
  };

  async run(): Promise<void> {
    const {flags: opts} = this.parse(AngularConfig);
    const result = await this.updateEnvironment(opts);
    this.log(result);
  }

  static async mcpRun(
    inputs: AnyObject,
  ): Promise<{content: {type: 'text'; text: string; isError?: boolean}[]}> {
    const cwd = process.cwd();
    try {
      if (inputs.workingDir) process.chdir(inputs.workingDir);
      const result = await new AngularConfig(
        [],
        {} as IConfig,
        {} as PromptFunction,
      ).updateEnvironment(inputs);
      return {content: [{type: 'text', text: result, isError: false}]};
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {content: [{type: 'text', text: `Error: ${msg}`, isError: true}]};
    } finally {
      process.chdir(cwd);
    }
  }

  // ---------- CORE ----------

  private async updateEnvironment(inputs: AnyObject): Promise<string> {
    const {environment, apiUrl, authServiceUrl, clientId, publicKey} = inputs;
    const root = this.fileGen['getProjectRoot']();

    const envFile = path.join(
      root,
      'projects',
      'arc',
      'src',
      'environments',
      environment === 'development'
        ? 'environment.ts'
        : `environment.${environment}.ts`,
    );

    if (!fs.existsSync(envFile))
      throw new Error(`Environment file not found: ${envFile}`);

    let content = fs.readFileSync(envFile, 'utf-8');
    const updates: string[] = [];

    const changes: Record<string, string | undefined> = {
      baseApiUrl: apiUrl,
      authServiceUrl,
      clientId,
      publicKey,
    };

    for (const [key, val] of Object.entries(changes)) {
      if (val) {
        content = this.setProperty(content, key, val);
        updates.push(`${key}: ${val}`);
      }
    }

    fs.writeFileSync(envFile, content, 'utf-8');

    if (!updates.length) return '⚠️ No configuration changes made.';

    return [
      `✅ Updated ${environment} environment configuration`,
      ...updates.map(u => `  - ${u}`),
      '',
      `File: ${envFile}`,
    ].join('\n');
  }

  // ---------- HELPERS ----------

  private setProperty(content: string, key: string, value: string): string {
    const pattern = new RegExp(
      `(${key}\\s*:\\s*)(['"\`]?)([^'"\`,}\\n]+)(['"\`]?)`,
      'g',
    );

    if (pattern.test(content)) {
      return content.replace(pattern, `$1'${value}'`);
    }

    return content.replace(/};\s*$/, `  ${key}: '${value}',\n};\n`);
  }
}
