// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import fs from 'fs';
import {join} from 'path';
// eslint-disable-next-line @typescript-eslint/naming-convention
import AppGenerator from '../../app-generator';
import {
  BASESERVICEBINDINGLIST,
  BASESERVICECOMPONENTLIST,
  BASESERVICEDSLIST,
  DATASOURCES,
  DATASOURCE_CONNECTORS,
  MIGRATIONS,
  MIGRATION_CONNECTORS,
  SEQUELIZESERVICES,
  SERVICES,
} from '../../enum';
import {AnyObject, MicroserviceOptions} from '../../types';
import {
  JSON_SPACING,
  appendDependencies,
  getDependencyVersion,
} from '../../utils';
const chalk = require('chalk'); //NOSONAR
const {promisify} = require('util');

const DATASOURCE_TEMPLATE = join(
  '..',
  '..',
  'datasource',
  'templates',
  'name.datasource.ts.tpl',
);

const REDIS_DATASOURCE = join(
  '..',
  '..',
  'datasource',
  'templates',
  'redis.datasource.ts.tpl',
);

const DATASOURCE_INDEX = join(
  '..',
  '..',
  'datasource',
  'templates',
  'index.ts.tpl',
);

const MIGRATION_PACKAGE_TEMPLATE = join(
  '..',
  '..',
  'migration-package',
  'templates',
);
const MIGRATION_TEMPLATE = join(
  '..',
  '..',
  'migration',
  'templates',
  'database.json.tpl',
);

const MIGRATION_FOLDER = join('packages', 'migrations');

const sourceloopMigrationPath = (packageName: SERVICES) =>
  join('node_modules', `@sourceloop/${packageName}`, 'migrations');

const baseServicePath = (servicename: SERVICES) =>
  join('node_modules', `@sourceloop/${servicename}`);

const BACK_TO_ROOT = join('..', '..');

const DEFAULT_NAME = 'microservice';

const dbconfig = 'database.json';

const ENV_EXAMPLE = '.env.example';
const ENV_DEFAULT = '.env.defaults';

export default class MicroserviceGenerator extends AppGenerator<MicroserviceOptions> {
  initializing() {
    if (!this.fs.exists(join(this.destinationPath(), 'lerna.json'))) {
      this.exit('Can create a microservice only from the root of a mono repo');
    }
  }

  _setupGenerator() {
    return super._setupGenerator();
  }

  async setOptions() {
    if (this.shouldExit()) return;
    return super.setOptions();
  }

  async setFacade() {
    if (this.shouldExit()) return false;
    this.projectInfo.facade = this.options.facade;
  }

  async setBaseService() {
    if (this.shouldExit()) return false;
    if (this.options.baseService) {
      this.projectInfo.serviceDependency = this.options.baseService;
    }
  }

  //Loopback4 prompts
  async promptProjectName() {
    if (this.shouldExit()) return;
    return super.promptProjectName();
  }

  async promptApplication() {
    if (this.shouldExit()) return;
    return super.promptApplication();
  }

  async promptOptions() {
    if (this.shouldExit()) return;
    return super.promptOptions();
  }

  async buildAppClassMixins() {
    if (this.shouldExit()) return;
    return super.buildAppClassMixins();
  }

  async setDatasource() {
    if (this.shouldExit()) return false;
    this.projectInfo.datasourceName = this.options.datasourceName;
    this.projectInfo.datasourceClassName = this._capitalizeFirstLetter(
      this.options.datasourceName,
    );
    this.projectInfo.datasourceConnector =
      DATASOURCE_CONNECTORS[
        this.options.datasourceType ?? DATASOURCES.POSTGRES
      ];
    this.projectInfo.datasourceConnectorName =
      this.projectInfo.datasourceConnector;
    this.projectInfo.datasourceType = this.options.datasourceType;
  }
  async setSequelize() {
    if (this.shouldExit()) return false;
    this.projectInfo.sequelize = this.options.sequelize;
    if (this.projectInfo.sequelize) {
      this.projectInfo.baseServiceBindingName =
        this._setBaseServiceBindingName();
    }
  }
  private _setBaseServiceBindingName() {
    if (this.options.baseService) {
      const missingServices = Object.values(SERVICES).filter(service => {
        if (
          !Object.values(SEQUELIZESERVICES).includes(
            service as unknown as SEQUELIZESERVICES,
          )
        )
          return true;
        return false;
      });
      if (missingServices.includes(this.options.baseService)) {
        this.log(
          chalk.yellow(
            `"${this.options.baseService}" will be supporting sequelize soon.`,
          ),
        );
        this.projectInfo.sequelize = false;
      } else {
        return BASESERVICEBINDINGLIST[this.options.baseService];
      }
    }
  }

