import {BaseGenerator} from '../../base-generator';
import {TemplateScaffoldOptions} from '../../types';
import {
  scaffoldUiProject,
  UiFramework,
  UiScaffoldResult,
} from '../../utilities/ui-scaffold';

const chalk = require('chalk'); //NOSONAR

export interface UiGeneratorConfig<T extends TemplateScaffoldOptions> {
  framework: UiFramework;
  defaultTemplateRepo: string;
  promptMessage?: string;
  summaryLines?: (name: string, result: UiScaffoldResult) => string[];
  tokenReplacements?: (options: T) => {search: string; replace: string}[];
}

export abstract class UiScaffoldGenerator<
  T extends TemplateScaffoldOptions,
> extends BaseGenerator<T> {
  protected scaffoldResult?: UiScaffoldResult;

  protected abstract getConfig(): UiGeneratorConfig<T>;

  async prompting() {
    if (!this.options.name) {
      const message = this.getConfig().promptMessage ?? 'Project name?';
      const answers = await this.prompt([
        {
          type: 'input',
          name: 'name',
          message,
          validate: (input: string) =>
            Boolean(input) || 'Project name is required',
        },
      ]);
      this.options.name = answers.name;
    }
  }

  async writing() {
    const config = this.getConfig();
    const name = (this.options.name ?? '').trim();
    if (!name) {
      this.exit('Project name is required');
      return;
    }

    const rawRepo = (this.options.templateRepo ?? '').trim();
    const templateRepo = rawRepo.length ? rawRepo : config.defaultTemplateRepo;

    this.log(
      chalk.blue(`\n📦 Scaffolding ${config.framework} project '${name}'...`),
    );

    try {
      this.scaffoldResult = await scaffoldUiProject({
        framework: config.framework,
        name,
        templateRepo,
        templateVersion: this.options.templateVersion,
        localPath: this.options.localPath,
        installDeps: !!this.options.installDeps,
        baseDir: process.cwd(),
        replaceTokens: config.tokenReplacements?.(this.options) ?? [],
      });
      this.log(
        chalk.green(`✅ ${config.framework} project '${name}' scaffolded!`),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.exit(`Failed to scaffold ${config.framework} project: ${message}`);
    }
  }

  async end() {
    if (!this.scaffoldResult) return;
    const config = this.getConfig();
    const name = (this.options.name ?? '').trim();
    const lines = config.summaryLines
      ? config.summaryLines(name, this.scaffoldResult)
      : this.defaultSummaryLines(name, this.scaffoldResult, config.framework);

    for (const line of lines) {
      this.log(line || '');
    }
  }

  private defaultSummaryLines(
    name: string,
    result: UiScaffoldResult,
    framework: UiFramework,
  ): string[] {
    const header: string[] = [
      chalk.green(`✅ ${framework} project '${name}' scaffolded successfully!`),
      '',
      chalk.blue(`📁 Location: ${result.targetDir}`),
      chalk.blue('🔧 MCP Configuration: Ready'),
      '',
      chalk.yellow('Next steps:'),
      chalk.white(`  cd ${name}`),
    ];

    const extras: string[] = [];
    if (!result.installDeps) extras.push(chalk.white('  npm install'));
    extras.push(chalk.white('  npm start'), '');
    if (!result.installDeps)
      extras.push(
        chalk.cyan('💡 Open in Claude or Copilot for AI-assisted development!'),
      );

    return ['', ...header, ...extras];
  }
}
