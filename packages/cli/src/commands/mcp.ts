// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {flags} from '@oclif/command';
import {IFlag, IOptionFlag} from '@oclif/command/lib/flags';
import {IConfig} from '@oclif/config';
// eslint-disable-next-line @typescript-eslint/naming-convention
import Environment from 'yeoman-environment';
import {z} from 'zod';
import {ICommand} from '../__tests__/helper/command-test.helper';
// eslint-disable-next-line @typescript-eslint/naming-convention
import Base from '../command-base';
import {AnyObject, IArg, ICommandWithMcpFlags, PromptFunction} from '../types';
import {AngularConfig} from './angular/config';
import {AngularGenerate} from './angular/generate';
import {AngularInfo} from './angular/info';
import {AngularScaffold} from './angular/scaffold';
import {Cdk} from './cdk';
import {Extension} from './extension';
import {Microservice} from './microservice';
import {ReactConfig} from './react/config';
import {ReactGenerate} from './react/generate';
import {ReactInfo} from './react/info';
import {ReactScaffold} from './react/scaffold';
import {Scaffold} from './scaffold';
import {Update} from './update';

export class Mcp extends Base<{}> {
  commands: ICommandWithMcpFlags[] = [];
  private static hooksInstalled = false; // Guard flag to prevent multiple installations

  constructor(
    argv: string[],
    config: IConfig,
    prompt: PromptFunction,
    env?: Environment<AnyObject>,
    cmds?: ICommandWithMcpFlags[],
  ) {
    super(argv, config, prompt, env);
    if (cmds) {
      this.commands = cmds;
    } else {
      this.commands = [
        // Backend commands
        Cdk,
        Extension,
        Microservice,
        Scaffold,
        Update,
        // Angular commands
        AngularGenerate,
        AngularScaffold,
        AngularConfig,
        AngularInfo,
        // React commands
        ReactGenerate,
        ReactScaffold,
        ReactConfig,
        ReactInfo,
      ];
    }
  }
  static readonly description = `
  Command that runs an MCP server for the sourceloop CLI, this is not supposed to be run directly, but rather used by the MCP client to interact with the CLI commands. 
  You can use it using the following MCP server configuration:
    "sourceloop": {
      "command": "npx",
      "args": ["@sourceloop/cli", "mcp"],
      "timeout": 300
    }
    `;

  static readonly flags = {
    help: flags.boolean({
      name: 'help',
      description: 'show manual pages',
      type: 'boolean',
    }),
  };

  server: McpServer = new McpServer(
    {
      name: '@sourceloop/cli',
      version: require('../../package.json').version,
    },
    {
      capabilities: {
        logging: {}, // key
        tools: {},
      },
    },
  );
  setup() {
    // Hook process methods once before registering tools
    // Use guard flag to prevent multiple installations
    if (!Mcp.hooksInstalled) {
      this.hookProcessMethods();
      Mcp.hooksInstalled = true;
    }

    for (const command of this.commands) {
      const params = this.buildCommandParams(command);
      this.registerTool(command, params);
    }
  }

  private buildCommandParams(command: ICommandWithMcpFlags): Record<string, z.ZodTypeAny> {
    const params: Record<string, z.ZodTypeAny> = {};

    this.addArgParams(command, params);
    this.addFlagParams(command, params);
    this.addMcpFlagParams(command, params);

    return params;
  }

  private addArgParams(command: ICommandWithMcpFlags, params: Record<string, z.ZodTypeAny>): void {
    if (command.args) {
      for (const arg of command.args) {
        params[arg.name] = this.argToZod(arg);
      }
    }
  }

  private addFlagParams(command: ICommandWithMcpFlags, params: Record<string, z.ZodTypeAny>): void {
    for (const [name, flag] of Object.entries(command.flags ?? {})) {
      if (name === 'help') {
        // skip help flag as it is not needed in MCP
        continue;
      }
      params[name] = this.flagToZod(flag);
    }
  }

  private addMcpFlagParams(command: ICommandWithMcpFlags, params: Record<string, z.ZodTypeAny>): void {
    if (this._hasMcpFlags(command)) {
      for (const [name, flag] of Object.entries(command.mcpFlags ?? {})) {
        params[name] = this.flagToZod(flag as IFlag<AnyObject>, true);
      }
    }
  }