  async setMigrationType() {
    if (this.shouldExit()) return false;
    if (this.options.customMigrations) {
      this.options.migrations = true;
      this.projectInfo.migrationType = MIGRATIONS.CUSTOM;
    } else if (this.options.includeMigrations) {
      this.options.migrations = true;
      this.projectInfo.migrationType = MIGRATIONS.INCLUDED;
    } else {
      // do nothing
    }
  }

  scaffold() {
    if (this.shouldExit()) return false;
    const type = this.options.facade ? 'facades' : 'services';
    if (!this.shouldExit()) {
      if (type === 'services') {
        this.projectInfo.baseServiceComponentName =
          this._setBaseServiceComponentName();
        const baseServiceDSList = this._setDataSourceName();
        this.projectInfo.baseServiceDSList = baseServiceDSList.filter(
          ds => ds.type === 'store',
        );
        const redisDsPresent = baseServiceDSList.filter(
          ds => ds.type === 'cache',
        );
        this.projectInfo.baseServiceCacheName =
          redisDsPresent[0]?.name ||
          (redisDsPresent.length ? 'redis' : undefined);
      }
      this.destinationRoot(join(type, this.options.name ?? DEFAULT_NAME));
      this.projectInfo.dependencies = appendDependencies(
        this.projectInfo.dependencies,
      );
      this.projectInfo.projectType = 'microservice';
      this.projectInfo.name = this.options.name ?? DEFAULT_NAME;
      return super.scaffold();
    } else {
      return false;
    }
  }

  async writing() {
    if (this.shouldExit()) return false;
    if (!this.shouldExit()) {
      if (this.options.baseService ?? this.options.datasourceName) {
        await this._createDataSourceAsync();
      } else {
        await this._createFacadeRedisDatasourceAsync();
      }
    }
  }

  async install() {
    if (this.shouldExit()) return false;
    if (!this.shouldExit()) {
      const packageJsonFile = join(this.destinationPath(), 'package.json');
      const packageJson = this.fs.readJSON(packageJsonFile) as AnyObject;
      packageJson.name = `${this.options.uniquePrefix}-${packageJson.name}`;
      packageJson.license = 'MIT';
      const scripts = packageJson.scripts;
      const symlinkresolver = 'symlink-resolver';
      scripts[symlinkresolver] = symlinkresolver;
      scripts['resolve-links'] =
        'npm run symlink-resolver build ./node_modules/@local';
      scripts['prestart'] = 'npm run clean && npm run openapi-spec';
      scripts['rebuild'] = 'npm run clean && npm run build';
      scripts['start'] =
        'node -r ./dist/opentelemetry-registry.js -r source-map-support/register .';
      scripts['docker:build'] =
        `DOCKER_BUILDKIT=1 sudo docker build --build-arg NR_ENABLED=$NR_ENABLED_VALUE --build-arg FROM_FOLDER=services --build-arg SERVICE_NAME=${this.options.baseService} -t $IMAGE_REPO_NAME/$npm_package_name:$npm_package_version ../../. -f ./Dockerfile`;

      scripts['docker:push'] =
        ` docker push $IMAGE_REPO_NAME/$npm_package_name:$npm_package_version`;
      scripts['docker:build:dev'] =
        `DOCKER_BUILDKIT=1 sudo docker build --build-arg NR_ENABLED=$NR_ENABLED_VALUE --build-arg FROM_FOLDER=services --build-arg SERVICE_NAME=${this.options.baseService} -t $IMAGE_REPO_NAME/$npm_package_name:$npm_package_version ../../. -f ./Dockerfile`;
      scripts['docker:push:dev'] =
        ` docker push $IMAGE_REPO_NAME/$npm_package_name:$npm_package_version`;
      scripts['coverage'] = 'nyc npm run test';

      packageJson.scripts = scripts;
      if (this.options.baseService) {
        packageJson.dependencies[`@sourceloop/${this.options.baseService}`] =
          getDependencyVersion(
            this.projectInfo.dependencies,
            `@sourceloop/${this.options.baseService}`,
          );
      }
      const writeFileAsync = promisify(fs.writeFile);
      await writeFileAsync(
        packageJsonFile,
        JSON.stringify(packageJson, undefined, JSON_SPACING),
      );

      this.destinationRoot(join(this.destinationPath(), BACK_TO_ROOT));
      await this.spawnCommand('npx', ['lerna', 'clean']);
      await this.spawnCommand('npm', ['i']);

      await this._addMigrations();
      await this._updateEnvFiles();
      return true;
    }
    return false;
  }

