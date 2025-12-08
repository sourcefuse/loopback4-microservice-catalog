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
import {AngularScaffold} from './angular/scaffold';
import {Cdk} from './cdk';
import {Extension} from './extension';
import {Microservice} from './microservice';
import {ReactScaffold} from './react/scaffold';
import {Scaffold} from './scaffold';
import {Update} from './update';

export class Mcp extends Base<{}> {
  commands: ICommandWithMcpFlags[] = [];
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
        // Frontend scaffolding commands
        AngularScaffold,
        ReactScaffold,
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
    this.hookProcessMethods();
    this.commands.forEach(command => {
      const params: Record<string, z.ZodTypeAny> = {};
      command.args?.forEach(arg => {
        params[arg.name] = this.argToZod(arg);
      });
      Object.entries(command.flags ?? {}).forEach(([name, flag]) => {
        if (name === 'help') {
          // skip help flag as it is not needed in MCP
          return;
        }
        params[name] = this.flagToZod(flag);
      });
      if (this._hasMcpFlags(command)) {
        Object.entries(command.mcpFlags ?? {}).forEach(
          ([name, flag]: [string, IFlag<AnyObject>]) => {
            params[name] = this.flagToZod(flag, true);
          },
        );
      }
      this.server.tool<typeof params>(
        command.name,
        command.mcpDescription,
        params,
        async args => command.mcpRun(args as Record<string, AnyObject[string]>),
      );
    });
  }

  async run() {
    this.setup();
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }

  private hooksInitialized = false;

  private hookProcessMethods() {
    if (this.hooksInitialized) {
      return;
    }
    this.hooksInitialized = true;
    // stub process.exit to throw an error
    // so that we can catch it in the MCP client
    // and handle it gracefully instead of exiting the process
    process.exit = () => {
      this.server.server
        .sendLoggingMessage({
          level: 'debug',
          data: {
            message: `Process exited with code 0 using process.exit()`,
            timestamp: new Date().toISOString(),
          },
        })
        .catch(err => {
          // sonarignore:start
          console.error('Error sending exit message:', err);
          // sonarignore:end
        });
      return undefined as never;
    };
    // sonarignore:start
    const original = console.error;
    console.error = (...args: AnyObject[]) => {
      // sonarignore:end

      // log errors to the MCP client
      this.server.server
        .sendLoggingMessage({
          level: 'debug',
          data: {
            message: args.map(v => JSON.stringify(v)).join(' '),
            timestamp: new Date().toISOString(),
          },
        })
        .catch(err => {
          // sonarignore:start
          original('Error sending logging message:', err);
          // sonarignore:end
        });
      original(...args);
    };
    // sonarignore:start
    console.log = (...args: AnyObject[]) => {
      // log messages to the MCP client
      this.server.server
        .sendLoggingMessage({
          level: 'info',
          data: {
            message: args.map(v => JSON.stringify(v)).join(' '),
            timestamp: new Date().toISOString(),
          },
        })
        .catch(err => {
          console.error('Error sending logging message:', err);
          // sonarignore:end
        });
    };
  }

  private argToZod(arg: IArg) {
    const option = z.string().describe(arg.description ?? '');
    return option;
  }

  private flagToZod<T>(flag: IFlag<T>, checkRequired = false) {
    const descriptionBase = flag.description ?? '';
    const dependsOn = Array.isArray(flag.dependsOn) ? flag.dependsOn : [];
    const exclusive = Array.isArray(flag.exclusive) ? flag.exclusive : [];
    const isRequired = !!flag.required;
    const shouldMarkNotRequired =
      !isRequired || (checkRequired && !flag.required);
    const makeOptional =
      shouldMarkNotRequired || dependsOn.length > 0 || exclusive.length > 0;

    const {schema, extraDescription} = this.buildFlagSchema(flag, makeOptional);

    const description = this.buildFlagDescription(
      descriptionBase,
      extraDescription,
      dependsOn,
      exclusive,
      isRequired,
      shouldMarkNotRequired,
    );

    return schema.describe(description.trim());
  }

  private buildFlagSchema<T>(
    flag: IFlag<T>,
    makeOptional: boolean,
  ): {schema: z.ZodTypeAny; extraDescription: string} {
    if (flag.type === 'boolean') {
      return this.buildBooleanSchema(flag, makeOptional);
    }

    if (!this._isOptionFlag(flag)) {
      throw new Error('Unsupported flag provided to flagToZod.');
    }

    return this.buildOptionSchema(flag, makeOptional);
  }

  private buildBooleanSchema<T>(
    flag: IFlag<T>,
    makeOptional: boolean,
  ): {schema: z.ZodTypeAny; extraDescription: string} {
    let schema: z.ZodTypeAny = z.boolean();

    if (makeOptional) {
      const defaultValue =
        flag.default === undefined ? false : (flag.default as boolean);
      schema = schema.optional().default(defaultValue);
      return {schema, extraDescription: ''};
    }

    if (flag.default !== undefined) {
      schema = schema.default(flag.default as boolean);
    }

    return {schema, extraDescription: ''};
  }

  private buildOptionSchema<T>(
    flag: IOptionFlag<T>,
    makeOptional: boolean,
  ): {schema: z.ZodTypeAny; extraDescription: string} {
    const hasEnumOptions =
      Array.isArray(flag.options) && flag.options.length > 0;

    if (hasEnumOptions) {
      return this.buildEnumSchema(flag, makeOptional);
    }

    let schema: z.ZodTypeAny = z.string();
    if (makeOptional) {
      schema = schema.optional();
    }
    return {schema, extraDescription: ''};
  }

  private buildEnumSchema<T>(
    flag: IOptionFlag<T>,
    makeOptional: boolean,
  ): {schema: z.ZodTypeAny; extraDescription: string} {
    const options = flag.options as [string, ...string[]];
    let schema: z.ZodTypeAny = z.enum(options);
    if (makeOptional) {
      schema = schema.optional();
    }
    const description = ` (options: ${options.join(', ')})`;
    return {schema, extraDescription: description};
  }

  private buildFlagDescription(
    descriptionBase: string,
    extraDescription: string,
    dependsOn: string[],
    exclusive: string[],
    isRequired: boolean,
    shouldMarkNotRequired: boolean,
  ): string {
    let description = descriptionBase;

    if (extraDescription) {
      description += extraDescription;
    }

    description += this.buildRequirementSuffix(
      dependsOn,
      isRequired,
      shouldMarkNotRequired,
    );

    description += this.buildExclusiveSuffix(exclusive);

    return description;
  }

  private buildRequirementSuffix(
    dependsOn: string[],
    isRequired: boolean,
    shouldMarkNotRequired: boolean,
  ): string {
    if (dependsOn.length > 0) {
      const verb = dependsOn.length > 1 ? 'are' : 'is';
      return ` (required if ${dependsOn.join(', ')} ${verb} provided)`;
    }

    if (isRequired) {
      return ' (required)';
    }

    if (shouldMarkNotRequired) {
      return ' (not required)';
    }

    return '';
  }

  private buildExclusiveSuffix(exclusive: string[]): string {
    if (exclusive.length === 0) {
      return '';
    }

    const suffix = exclusive.length > 1 ? 's' : '';
    return ` (can not be provided with ${exclusive.join(', ')} option${suffix})`;
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
