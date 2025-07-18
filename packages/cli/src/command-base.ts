﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/* eslint-disable  @typescript-eslint/naming-convention */
import Command from '@oclif/command';
import {IFlag} from '@oclif/command/lib/flags';
import {IConfig} from '@oclif/config';
import Parser from '@oclif/parser';
import {IArg} from '@oclif/parser/lib/args';
import {Input as FlagInput} from '@oclif/parser/lib/flags';
import inquirer, {Question} from 'inquirer';
import fetch from 'node-fetch';
import Environment, {createEnv} from 'yeoman-environment';
import {AnyObject, McpTextResponse, PromptFunction} from './types';
import {yeomanRun} from './utilities/yeoman';
const chalk = require('chalk'); //NOSONAR
/* eslint-enable  @typescript-eslint/naming-convention */
const IGNORED_FLAGS = ['help', 'cwd'];
export default abstract class CommandBase<T extends object> extends Command {
  prompt: PromptFunction;
  env: Environment<T>;
  constructor(
    argv: string[],
    config: IConfig,
    prompt: PromptFunction,
    env?: Environment<T>,
  ) {
    super(argv, config);
    if (prompt) {
      this.prompt = prompt;
    } else {
      this.prompt = inquirer.prompt;
    }
    if (env) {
      this.env = env;
    } else {
      this.env = createEnv();
    }
  }
  protected async generate(type: string, generatorOptions: Parser.Input<T>) {
    await this.promptToUpdateVersion();
    const inputs = this.parse(generatorOptions);
    if (generatorOptions.args) {
      await this.promptArgs(generatorOptions.args, inputs.args);
    }
    if (generatorOptions.flags) {
      await this.promptFlags(generatorOptions.flags, inputs.flags);
    }

    this.env.register(require.resolve(`./generators/${type}`), `oclif:${type}`);
    await this.env.run(`oclif:${type}`, {
      ...inputs.args,
      ...inputs.flags,
    });
  }

  static async mcpResponse(
    inputs: AnyObject,
    name: string,
    args: string[],
  ): Promise<McpTextResponse> {
    const originalCwd = process.cwd();
    if (inputs.workingDir) {
      process.chdir(inputs.workingDir);
    }
    let output: McpTextResponse = {
      content: [
        {type: 'text', text: 'Command executed successfully!', isError: false},
      ],
    };
    try {
      await yeomanRun(inputs.cwd ?? process.cwd(), name, args, inputs);
    } catch (err) {
      if (err instanceof Error) {
        output = {
          content: [
            {
              type: 'text',
              text: `Error executing command: ${err.message}`,
              isError: true,
            },
          ],
        };
      } else {
        output = {
          content: [
            {
              type: 'text',
              text: `Error executing command: ${err}`,
              isError: true,
            },
          ],
        };
      }
    }
    process.chdir(originalCwd);
    return output;
  }

  private async promptArgs(args: IArg[], options: AnyObject) {
    const prompts: Question[] = args
      .filter(arg => !options[arg.name])
      .map(arg => ({
        type: 'string',
        name: arg.name,
        message: arg.description,
        required: true,
      }));
    if (prompts.length > 0) {
      const answers = await this.prompt(prompts);
      Object.keys(answers).forEach(key => {
        options[key] = answers[key];
      });
    }
  }

  private async promptFlags(flags: FlagInput<AnyObject>, options: AnyObject) {
    for (const flag in flags) {
      if (
        (options[flag] !== undefined && options[flag] !== null) ||
        IGNORED_FLAGS.includes(flag)
      ) {
        continue;
      }

      if (
        this.exclusivity(options, flags[flag].exclusive) &&
        this.dependencyExists(options, flags[flag].dependsOn)
      ) {
        const answer = await this.prompt([
          this.createPromptObject(flags[flag]),
        ]);
        if (answer) {
          options[flag] = answer[flags[flag].name];
        }
      }
    }
  }

  private createPromptObject<S>(flag: IFlag<S>) {
    const response: AnyObject = {
      type: 'input',
      name: flag.name,
      message: flag.description,
    };
    if (flag.type === 'boolean') {
      response.type = 'confirm';
      response.default = false;
    } else if (flag.options) {
      response.type = 'list';
      response.choices = flag.options;
    } else {
      //do nothing
    }
    return response;
  }

  private dependencyExists(
    options: AnyObject,
    dependsOn: string[] | undefined,
  ): boolean {
    if (dependsOn && dependsOn.length > 0) {
      for (const dependency of dependsOn) {
        if (!options[dependency]) {
          return false;
        }
      }
    }
    return true;
  }

  private exclusivity(
    options: AnyObject,
    exclusive: string[] | undefined,
  ): boolean {
    if (exclusive && exclusive.length > 0) {
      for (const ex of exclusive) {
        if (options[ex]) {
          return false;
        }
      }
    }
    return true;
  }

  private async promptToUpdateVersion() {
    const configJsonFile = require('../package.json');
    const currentVersion = configJsonFile.version;

    const res = await fetch(
      'https://registry.npmjs.org/@sourceloop/cli/latest',
    );
    const data = await res.json();
    const latestVersion = data.version;

    if (currentVersion !== latestVersion) {
      this.log(
        chalk.yellow(
          'Current ARC CLI version is v%s. To use latest features, please update to v%s',
        ),
        currentVersion,
        latestVersion,
      );
    }
  }
}
