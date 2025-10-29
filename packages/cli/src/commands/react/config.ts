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

export class ReactConfig extends Base<{}> {
  private fileGenerator = new FileGenerator();


  static readonly description = 'Update React environment configuration';

  static readonly mcpDescription = `
    Use this command to update React environment configuration.
    Updates .env file and regenerates public/config.json using configGenerator.js.

    Configuration variables:
    - clientId: OAuth client ID
    - appApiBaseUrl: Application API base URL
    - authApiBaseUrl: Authentication API base URL
    - enableSessionTimeout: Enable session timeout (true/false)
    - expiryTimeInMinute: Session timeout in minutes
    - promptTimeBeforeIdleInMinute: Prompt time before idle

    The command will:
    1. Update .env file with new values
    2. Run configGenerator.js to regenerate public/config.json
    3. Use config.template.json for template-based substitution

    Examples:
    - Update API URLs: clientId=prod-123, appApiBaseUrl=https://api.example.com
    - Update session: enableSessionTimeout=true, expiryTimeInMinute=30
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
    clientId: flags.string({
      name: 'clientId',
      description: 'OAuth client ID',
      required: false,
    }),
    appApiBaseUrl: flags.string({
      name: 'appApiBaseUrl',
      description: 'Application API base URL',
      required: false,
    }),
    authApiBaseUrl: flags.string({
      name: 'authApiBaseUrl',
      description: 'Authentication API base URL',
      required: false,
    }),
    enableSessionTimeout: flags.boolean({
      name: 'enableSessionTimeout',
      description: 'Enable session timeout',
      required: false,
    }),
    expiryTimeInMinute: flags.string({
      name: 'expiryTimeInMinute',
      description: 'Session timeout in minutes',
      required: false,
    }),
    promptTimeBeforeIdleInMinute: flags.string({
      name: 'promptTimeBeforeIdleInMinute',
      description: 'Prompt time before idle in minutes',
      required: false,
    }),
    regenerate: flags.boolean({
      name: 'regenerate',
      description: 'Regenerate config.json after updating .env',
      required: false,
      default: true,
    }),
  };

  static readonly args = [];

  async run() {
    const {flags} = this.parse(ReactConfig);
    const inputs = {...flags};

    const result = await this.updateConfig(inputs);
    this.log(result);
  }

  static async mcpRun(inputs: AnyObject) {
    const originalCwd = process.cwd();
    if (inputs.workingDir) {
      process.chdir(inputs.workingDir);
    }

    try {
      const configurer = new ReactConfig([], {} as any, {} as any);
      const result = await configurer.updateConfig(inputs);
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

  private async updateConfig(inputs: AnyObject): Promise<string> {
    const {
      clientId,
      appApiBaseUrl,
      authApiBaseUrl,
      enableSessionTimeout,
      expiryTimeInMinute,
      promptTimeBeforeIdleInMinute,
      regenerate,
    } = inputs;
    const projectRoot = this.fileGenerator['getProjectRoot']();

    const envFilePath = path.join(projectRoot, '.env');

    // Create .env file if it doesn't exist
    if (!fs.existsSync(envFilePath)) {
      const defaultEnv = `CLIENT_ID=dev-client-id
APP_API_BASE_URL=https://api.example.com
AUTH_API_BASE_URL=https://auth.example.com
ENABLE_SESSION_TIMEOUT=true
EXPIRY_TIME_IN_MINUTE=30
PROMPT_TIME_BEFORE_IDLE_IN_MINUTE=5
`;
      fs.writeFileSync(envFilePath, defaultEnv, 'utf-8');
    }

    // Read current .env file
    let envContent = fs.readFileSync(envFilePath, 'utf-8');
    const updates: string[] = [];

    // Update environment variables
    const envVars: Record<string, string> = {
      CLIENT_ID: clientId,
      APP_API_BASE_URL: appApiBaseUrl,
      AUTH_API_BASE_URL: authApiBaseUrl,
      ENABLE_SESSION_TIMEOUT: enableSessionTimeout,
      EXPIRY_TIME_IN_MINUTE: expiryTimeInMinute,
      PROMPT_TIME_BEFORE_IDLE_IN_MINUTE: promptTimeBeforeIdleInMinute,
    };

    for (const [key, value] of Object.entries(envVars)) {
      if (value !== undefined && value !== null) {
        const regex = new RegExp(`^${key}=.*$`, 'm');
        if (regex.test(envContent)) {
          envContent = envContent.replace(regex, `${key}=${value}`);
        } else {
          envContent += `\n${key}=${value}`;
        }
        updates.push(`${key}=${value}`);
      }
    }

    // Write updated .env file
    fs.writeFileSync(envFilePath, envContent, 'utf-8');

    // Regenerate config.json if requested
    if (regenerate) {
      try {
        const configGeneratorPath = path.join(
          projectRoot,
          'configGenerator.js',
        );
        if (fs.existsSync(configGeneratorPath)) {
          execSync(
            'node configGenerator.js --templateFileName=config.template.json --outConfigPath=./public',
            {
              cwd: projectRoot,
              stdio: 'inherit',
            },
          );
          updates.push('✅ Regenerated config.json in public directory');
        } else {
          updates.push('⚠️  configGenerator.js not found, skipped regeneration');
        }
      } catch (error) {
        return `Updated .env file successfully, but failed to regenerate config.json:\n${updates.join('\n')}\n\nError: ${error}`;
      }
    }

    if (updates.length === 0) {
      return '⚠️  No changes made to environment configuration.';
    }

    return `✅ Successfully updated environment configuration:
${updates.map(u => `  - ${u}`).join('\n')}

File: ${envFilePath}
`;
  }
}
