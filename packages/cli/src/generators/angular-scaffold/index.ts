// Copyright (c) 2023 Sourcefuse Technologies
// Released under the MIT License.
// https://opensource.org/licenses/MIT

import {AngularScaffoldOptions} from '../../types';
import {UiScaffoldResult} from '../../utilities/ui-scaffold';
import {UiGeneratorConfig, UiScaffoldGenerator} from '../ui-scaffold/base';

const chalk = require('chalk'); //NOSONAR

export default class AngularScaffoldGenerator extends UiScaffoldGenerator<AngularScaffoldOptions> {
  // Yeoman schedules lifecycle methods based on own properties, so forward them explicitly.
  async prompting() {
    return super.prompting();
  }

  async writing() {
    return super.writing();
  }

  async end() {
    return super.end();
  }

  protected getConfig(): UiGeneratorConfig<AngularScaffoldOptions> {
    return {
      framework: 'angular',
      defaultTemplateRepo: 'sourcefuse/angular-boilerplate',
      promptMessage: 'Enter your project name:',
      summaryLines: (name: string, result: UiScaffoldResult): string[] => {
        const lines = [
          '',
          chalk.green(`✅ Angular project '${name}' scaffolded successfully!`),
          '',
          chalk.blue(`📁 Location: ${result.targetDir}`),
          chalk.blue('🔧 MCP Configuration: Ready'),
          '',
          chalk.yellow('Next steps:'),
          chalk.white(`  cd ${name}`),
        ];
        if (!result.installDeps) {
          lines.push(chalk.white('  npm install'));
        }
        lines.push(
          chalk.white('  npm start'),
          '',
          chalk.cyan(
            '💡 Open in Claude or Copilot for AI-assisted development!',
          ),
        );
        return lines;
      },
    };
  }
}
