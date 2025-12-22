// Copyright (c) 2023 Sourcefuse Technologies
// Released under the MIT License.
// https://opensource.org/licenses/MIT

import {ReactScaffoldOptions} from '../../types';
import {UiScaffoldResult} from '../../utilities/ui-scaffold';
import {UiGeneratorConfig, UiScaffoldGenerator} from '../ui-scaffold/base';

const chalk = require('chalk'); //NOSONAR

export default class ReactScaffoldGenerator extends UiScaffoldGenerator<ReactScaffoldOptions> {
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

  protected getConfig(): UiGeneratorConfig<ReactScaffoldOptions> {
    return {
      framework: 'react',
      defaultTemplateRepo: 'sourcefuse/react-boilerplate-ts-ui',
      promptMessage: 'Project name?',
      tokenReplacements: (options: ReactScaffoldOptions) => {
        const name = (options.name ?? '').trim();
        if (!name) return [];
        return [
          {
            search: 'react-boilerplate-ts-ui',
            replace: name,
          },
        ];
      },
      summaryLines: (name: string, result: UiScaffoldResult): string[] => {
        const lines = [
          '',
          chalk.green(`✅ React UI project '${name}' scaffolded successfully!`),
          '',
          chalk.blue(`📁 Location: ${result.targetDir}`),
          chalk.blue('🔧 MCP Configuration: Added'),
        ];
        lines.push(
          result.installDeps
            ? chalk.blue('📦 Dependencies installed')
            : chalk.yellow('Run `npm install` to set up dependencies'),
          '',
          chalk.yellow('Next steps:'),
          chalk.white(`  cd ${name}`),
        );
        if (!result.installDeps) {
          lines.push(chalk.white('  npm install'));
        }
        lines.push(chalk.white('  npm start'), '');
        return lines;
      },
    };
  }
}
