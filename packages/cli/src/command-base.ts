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
const yeomanenv = require('yeoman-environment');

import {AnyObject, PromptFunction} from './types';
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
    const baseService = (inputs.flags as AnyObject).baseService;
    if (
      type === 'microservice' &&
      Array.isArray(baseService) &&
      baseService.length > 0
    ) {
      for (const service of baseService) {
        const envS = this.getEnv(process.cwd(), 'microservice');
        const currentInputs = {...inputs};
        currentInputs.flags = {...inputs.flags, baseService: service};

        await this.runWithEnv(envS, type, [service], {
          ...currentInputs.args,
          ...currentInputs.flags,
        });
      }
    } else {
      this.env.register(
        require.resolve(`./generators/${type}`),
        `oclif:${type}`,
      );
      await this.env.run(
        `oclif:${type}`,
        Object.assign(Object.assign({}, inputs.args), inputs.flags), //NOSONAR
      );
    }
  }

  private async yeomanRun(
    workspace: string,
    name: string,
    args: string[] | undefined,
    opts: AnyObject,
  ) {
    const env = this.getEnv(workspace, name);
    await this.runWithEnv(env, name, args, opts);
  }

  private getEnv(workspace: string, name: string) {
    const env = yeomanenv.createEnv([], {cwd: workspace});
    this.registerGenerators(env, name);
    return env;
  }

  private async runWithEnv(
    env: AnyObject,
    name: string,
    args: string[] | undefined,
    opts: AnyObject,
  ) {
    const yeomanArgs = [`sl:${name}`, ...(args ?? [])];
    return env.run(yeomanArgs, opts);
  }

  private async registerGenerators(env: AnyObject, generator: string) {
    env.register(
      require.resolve(`@sourceloop/cli/lib/generators/${generator}/index`),
      `sl:${generator}`,
    );
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
      if (flag.name === 'datasourceType') {
        response.type = 'list';
        response.choices = flag.options;
      } else if (flag.options.length > 1) {
        response.type = 'checkbox';
        response.choices = flag.options.map(option => {
          return {
            name: option,
            value: option,
          };
        });
      } else {
        response.type = 'list';
        response.choices = flag.options;
      }
    } else {
      //do nothing
      ``;
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
