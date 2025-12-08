import * as path from 'node:path';
import {FileGenerator} from './file-generator';
import {McpConfigInjector} from './mcp-injector';
import {TemplateFetcher} from './template-fetcher';

export type UiFramework = 'angular' | 'react';

export interface UiScaffoldOptions {
  framework: UiFramework;
  name: string;
  templateRepo: string;
  templateVersion?: string;
  localPath?: string;
  installDeps: boolean;
  replaceTokens?: {search: string; replace: string}[];
  baseDir?: string;
}

export interface UiScaffoldResult {
  targetDir: string;
  installDeps: boolean;
}

export interface UiScaffoldDependencies {
  fileGenerator?: FileGenerator;
  templateFetcher?: TemplateFetcher;
  mcpInjector?: McpConfigInjector;
}

export async function scaffoldUiProject(
  options: UiScaffoldOptions,
  deps: UiScaffoldDependencies = {},
): Promise<UiScaffoldResult> {
  const name = options.name.trim();
  if (!name) throw new Error('Project name is required');

  const baseDir = options.baseDir ?? process.cwd();
  const targetDir = path.join(baseDir, name);

  const templateFetcher = deps.templateFetcher ?? new TemplateFetcher();
  await templateFetcher.smartFetch({
    repo: options.templateRepo,
    targetDir,
    branch: options.templateVersion,
    localPath: options.localPath,
  });

  const fileGenerator = deps.fileGenerator ?? new FileGenerator();
  fileGenerator.updatePackageJson(targetDir, name);

  const mcpInjector = deps.mcpInjector ?? new McpConfigInjector();
  mcpInjector.injectConfig(targetDir, options.framework);

  if (options.replaceTokens?.length) {
    for (const token of options.replaceTokens) {
      fileGenerator.replaceInFiles(targetDir, token.search, token.replace);
    }
  }

  if (options.installDeps) {
    fileGenerator.installDependencies(targetDir);
  }

  return {
    targetDir,
    installDeps: options.installDeps,
  };
}
