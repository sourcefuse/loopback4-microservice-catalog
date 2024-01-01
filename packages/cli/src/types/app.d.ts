// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
declare module '@loopback/cli/generators/app' {
  /* eslint-disable  @typescript-eslint/naming-convention */
  import ProjectGenerator from '@loopback/cli/lib/project-generator';
  import Generator from 'yeoman-generator';
  /* eslint-enable  @typescript-eslint/naming-convention */
  class AppGenerator<
    T extends Generator.GeneratorOptions,
  > extends ProjectGenerator<T> {
    constructor(args: string[], opts: T);
    _setupGenerator(): void;
    projectType: string;
    setOptions(): Promise<void>;
    promptProjectName(): Promise<void>;
    promptProjectDir(): Promise<void>;
    promptApplication(): Promise<void>;
    promptOptions(): Promise<void>;
    promptYarnInstall(): Promise<void>;
    buildAppClassMixins(): Promise<void>;
    scaffold(): boolean;
    install(): Promise<boolean>;
    end(): Promise<void>;
  }
  export = AppGenerator;
}
