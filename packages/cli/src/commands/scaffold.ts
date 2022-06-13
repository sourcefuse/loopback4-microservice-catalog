import {flags} from '@oclif/command';
import {IConfig} from '@oclif/config';
import Environment from 'yeoman-environment';
import Base from '../command-base';
import {PromptFunction, ScaffoldOptions} from '../types';

export class Scaffold extends Base<ScaffoldOptions> {
  constructor(
    argv: string[],
    config: IConfig,
    prompt: PromptFunction,
    env?: Environment<ScaffoldOptions>,
  ) {
    super(argv, config, prompt, env);
  }
  static description = 'create a project scaffold';

  static flags = {
    help: flags.boolean({
      name: 'help',
      description: 'show manual pages',
      type: 'boolean',
    }),
    issuePrefix: flags.string({
      name: 'issuePrefix',
      description: 'prefix to be used for issues(e.g. GH-)',
    }),
    cwd: flags.string({
      name: 'working-directory',
      description:
        'directory where project will be scaffolded, instead of the project name',
    }),
  };
  static args = [
    {name: 'name', description: 'name of the project', required: false},
  ];

  async run() {
    await super.generate('scaffold', Scaffold);
  }
}