  private registerTool(command: ICommandWithMcpFlags, params: Record<string, z.ZodTypeAny>): void {
    this.server.tool<typeof params>(
      command.name,
      command.mcpDescription,
      params,
      async args => command.mcpRun(args as Record<string, AnyObject[string]>),
    );
  }

  async run() {
    this.setup();
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }

  private hookProcessMethods() {
    // Save original references before overwriting
    const originalError = console.error;
    const originalLog = console.log;

    // Stub process.exit to prevent killing the MCP server
    process.exit = () => {
      this.server.server
        .sendLoggingMessage({
          level: 'debug',
          message: `Process exited with code 0 using process.exit()`,
          timestamp: new Date().toISOString(),
        })
        .catch(err => {
          originalError('Error sending exit message:', err);
        });
      return undefined as never;
    };

    // Intercept console.error
    console.error = (...args: AnyObject[]) => {
      // log errors to the MCP client
      // Only stringify objects and arrays for performance
      const formattedArgs: string[] = [];
      for (const v of args) {
        if (typeof v === 'object' && v !== null) {
          formattedArgs.push(JSON.stringify(v));
        } else {
          formattedArgs.push(String(v));
        }
      }

      this.server.server
        .sendLoggingMessage({
          level: 'error',
          message: formattedArgs.join(' '),
          timestamp: new Date().toISOString(),
        })
        .catch(err => {
          originalError('Error sending logging message:', err);
        });
      originalError(...args);
    };

    // Intercept console.log
    console.log = (...args: AnyObject[]) => {
      // log messages to the MCP client
      // Only stringify objects and arrays for performance
      const formattedArgs: string[] = [];
      for (const v of args) {
        if (typeof v === 'object' && v !== null) {
          formattedArgs.push(JSON.stringify(v));
        } else {
          formattedArgs.push(String(v));
        }
      }

      this.server.server
        .sendLoggingMessage({
          level: 'info',
          message: formattedArgs.join(' '),
          timestamp: new Date().toISOString(),
        })
        .catch(err => {
          originalError('Error sending logging message:', err);
        });
      originalLog(...args);
    };
  }

  private argToZod(arg: IArg) {
    const option = z.string().describe(arg.description ?? '');
    return arg.required ? option : option.optional();
  }

  private flagToZod<T>(flag: IFlag<T>, checkRequired = false) {
    let option;
    let description = flag.description ?? '';

    if (flag.type === 'boolean') {
      option = z.boolean().optional();
      option = option.default((flag.default as boolean) ?? false);
      return this._describeOption(option, description, flag, checkRequired);
    }
    if (!this._isOptionFlag(flag)) {
      throw new Error(
        'Unsupported flag type. Supported types are boolean, option, enum, and integer.',
      );
    }

    const optionFlag = flag as IOptionFlag<T>;
    if (optionFlag.options !== undefined) {
      option = z.enum(optionFlag.options as [string, ...string[]]);
      description += ` (options: ${optionFlag.options?.join(', ')})`;
      return this._describeOption(option, description, flag, checkRequired);
    } else {
      option = z.string().optional();
      return this._describeOption(option, description, flag, checkRequired);
    }
  }

  private _describeOption<T>(
    option: z.ZodTypeAny,
    description: string,
    flag: IFlag<T>,
    checkRequired: boolean,
  ) {
    if (flag.dependsOn) {
      description += ` (required if ${flag.dependsOn.join(', ')} ${flag.dependsOn.length > 1 ? 'are' : 'is'} provided)`;
      option = option.optional();
    } else {
      description += ' (required)';
    }

    if (checkRequired && !flag.required) {
      description += ' (not required)';
      option = option.optional();
    }

    if (flag.exclusive) {
      description += ` (can not be provided with ${flag.exclusive.join(', ')} option${flag.exclusive.length > 1 ? 's' : ''})`;
      option = option.optional();
    }

    return option.describe(description);
  }

  private _hasMcpFlags<T extends ICommand | ICommandWithMcpFlags>(
    command: T,
  ): command is T & ICommandWithMcpFlags {
    return (
      'mcpFlags' in command &&
      typeof command.mcpFlags === 'object' &&
      command.mcpFlags !== null
    );
  }

  private _isOptionFlag<T>(flag: IFlag<T>): flag is IOptionFlag<T> {
    return flag.type === 'option';
  }
}
