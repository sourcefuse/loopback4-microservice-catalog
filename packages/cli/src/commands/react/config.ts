// Copyright (c) 2023 Sourcefuse Technologies
// Released under the MIT License.
// https://opensource.org/licenses/MIT

import {flags} from '@oclif/command';
import {IConfig} from '@oclif/config';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import Base from '../../command-base';
import {AnyObject, PromptFunction} from '../../types';
import {FileGenerator} from '../../utilities/file-generator';

export class ReactConfig extends Base<{}> {
  private readonly fileGenerator = new FileGenerator();

  static readonly description = 'Update React environment configuration';
  static readonly mcpDescription = `
  Updates .env and regenerates public/config.json using configGenerator.js.
  Supports keys: clientId, appApiBaseUrl, authApiBaseUrl, enableSessionTimeout, expiryTimeInMinute, promptTimeBeforeIdleInMinute.
  `;

  static readonly mcpFlags = {
    workingDir: flags.string({description: 'React project root directory'}),
  };

  static readonly flags = {
    help: flags.boolean({description: 'Show manual pages'}),
    clientId: flags.string({description: 'OAuth client ID'}),
    appApiBaseUrl: flags.string({description: 'Application API base URL'}),
    authApiBaseUrl: flags.string({description: 'Authentication API base URL'}),
    enableSessionTimeout: flags.boolean({
      description: 'Enable session timeout',
    }),
    expiryTimeInMinute: flags.string({
      description: 'Session timeout in minutes',
    }),
    promptTimeBeforeIdleInMinute: flags.string({
      description: 'Prompt time before idle in minutes',
    }),
    regenerate: flags.boolean({
      description: 'Regenerate config.json after updating .env',
      default: true,
    }),
  };

  async run(): Promise<void> {
    const {flags: parsedFlags} = this.parse(ReactConfig);
    const result = await this.updateEnvironment(parsedFlags);
    this.log(result);
  }

  static async mcpRun(inputs: AnyObject): Promise<{
    content: {type: 'text'; text: string; isError?: boolean}[];
  }> {
    const cwd = process.cwd();
    try {
      if (inputs.workingDir) process.chdir(inputs.workingDir);
      const instance = new ReactConfig([], {} as IConfig, {} as PromptFunction);
      const result = await instance.updateEnvironment(inputs);
      return {
        content: [{type: 'text' as const, text: result, isError: false}],
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

  // ---------- CORE FUNCTION ----------

  private async updateEnvironment(inputs: AnyObject): Promise<string> {
    const projectRoot = this.fileGenerator['getProjectRoot']();
    const envPath = path.join(projectRoot, '.env');

    this.createDefaultEnvIfMissing(envPath);

    const envContent = fs.readFileSync(envPath, 'utf-8');
    const {updatedContent, updates} = this.mergeEnvChanges(envContent, inputs);

    fs.writeFileSync(envPath, updatedContent, 'utf-8');

    if (inputs.regenerate) {
      const regenMsg = this.tryRegenerateConfig(projectRoot);
      if (regenMsg) updates.push(regenMsg);
    }

    if (!updates.length) return '⚠️ No environment variables changed.';
    const items = updates.map(u => '  - ' + u).join('\n');
    return `✅ Updated environment configuration:\n${items}\n\nFile: ${envPath}\n`;
  }

  // ---------- HELPERS ----------

  private createDefaultEnvIfMissing(envPath: string): void {
    if (fs.existsSync(envPath)) return;
    const defaults = [
      'CLIENT_ID=dev-client-id',
      'APP_API_BASE_URL=https://api.example.com',
      'AUTH_API_BASE_URL=https://auth.example.com',
      'ENABLE_SESSION_TIMEOUT=true',
      'EXPIRY_TIME_IN_MINUTE=30',
      'PROMPT_TIME_BEFORE_IDLE_IN_MINUTE=5',
    ].join('\n');
    fs.writeFileSync(envPath, `${defaults}\n`, 'utf-8');
  }

  private mergeEnvChanges(
    envContent: string,
    inputs: AnyObject,
  ): {updatedContent: string; updates: string[]} {
    let updated = envContent;
    const updates: string[] = [];

    const mappings: Record<string, string | boolean | undefined> = {
      CLIENT_ID: inputs.clientId,
      APP_API_BASE_URL: inputs.appApiBaseUrl,
      AUTH_API_BASE_URL: inputs.authApiBaseUrl,
      ENABLE_SESSION_TIMEOUT: inputs.enableSessionTimeout,
      EXPIRY_TIME_IN_MINUTE: inputs.expiryTimeInMinute,
      PROMPT_TIME_BEFORE_IDLE_IN_MINUTE: inputs.promptTimeBeforeIdleInMinute,
    };

    for (const [key, val] of Object.entries(mappings)) {
      if (val === undefined || val === null) continue;
      const value = String(val);
      const pattern = new RegExp(`^${key}=.*$`, 'm');
      updated = pattern.test(updated)
        ? updated.replace(pattern, `${key}=${value}`)
        : `${updated.trim()}\n${key}=${value}\n`;
      updates.push(`${key}=${value}`);
    }

    return {updatedContent: updated, updates};
  }

  private tryRegenerateConfig(projectRoot: string): string | null {
    const genPath = path.join(projectRoot, 'configGenerator.js');
    const tmplPath = path.join(projectRoot, 'config.template.json');

    if (!fs.existsSync(genPath))
      return '⚠️ configGenerator.js not found — skipped regeneration';
    if (!fs.existsSync(tmplPath))
      return '⚠️ config.template.json not found — skipped regeneration';

    const result = spawnSync(
      'node',
      [
        genPath,
        '--templateFileName=config.template.json',
        '--outConfigPath=./public',
      ],
      {cwd: projectRoot, stdio: 'inherit'},
    ); // NOSONAR - CLI spawn required

    if (result.status === 0)
      return '✅ Regenerated config.json in public directory';
    throw new Error(`configGenerator.js exited with status ${result.status}`);
  }
}