  async _addMigrations() {
    if (this.options.migrations) {
      if (!(await this._migrationExists())) {
        await this._createMigrationPackageAsync();
      }
      if (this.options.customMigrations) {
        await this._createCustomMigrationAsync();
      } else if (this.options.includeMigrations) {
        await this._includeSourceloopMigrationsAsync();
      } else {
        // do nothing
      }
      await this._addMigrationScriptsAsync();
    }
  }

  addScope() {
    if (this.shouldExit()) return false;
    let czConfig = this.fs.read(
      join(this.destinationPath(), '../../', '.cz-config.js'),
    );
    const lastScopeIndex = czConfig.indexOf(
      '[',
      czConfig.lastIndexOf('scopes'),
    );
    const offset = 2;
    const firstPart = czConfig.slice(0, lastScopeIndex + offset);
    const secPart = czConfig.slice(lastScopeIndex + offset);
    const suffix = this.options.facade ? 'facade' : 'service';

    const stringToAdd =
      `{name: '${this.options.name}` + '-' + `${suffix}'}, \n`;

    czConfig = firstPart + stringToAdd + secPart;
    fs.writeFile(
      join(this.destinationPath(), '../../', '.cz-config.js'),
      czConfig,
      {
        flag: 'w',
      },
      function () {
        //This is intentional.
      },
    );
  }

  async _appendDockerScript() {
    const packageJsonFile = join(this.destinationRoot(), './package.json');
    const packageJson = this.fs.readJSON(packageJsonFile) as AnyObject;
    const scripts = {...packageJson.scripts};
    scripts[`docker:build:${this.options.baseService}`] =
      `docker build --build-arg SERVICE_NAME=${this.options.baseService} --build-arg FROM_FOLDER=services -t $REPOSITORY_URI:${this.options.baseService} -f ./services/${this.options.name}/Dockerfile .`;
    packageJson.scripts = scripts;
    const writeFileAsync = promisify(fs.writeFile);

    await writeFileAsync(
      packageJsonFile,
      JSON.stringify(packageJson, undefined, JSON_SPACING),
      function () {
        //This is intentional.
      },
    );
  }
  private _setDataSourceName() {
    if (this.options.baseService) {
      return BASESERVICEDSLIST[this.options.baseService];
    } else return [];
  }

  private _setBaseServiceComponentName() {
    if (this.options.baseService) {
      return BASESERVICECOMPONENTLIST[this.options.baseService];
    } else return undefined;
  }

