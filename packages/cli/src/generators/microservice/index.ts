import {writeFileSync} from 'fs';
import {join} from 'path';
import {Question} from 'yeoman-generator';
import AppGenerator from '../../app-generator';
import {
  DATASOURCES,
  DATASOURCE_CONNECTORS,
  MIGRATIONS,
  MIGRATION_CONNECTORS,
  SERVICES,
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

  async promptName() {
    if (!this.shouldExit() && !this.options.name) {
      const {name} = await this.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Name of the microservice:',
          required: true,
        },
      ]);
      this.options.name = name;
    }
  }

  async setOptions() {
    return super.setOptions();
  }

  async promptProjectName() {
    return super.promptProjectName();
  }

  async promptUniquePrefix() {
    if (!this.shouldExit()) {
      if (!this.options.uniquePrefix) {
        const {uniquePrefix} = await this.prompt([
          {
            type: 'string',
            name: 'uniquePrefix',
            message: 'Unique prefix for the docker image:',
            default: this.options.name,
          },
        ]);
        this.options.uniquePrefix = uniquePrefix;
      }
    }
  }

  async promptFacade() {
    if (!this.shouldExit()) {
      if (!this.options.facade) {
        const {isFacade} = await this.prompt([
          {
            name: 'isFacade',
            type: 'confirm',
            message: 'Is this a facade?',
            default: false,
          },
        ]);
        this.options.facade = isFacade;
        this.projectInfo.facade = isFacade;
      } else {
        this.projectInfo.facade = this.options.facade;
      }
    }
  }

  async promptBaseService() {
    if (!this.shouldExit() && !this.options.facade) {
      if (!this.options.baseService) {
        const {baseOnService} = await this.prompt([
          {
            type: 'confirm',
            name: 'baseOnService',
            message: 'Do you want to base this on a sourceloop microservice?',
            default: false,
          },
        ]);
        if (baseOnService) {
          const {baseService} = await this.prompt([
            {
              name: 'baseService',
              type: 'list',
              choices: Object.values(SERVICES),
              message: 'Select the service you want to use:',
              required: true,
            },
          ]);
          this.options.baseService = baseService;
          this.projectInfo.serviceDependency = baseService;
        } else if (this.options.includeMigrations) {
          this.exit('--include-migrations option requires a base service');
        } else {
          // do nothing
        }
      } else {
        this.projectInfo.serviceDependency = this.options.baseService;
      }
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

  async promptDatasource() {
    if (!this.shouldExit() && !this.options.facade) {
      const prompts = [];

      if (!this.options.datasourceName) {
        prompts.push({
          type: 'input',
          name: 'datasourceName',
          message: 'Datasource name: ',
          default: 'db',
        });
      }

      if (!this.options.datasourceType) {
        prompts.push({
          type: 'list',
          name: 'datasourceType',
          message: 'Select the connector:',
          choices: Object.values(DATASOURCES),
          required: true,
        });
      }

      if (!this.options.customMigrations || !this.options.includeMigrations) {
        prompts.push({
          type: 'confirm',
          name: 'migrations',
          message: 'Do you want to add migration?',
          default: false,
        });
      }

      const answers = await this.prompt(prompts);
      this.options = {
        ...this.options,
        ...answers,
      };

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
  }

  async promptMigrationType() {
    if (
      !this.shouldExit() &&
      this.options.migrations &&
      !(this.options.customMigrations && this.options.includeMigrations) &&
      this.options.baseService
    ) {
      const prompts: Array<Question> = [
        {
          type: 'list',
          name: 'migrationType',
          choices: Object.values(MIGRATIONS),
          message: 'How do you want to setup the migrations?',
          default: MIGRATIONS.CUSTOM,
        },
      ];
      if (!this.options.datasourceType) {
        prompts.push({
          type: 'list',
          name: 'datasourceType',
          message: 'Select the connector:',
          choices: Object.values(DATASOURCES),
        });
      }
      const {migrationType} = await this.prompt(prompts);
      this.projectInfo.migrationType = migrationType;
      this.options.customMigrations =
        this.projectInfo.migrationType === MIGRATIONS.CUSTOM;
      this.options.includeMigrations =
        this.projectInfo.migrationType === MIGRATIONS.INCLUDED;
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
        this.fs.copyTpl(
          this.templatePath(DATASOURCE_INDEX),
          this.destinationPath(join('src', 'datasources', `index.ts`)),
          {
            name: this.options.datasourceName,
          },
        );
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
      ] = `DOCKER_BUILDKIT=1 sudo docker build --build-arg NR_ENABLED=$NR_ENABLED_VALUE -t $IMAGE_REPO_NAME/
      ${this.options.uniquePrefix}-$npm_package_name:$npm_package_version .`;
      scripts[
        'docker:push'
      ] = `sudo docker push $IMAGE_REPO_NAME/${this.options.uniquePrefix}-$npm_package_name:$npm_package_version`;
      scripts[
        'docker:build:dev'
      ] = `DOCKER_BUILDKIT=1 sudo docker build --build-arg NR_ENABLED=$NR_ENABLED_VALUE -t $IMAGE_REPO_NAME/
      ${this.options.uniquePrefix}-$npm_package_name:$IMAGE_TAG_VERSION .`;
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
      this.spawnCommand('npm', ['run', 'prettier:fix']);
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
