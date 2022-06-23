import {writeFileSync} from 'fs';
import {join} from 'path';
import AppGenerator from '../../app-generator';
import {
  DATASOURCES,
  DATASOURCE_CONNECTORS,
  MIGRATIONS,
  MIGRATION_CONNECTORS,
  SERVICES,
  BASESERVICEDSLIST,
} from '../../enum';
import {AnyObject, MicroserviceOptions} from '../../types';
import {
  appendDependencies,
  getDependencyVersion,
  JSON_SPACING,
} from '../../utils';

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

const BACK_TO_ROOT = join('..', '..');

const DEFAULT_NAME = 'microservice';

export default class MicroserviceGenerator extends AppGenerator<MicroserviceOptions> {
  constructor(args: string[], opts: MicroserviceOptions) {
    super(args, opts);
  }

  initializing() {
    if (!this.fs.exists(join(this.destinationPath(), 'lerna.json'))) {
      this.exit('Can create a microservice only from the root of a mono repo');
    }
  }

  _setupGenerator() {
    return super._setupGenerator();
  }

  async setOptions() {
    return super.setOptions();
  }

  async promptProjectName() {
    return super.promptProjectName();
  }

  async promptFacade() {
    this.projectInfo.facade = this.options.facade;
  }

  async promptBaseService() {
    if (this.options.baseService) {
      this.projectInfo.serviceDependency = this.options.baseService;
    }
  }

  async promptApplication() {
    return super.promptApplication();
  }

  async promptOptions() {
    return super.promptOptions();
  }

  async buildAppClassMixins() {
    return super.buildAppClassMixins();
  }

