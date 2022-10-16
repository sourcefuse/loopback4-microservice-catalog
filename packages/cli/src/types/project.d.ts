// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.

// https://opensource.org/licenses/MIT
declare module '@loopback/cli/lib/project-generator' {
  import BaseGenerator from '@loopback/cli/lib/base-generator';
  import Generator from 'yeoman-generator';
  type DataSourceMap = import('../enum').DataSourceMap;
  class ProjectGenerator<
    T extends Generator.GeneratorOptions,
  > extends BaseGenerator<T> {
    constructor(args: string[], opts: T);
    buildOptions: {
      name: string;
      description: string;
    }[];
    _setupGenerator(): void;
    /**
     * Registers a Transform Stream with Yeoman. Removes `.ejs` extension
     * from files that have it during project generation.
     */
    _setupRenameTransformer(): void;
    setOptions(): Promise<void>;
    projectInfo: {
      name: string;
      outdir: string;
      projectType: 'extension' | 'microservice' | 'application';
      serviceDependency: string;
      dependencies: {
        [key: string]: string;
      };
      migrationType?: string;
      datasourceName?: string;
      datasourceClassName?: string;
      datasourceConnector?: string;
      datasourceConnectorName?: string;
      datasourceType?: string;
      facade?: boolean;
      baseServiceStoreName?: string;
      baseServiceCacheName?: string;
      baseServiceDSList?: DataSourceMap[];
      baseServiceComponentName?: string;
    };
    projectOptions: string[];
    promptProjectName(): Promise<void>;
    promptProjectDir(): Promise<void>;
    promptOptions(): Promise<void>;
    promptYarnInstall(): Promise<void>;
    scaffold(): boolean;
  }
  export = ProjectGenerator;
}
