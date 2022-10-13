// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
declare module '@loopback/cli/generators/extension' {
  import ProjectGenerator from '@loopback/cli/lib/project-generator';
  import Generator from 'yeoman-generator';
  class ExtensionGenerator<
    T extends Generator.GeneratorOptions,
  > extends ProjectGenerator<T> {
    constructor(args: string[], opts: T);
    _setupGenerator(): void;
    projectType: string;
    setOptions(): Promise<void>;
    promptProjectName(): Promise<void>;
    promptProjectDir(): Promise<void>;
    promptComponent(): Promise<void>;
    promptOptions(): Promise<void>;
    promptYarnInstall(): Promise<void>;
    scaffold(): boolean;
    install(): boolean;
    end(): Promise<void>;
  }
  export = ExtensionGenerator;
}