  async setDatasource() {
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

  async setMigrationType() {
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
    const type = this.options.facade ? 'facades' : 'services';
    if (!this.shouldExit()) {
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

  writing() {
    if (!this.shouldExit()) {
      if (this.options.datasourceName) {
        const nameArr = [this.options.datasourceName];

        this._setDataSourceName();

        this.fs.copyTpl(
          this.templatePath(DATASOURCE_TEMPLATE),
          this.destinationPath(
            join(
              'src',
              'datasources',
              `${this.options.datasourceName}.datasource.ts`,
            ),
          ),
          {
            project: this.projectInfo,
          },
        );
        if (this.projectInfo.baseServiceCacheName) {
          this.fs.copyTpl(
            this.templatePath(REDIS_DATASOURCE),
            this.destinationPath(
              join('src', 'datasources', 'redis.datasource.ts'),
            ),
            {
              project: this.projectInfo,
            },
          );
          nameArr.push('redis');
        }
        this.fs.copyTpl(
          this.templatePath(DATASOURCE_INDEX),
          this.destinationPath(join('src', 'datasources', `index.ts`)),
          {
            nameArr: nameArr,
          },
        );
      } else {
        this._createFacadeRedisDatasource();
      }
    }
  }

  install() {
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
      scripts['prestart'] = 'npm run rebuild && npm run openapi-spec';
      scripts['rebuild'] = 'npm run clean && npm run build';
      scripts['start'] =
        'node -r ./dist/opentelemetry-registry.js -r source-map-support/register .';
      scripts[
        'docker:build'
      ] = `DOCKER_BUILDKIT=1 sudo docker build --build-arg NR_ENABLED=$NR_ENABLED_VALUE -t $IMAGE_REPO_NAME/${this.options.uniquePrefix}-$npm_package_name:$npm_package_version .`;
      scripts[
        'docker:push'
      ] = `sudo docker push $IMAGE_REPO_NAME/${this.options.uniquePrefix}-$npm_package_name:$npm_package_version`;
      scripts[
        'docker:build:dev'
      ] = `DOCKER_BUILDKIT=1 sudo docker build --build-arg NR_ENABLED=$NR_ENABLED_VALUE -t $IMAGE_REPO_NAME/${this.options.uniquePrefix}-$npm_package_name:$IMAGE_TAG_VERSION .`;
      scripts[
        'docker:push:dev'
      ] = `sudo docker push $IMAGE_REPO_NAME/${this.options.uniquePrefix}-$npm_package_name:$IMAGE_TAG_VERSION`;
      scripts['coverage'] = 'nyc npm run test';
      packageJson.scripts = scripts;
      if (this.options.baseService) {
        packageJson.dependencies[`@sourceloop/${this.options.baseService}`] =
          getDependencyVersion(
            this.projectInfo.dependencies,
            `@sourceloop/${this.options.baseService}`,
          );
      }
      writeFileSync(
        packageJsonFile,
        JSON.stringify(packageJson, undefined, JSON_SPACING),
      );
      this.spawnCommandSync('npm', ['i']);
      this.spawnCommandSync('npm', ['run', 'prettier:fix']);
      this.destinationRoot(BACK_TO_ROOT);
      if (this.options.migrations) {
        if (!this._migrationExists()) {
          this._createMigrationPackage();
        }
        if (this.options.customMigrations) {
          this._createCustomMigration();
        } else if (this.options.includeMigrations) {
          this._includeSourceloopMigrations();
        } else {
          // do nothing
        }
        this._addMigrationScripts();
      }
      return true;
    } else {
      return false;
    }
  }

  private _setDataSourceName() {
    if (this.options.datasourceName && this.options.baseService) {
      const datasourceList = BASESERVICEDSLIST[this.options.baseService];
      datasourceList.forEach(ds => {
        if (ds.type === 'store') {
          this.projectInfo.baseServiceStoreName = ds.name;
        } else {
          this.projectInfo.baseServiceCacheName = ds.name;
        }
      });
    }
  }

  private _createFacadeRedisDatasource() {
    if (this.options.facade) {
      const nameArr = ['redis'];
      this.fs.copyTpl(
        this.templatePath(REDIS_DATASOURCE),
        this.destinationPath(join('src', 'datasources', 'redis.datasource.ts')),
        {
          project: this.projectInfo,
        },
      );
      this.fs.copyTpl(
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

  private _createMigrationPackage() {
    this.copyTemplatedFiles(
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
  }

  private _createCustomMigration() {
    const name = this.options.name ?? DEFAULT_NAME;
    let connector = MIGRATION_CONNECTORS[DATASOURCES.POSTGRES]; // default
    if (this.options.datasourceType) {
      connector = MIGRATION_CONNECTORS[this.options.datasourceType];
    }
    this.fs.copyTpl(
      this.templatePath(MIGRATION_TEMPLATE),
      this.destinationPath(join(MIGRATION_FOLDER, name, 'database.json')),
      {
        name: name.toUpperCase(),
        connector,
      },
    );
  }

  private _includeSourceloopMigrations() {
    const name = this.options.name ?? DEFAULT_NAME;
    if (!this.shouldExit() && this.options.baseService) {
      this.fs.copy(
        this.destinationPath(
          join(
            'services',
            name,
            sourceloopMigrationPath(this.options.baseService),
          ),
        ),
        this.destinationPath(join(MIGRATION_FOLDER, name)),
      );
      let connector = MIGRATION_CONNECTORS[DATASOURCES.POSTGRES]; // default
      if (this.options.datasourceType) {
        connector = MIGRATION_CONNECTORS[this.options.datasourceType];
      }
      this.fs.copyTpl(
        this.templatePath(MIGRATION_TEMPLATE),
        this.destinationPath(join(MIGRATION_FOLDER, name, 'database.json')),
        {
          name: name.toUpperCase(),
          connector,
        },
      );
    }
  }

  private _migrationExists() {
    return this.fs.exists(
      this.destinationPath(join('packages', 'migrations', 'package.json')),
    );
  }

  private _addMigrationScripts() {
    try {
      const packageJsFile = 'packages/migrations/package.json';
      const packageJs = this.fs.readJSON(packageJsFile) as AnyObject;
      const script = packageJs.scripts;
      script[
        `db:migrate:${this.options.name}`
      ] = `./node_modules/.bin/db-migrate up --config '${this.options.name}/database.json' -m '${this.options.name}/migrations'`;
      script[
        `db:migrate-down:${this.options.name}`
      ] = `./node_modules/.bin/db-migrate down --config '${this.options.name}/database.json' -m '${this.options.name}/migrations'`;
      script[
        `db:migrate-reset:${this.options.name}`
      ] = `./node_modules/.bin/db-migrate reset --config '${this.options.name}/database.json' -m '${this.options.name}/migrations'`;

      packageJs.scripts = script;
      writeFileSync(
        packageJsFile,
        JSON.stringify(packageJs, undefined, JSON_SPACING),
      );
    } catch {
      //do nothing
    }
  }

  async end() {
    if (this.projectInfo) {
      this.projectInfo.outdir = this.options.name ?? DEFAULT_NAME;
    }
    await super.end();
  }
}
