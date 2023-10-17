﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { Question } from 'inquirer';
import Generator from 'yeoman-generator';
import { DATASOURCES, IacList, SERVICES } from './enum';

export interface ProjectInfo {
  projectType: 'extension' | 'microservice' | 'application';
  dependencies: {
    [key: string]: string;
  };
}
export interface MicroserviceOptions extends Generator.GeneratorOptions {
  name?: string;
  baseService?: SERVICES;
  cdk?: boolean;
  baseOnService?: boolean;
  uniquePrefix?: string;
  help?: boolean;
  facade?: boolean;
  datasourceName?: string;
  datasourceType?: DATASOURCES;
  includeMigrations?: boolean;
  customMigrations?: boolean;
}

export interface ExtensionOptions extends Generator.GeneratorOptions {
  name?: string;
  help?: boolean;
}

export interface BackstageIntegrationOptions
  extends Generator.GeneratorOptions {
  owner?: string;
  description?: string;
}

export interface ScaffoldOptions extends BackstageIntegrationOptions {
  name?: string;
  help?: boolean;
  cwd?: string;
  issuePrefix?: string;
  integrateWithBackstage?: boolean;
}

export interface MigrationOptions extends Generator.GeneratorOptions {
  name?: string;
  includeMigrations?: boolean;
  customMigrations?: boolean;
}

export interface CdkOptions extends Generator.GeneratorOptions {
  iac?: IacList;
  dir?: string;
  packageJsonName?: string;
  applicationClassName?: string;
  relativePathToApp?: string;
  overwriteDockerfile?: boolean;
}

export type PromptFunction = (questions: Question[]) => Promise<AnyObject>;

// sonarignore:start
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = Record<string, any>;
// sonarignore:end

export type CommandTestCase = {
  name: string;
  options: AnyObject;
  argv?: string[];
  prompts: {
    input: AnyObject;
    output: string | boolean | AnyObject;
  }[];
};
