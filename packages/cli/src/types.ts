import {DATASOURCES, SERVICES} from './enum';
import Generator from 'yeoman-generator';

export interface ProjectInfo {
  projectType: 'extension' | 'microservice' | 'application';
  dependencies: {
    [key: string]: string;
  };
}
export interface MicroserviceOptions extends Generator.GeneratorOptions {
  name?: string;
  baseService?: SERVICES;
  uniquePrefix?: string;
  help?: boolean;
  facade?: boolean;
  datasourceName?: string;
  datasourceType?: DATASOURCES;
  includeMigrations?: boolean;
  customMigrations?: boolean;
  migrations?: boolean;
}

export interface ExtensionOptions extends Generator.GeneratorOptions {
  name?: string;
  help?: boolean;
}

export interface ScaffoldOptions extends Generator.GeneratorOptions {
  name?: string;
  help?: boolean;
  cwd?: string;
}

export interface MigrationOptions extends Generator.GeneratorOptions {
  name?: string;
  includeMigrations?: boolean;
  customMigrations?: boolean;
}

// sonarignore:start
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = Record<string, any>;
// sonarignore:end
