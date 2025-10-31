// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {flags} from '@oclif/command';
import {IConfig} from '@oclif/config';
import * as fs from 'node:fs';
import * as path from 'node:path';
import Base from '../../command-base';
import {AnyObject, PromptFunction} from '../../types';
import {FileGenerator} from '../../utilities/file-generator';

export class AngularConfig extends Base<{}> {
  private fileGenerator = new FileGenerator();

  static readonly description =
    'Update Angular environment configuration files';

  static readonly mcpDescription = `
    Use this command to update Angular environment configuration.
    Updates TypeScript files in projects/arc/src/environments/.

    Configuration files:
    - environment.ts (development)
    - environment.prod.ts (production)
    - environment.staging.ts (staging)

    Variables you can configure:
    - baseApiUrl: Base URL for API calls
    - authServiceUrl: Authentication service URL
    - clientId: OAuth client ID
    - publicKey: Public key for authentication
    - production: Production flag

    Examples:
    - Update production: environment=production, apiUrl=https://api.example.com
    - Update auth: environment=production, authServiceUrl=https://auth.example.com, clientId=prod-123
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
    environment: flags.enum({
      name: 'environment',
      description: 'Environment to update',
      options: ['development', 'production', 'staging'],
      required: false,
      default: 'development',
    }),
    apiUrl: flags.string({
      name: 'apiUrl',
      description: 'Base API URL',
      required: false,
    }),
    authServiceUrl: flags.string({
      name: 'authServiceUrl',
      description: 'Authentication service URL',
      required: false,
    }),
    clientId: flags.string({
      name: 'clientId',
      description: 'OAuth client ID',
      required: false,
    }),
    publicKey: flags.string({
      name: 'publicKey',
      description: 'Public key for authentication',
      required: false,
    }),
  };

  static readonly args = [];

  async run() {
    const {flags: parsedFlags} = this.parse(AngularConfig);
    const inputs = {...parsedFlags};

    const result = await this.updateConfig(inputs);
    this.log(result);
  }

  static async mcpRun(inputs: AnyObject) {
    const originalCwd = process.cwd();
    if (inputs.workingDir) {
      process.chdir(inputs.workingDir);
    }

    try {
      const configurer = new AngularConfig([], {} as unknown as IConfig, {} as unknown as PromptFunction);
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
    const {environment, apiUrl, authServiceUrl, clientId, publicKey} = inputs;
    const projectRoot = this.fileGenerator['getProjectRoot']();

    // Determine environment file
    const envFileName =
      environment === 'development'
        ? 'environment.ts'
        : `environment.${environment}.ts`;
    const envFilePath = path.join(
      projectRoot,
      'projects',
      'arc',
      'src',
      'environments',
      envFileName,
    );

    if (!fs.existsSync(envFilePath)) {
      throw new Error(`Environment file not found: ${envFilePath}`);
    }

    // Read current environment file
    let envContent = fs.readFileSync(envFilePath, 'utf-8');
    const updates: string[] = [];

    // Update configuration values
    if (apiUrl) {
      envContent = this.updateProperty(envContent, 'baseApiUrl', apiUrl);
      updates.push(`baseApiUrl: ${apiUrl}`);
    }

    if (authServiceUrl) {
      envContent = this.updateProperty(
        envContent,
        'authServiceUrl',
        authServiceUrl,
      );
      updates.push(`authServiceUrl: ${authServiceUrl}`);
    }

    if (clientId) {
      envContent = this.updateProperty(envContent, 'clientId', clientId);
      updates.push(`clientId: ${clientId}`);
    }

    if (publicKey) {
      envContent = this.updateProperty(envContent, 'publicKey', publicKey);
      updates.push(`publicKey: ${publicKey}`);
    }

    // Write updated environment file
    fs.writeFileSync(envFilePath, envContent, 'utf-8');

    if (updates.length === 0) {
      return '⚠️  No configuration changes made.';
    }

    return `✅ Successfully updated ${environment} environment configuration:
${updates.map(u => `  - ${u}`).join('\n')}

File: ${envFilePath}
`;
  }

  private updateProperty(
    content: string,
    propertyName: string,
    value: string,
  ): string {
    // Match property assignment in TypeScript environment file
    // Improved regex: match property assignment with any value (including multiline, objects, arrays, template strings)
    // Note: This is still not a full parser, but is more robust than the previous pattern.
    const testRegex = new RegExp(
      `${propertyName}\\s*:\\s*(['"\`]?)[\\s\\S]*?(['"\`]?)\\s*[,}]`,
    );
    const replaceRegex = new RegExp(
      `(${propertyName}\\s*:\\s*)(['"\`]?)[\\s\\S]*?(['"\`]?)\\s*([,}])`,
    );

    if (testRegex.test(content)) {
      // Property exists, update it
      // Replace the property value, preserving the trailing comma or brace
      return content.replace(replaceRegex, `$1'${value}'$4`);
    } else {
      // Property doesn't exist, add it before the closing brace
      const insertRegex = /};\s*$/;
      return content.replace(
        insertRegex,
        `  ${propertyName}: '${value}',\n};\n`,
      );
    }
  }
}
