// Copyright (c) 2023 Sourcefuse Technologies
// Released under the MIT License.
// https://opensource.org/licenses/MIT

import {flags} from '@oclif/command';
import {IConfig} from '@oclif/config';
import Base from '../../command-base';
import {AnyObject, PromptFunction} from '../../types';

export class ReactGenerate extends Base<{}> {
  static readonly description =
    'Generate React components, hooks, contexts, pages, and other artifacts.';
  static readonly mcpDescription =
    'Generates React components, hooks, contexts, pages, utilities, slices, and services based on ARC conventions.';

  static readonly flags = {
    help: flags.boolean({description: 'Show manual pages'}),
    type: flags.enum({
      description: 'Type of artifact to generate',
      options: [
        'component',
        'hook',
        'context',
        'page',
        'service',
        'util',
        'slice',
      ],
    }),
    path: flags.string({description: 'Target path for the artifact'}),
    skipTests: flags.boolean({description: 'Skip test file generation'}),
  };

  static readonly args = [{name: 'name', description: 'Artifact name'}];

  static readonly mcpFlags = {
    workingDir: flags.string({description: 'React project root directory'}),
  };

  async run(): Promise<void> {
    await this.generate('react', ReactGenerate);
  }

  static async mcpRun(inputs: AnyObject) {
    return Base.mcpResponse(inputs, 'react', []);
  }
}