  private async _createDataSourceAsync() {
    const baseServiceDSList = this._setDataSourceName();
    if (this.options.datasourceName && baseServiceDSList.length === 0) {
      baseServiceDSList?.push({
        type: 'store',
        name: this.options.datasourceName,
        fileName: this.options.datasourceName,
        isNotBase: true,
      });
    } else if (this.options.datasourceName && baseServiceDSList.length !== 0) {
      baseServiceDSList[0].fileName = this.options.datasourceName;
    } else {
      //do nothing
    }
    const promises = baseServiceDSList.map(async ds => {
      if (ds.type === 'store') {
        if (!ds.isNotBase) this.projectInfo.baseServiceStoreName = ds.name;
        this.projectInfo.datasourceName = ds.fileName;
        this.projectInfo.datasourceClassName = this._capitalizeFirstLetter(
          ds.fileName,
        );
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        //@ts-ignore
        await this.fs.copyTplAsync(
          this.templatePath(DATASOURCE_TEMPLATE),
          this.destinationPath(
            join('src', 'datasources', `${ds.fileName}.datasource.ts`),
          ),
          {
            project: this.projectInfo,
          },
        );

        this.projectInfo.baseServiceStoreName = undefined; //so that previous value is not used
      } else {
        this.projectInfo.baseServiceCacheName = ds.name;
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        //@ts-ignore
        await this.fs.copyTplAsync(
          this.templatePath(REDIS_DATASOURCE),
          this.destinationPath(
            join('src', 'datasources', `${ds.fileName}.datasource.ts`),
          ),
          {
            project: this.projectInfo,
          },
        );
      }
    });
    await Promise.all(promises);

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath(DATASOURCE_INDEX),
      this.destinationPath(join('src', 'datasources', `index.ts`)),
      {
        nameArr: baseServiceDSList,
      },
    );
  }

  private async _createFacadeRedisDatasourceAsync() {
    if (this.options.facade) {
      const nameArr = [
        {
          type: 'cache',
          name: 'Redis',
          fileName: 'redis',
        },
      ];
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      //@ts-ignore
      await this.fs.copyTplAsync(
        this.templatePath(REDIS_DATASOURCE),
        this.destinationPath(join('src', 'datasources', 'redis.datasource.ts')),
        {
          project: this.projectInfo,
        },
      );
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      //@ts-ignore
      await this.fs.copyTplAsync(
        this.templatePath(DATASOURCE_INDEX),
        this.destinationPath(join('src', 'datasources', `index.ts`)),
        {
          nameArr: nameArr,
        },
      );
    }
  }

  private _capitalizeFirstLetter(str?: string): string | undefined {
    if (str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }

  async _createMigrationPackageAsync() {
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath(MIGRATION_PACKAGE_TEMPLATE),
      this.destinationPath(),
      {
        project: this.projectInfo,
      },
      {},
      {
        processDestinationPath: (destPath: string) =>
          destPath.replace('.ejs', ''),
      },
    );
    // for the tpl files
    const tplFilePath = this.templatePath(
      join(MIGRATION_PACKAGE_TEMPLATE, 'packages', 'migrations'),
    );

    const readdriAsync = promisify(fs.readdir);
    const files = await readdriAsync(
      this.templatePath(
        join(MIGRATION_PACKAGE_TEMPLATE, 'packages', 'migrations'),
      ),
    );
    const promises = files.map(async (file: string) => {
      if (file.includes('.tpl')) {
        const targetFileName = file.replace('.tpl', '');
        const sourcePath = join(tplFilePath, file);
        const destinationPath = join(
          this.destinationRoot(),
          MIGRATION_FOLDER,
          targetFileName,
        );
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        //@ts-ignore
        await this.fs.copyTplAsync(sourcePath, destinationPath, {
          name: this.options.name
            ? this.options.name.toUpperCase()
            : DEFAULT_NAME,
        });
      }
    });

    await Promise.all(promises);
  }

  private async _createCustomMigrationAsync() {
    const name = this.options.name ?? DEFAULT_NAME;
    let connector = MIGRATION_CONNECTORS[DATASOURCES.POSTGRES]; // default
    if (this.options.datasourceType) {
      connector = MIGRATION_CONNECTORS[this.options.datasourceType];
    }
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath(MIGRATION_TEMPLATE),
      this.destinationPath(join(MIGRATION_FOLDER, name, dbconfig)),
      {
        name: name.toUpperCase(),
        connector,
      },
    );
  }

  private async _includeSourceloopMigrationsAsync() {
    const name = this.options.name ?? DEFAULT_NAME;
    if (!this.shouldExit() && this.options.baseService) {
      const dsType =
        this.options.datasourceType === DATASOURCES.POSTGRES ? 'pg' : 'mysql';
      const destinationPath = this.destinationPath(
        sourceloopMigrationPath(this.options.baseService),
        dsType,
        'migrations',
      );

      try {
        await fs.promises.access(destinationPath);
      } catch (error) {
        // Handle the error or perform actions when the file/directory doesn't exist
        this.log(
          chalk.cyan(
            `Since migrations do not exist in the base service, generating without migrations ${error}`,
          ),
        );
        return;
      }
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      //@ts-ignore
      await this.fs.copyAsync(
        this.destinationPath(
          sourceloopMigrationPath(this.options.baseService),
          dsType,
          'migrations',
        ),
        this.destinationPath(join(MIGRATION_FOLDER, name, 'migrations')),
      );
      let connector = MIGRATION_CONNECTORS[DATASOURCES.POSTGRES]; // default
      if (this.options.datasourceType) {
        connector = MIGRATION_CONNECTORS[this.options.datasourceType];
      }
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      //@ts-ignore
      await this.fs.copyTplAsync(
        this.templatePath(MIGRATION_TEMPLATE),
        this.destinationPath(join(MIGRATION_FOLDER, name, dbconfig)),
        {
          name: name.toUpperCase(),
          connector,
        },
      );
    }
  }

  private async _migrationExists() {
    try {
      await fs.promises.access(
        this.destinationPath(join('packages', 'migrations', 'package.json')),
      );
      // File exists
      return true;
    } catch (error) {
      this.log(chalk.cyan(`No migrations found ${error}`));
      return false;
    }
  }

  private async _addMigrationScriptsAsync() {
    try {
      const packageJsFile = 'packages/migrations/package.json';
      const packageJs = this.fs.readJSON(packageJsFile) as AnyObject;
      const script = packageJs.scripts;
      script[`db:migrate:${this.options.name}`] =
        `db-migrate up --config '${this.options.name}/database.json' -m '${this.options.name}/migrations'`;
      script[`db:migrate-down:${this.options.name}`] =
        `db-migrate down --config '${this.options.name}/database.json' -m '${this.options.name}/migrations'`;
      script[`db:migrate-reset:${this.options.name}`] =
        `db-migrate reset --config '${this.options.name}/database.json' -m '${this.options.name}/migrations'`;

      packageJs.scripts = script;

      const writeFileAsync = promisify(fs.writeFile);

      await writeFileAsync(
        packageJsFile,
        JSON.stringify(packageJs, undefined, JSON_SPACING),
      );
      const name = this.options.name
        ? this.options.name.toUpperCase()
        : DEFAULT_NAME;

      let migEnv = this.fs.read(join(MIGRATION_FOLDER, ENV_EXAMPLE));
      const envToAdd = `\n${name}_DB_HOST= \n${name}_DB_PORT= \n${name}_DB_USER= 
      \n${name}_DB_DATABASE= \n${name}_DB_PASSWORD=`;
      migEnv = migEnv + envToAdd;
      fs.writeFile(
        join(MIGRATION_FOLDER, ENV_EXAMPLE),
        migEnv,
        {
          flag: 'w',
        },
        function () {
          //This is intentional.
        },
      );
    } catch {
      //do nothing
    }
  }

  async _updateEnvFiles() {
    //if env.example present in base service then copy that
    if (this.options.baseService) {
      const envExists = this.fs.exists(
        join(
          this.destinationPath(),
          baseServicePath(this.options.baseService),
          ENV_EXAMPLE,
        ),
      );
      if (envExists) {
        const example = this.fs.read(
          join(
            this.destinationPath(),
            baseServicePath(this.options.baseService),
            ENV_EXAMPLE,
          ),
        );
        const defaults = this.fs.read(
          join(
            this.destinationPath(),
            baseServicePath(this.options.baseService),
            ENV_DEFAULT,
          ),
        );

        fs.writeFile(
          join(
            this.destinationPath(),
            'services',
            this.options.name ?? DEFAULT_NAME,
            ENV_EXAMPLE,
          ),
          example,
          {
            flag: 'w',
          },
          function () {
            //This is intentional.
          },
        );
        fs.writeFile(
          join(
            this.destinationPath(),
            'services',
            this.options.name ?? DEFAULT_NAME,
            ENV_DEFAULT,
          ),
          defaults,
          {
            flag: 'w',
          },
          function () {
            //This is intentional.
          },
        );
      }
    }
  }

  async end() {
    if (this.projectInfo) {
      this.projectInfo.outdir = this.options.name ?? DEFAULT_NAME;
    }
    await super.end();
  }
}
