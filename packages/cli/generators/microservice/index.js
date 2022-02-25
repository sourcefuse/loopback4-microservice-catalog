// Copyright IBM Corp. 2017,2020. All Rights Reserved.
// Node module: @loopback/cli
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';
const AppGenerator = require('@loopback/cli/generators/app');
const path = require('path');
const spawnProcess = require('../spawn');
const fs = require('fs');
const g = require('@loopback/cli/lib/globalize');
const {logBar, logBarStart, logBarStop} = require('../logbar');
const changeFileName = require('../datasourcerename');
const cliProgress = require('cli-progress');
const {eventNames} = require('process');
const bar1 = new cliProgress.Bar(
  {
    format: 'progress [{bar}] {percentage}% | {value}/{total} ',
  },
  cliProgress.Presets.shades_classic,
);

module.exports = class MGenerator extends AppGenerator {
  constructor(args, opts) {
    super(args, opts);
  }

  _setupGenerator() {
    super.option('serviceDependency', {
      type: String,
      description: g.f('Dependency service name'),
    });
    return super._setupGenerator();
  }

  setOptions() {
    if (this.shouldExit()) {
      return undefined;
    } else {
      return super.setOptions();
    }
  }

  promptProjectName() {
    if (this.shouldExit()) {
      return undefined;
    } else {
      return super.promptProjectName();
    }
  }

  promptProjectDir() {
    if (this.shouldExit()) {
      return undefined;
    } else {
      return super.promptProjectDir();
    }
  }

  connectorChoices = ['postgresql', 'mysql'];

  serviceChoices = [
    'audit-service',
    'authentication-service',
    'chat-service',
    'notification-service',
    'bpmn-service',
    'feature-toggle-service',
    'in-mail-service',
    'payment-service',
    'scheduler-service',
    'search-service',
    'video-conferencing-service',
  ];

  async promptUniquePrefix() {
    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'uniquePrefix',
        message: 'Unique prefix for the docker image:',
      },
      {
        type: 'input',
        name: 'dbName',
        message: 'Datasource name:',
      },
      {
        type: 'list',
        name: 'dbConnector',
        message: 'Select the connector:',
        choices: this.connectorChoices,
      },
      {
        type: 'input',
        name: 'migratedb',
        message: 'Do you want to add migration?(y/n)',
      },
      {
        type: 'input',
        name: 'serviceSelect',
        message: 'Do you want to add sourceloop dependencies?(y/n)',
      },
    ]);

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    this.projectInfo.datasourceName = this.answers.dbName;
    this.projectInfo.datasourceClassName = capitalizeFirstLetter(
      this.answers.dbName,
    );
    this.projectInfo.datasourceConnectorName = this.answers.dbConnector;

    if (
      this.answers.serviceSelect === 'y' ||
      this.answers.serviceSelect === 'Y'
    ) {
      this.service = await this.prompt([
        {
          name: 'selector',
          message: 'Select the service you want to add:',
          type: 'list',
          choices: this.serviceChoices,
        },
        {
          type: 'input',
          name: 'copymigratdb',
          message: 'Do you want to copy migration?(y/n)',
        },
      ]);
      this.projectInfo.serviceDependency = this.service.selector;
    }
  }

  promptApplication() {
    if (this.shouldExit()) {
      return undefined;
    } else {
      return super.promptApplication();
    }
  }

  promptOptions() {
    if (this.shouldExit()) {
      return undefined;
    } else {
      return super.promptOptions();
    }
  }

  promptYarnInstall() {
    if (this.shouldExit()) {
      return undefined;
    } else {
      return super.promptYarnInstall();
    }
  }

  buildAppClassMixins() {
    if (this.shouldExit()) {
      return undefined;
    } else {
      return super.buildAppClassMixins();
    }
  }

  scaffold() {
    return super.scaffold();
  }

  install() {
    const packageJsonFile = path.join(process.cwd(), 'package.json');
    const packageJson = require(packageJsonFile);
    packageJson.name = `${this.answers.uniquePrefix}-${packageJson.name}`;
    packageJson.license='MIT';
    const scripts = packageJson.scripts;
    const symlinkresolver = 'symlink-resolver';
    this._setupMicroservice(packageJson.name);
    scripts[symlinkresolver] = symlinkresolver;
    scripts['resolve-links'] = "npm run symlink-resolver build ./node_modules/@local";
    scripts['prestart'] = "npm run rebuild && npm run openapi-spec";
    scripts['rebuild'] = "npm run clean && npm run build";
    scripts['start'] = "node -r ./dist/opentelemetry-registry.js -r source-map-support/register .";
    scripts['docker:build'] = `DOCKER_BUILDKIT=1 sudo docker build --build-arg NR_ENABLED=$NR_ENABLED_VALUE -t $IMAGE_REPO_NAME/
    ${this.answers.uniquePrefix}-$npm_package_name:$npm_package_version .`;
    scripts['docker:push'] = `sudo docker push $IMAGE_REPO_NAME/${this.answers.uniquePrefix}-$npm_package_name:$npm_package_version`;
    scripts['docker:build:dev'] = `DOCKER_BUILDKIT=1 sudo docker build --build-arg NR_ENABLED=$NR_ENABLED_VALUE -t $IMAGE_REPO_NAME/
    ${this.answers.uniquePrefix}-$npm_package_name:$IMAGE_TAG_VERSION .`;
    scripts['docker:push:dev'] = `sudo docker push $IMAGE_REPO_NAME/${this.answers.uniquePrefix}-$npm_package_name:$IMAGE_TAG_VERSION`;
    scripts['coverage'] = "nyc npm run test";
    packageJson.scripts = scripts;
    fs.writeFileSync(packageJsonFile, JSON.stringify(packageJson), null, 2);
    return super.install();
  }
  _setupMicroservice(packageName){
    this._symlink(packageName)
      .then(() =>
        this._sourceloopCore(packageName).then(() =>
          this._bearerVerifier(packageName).then(() =>
            this._dotenv(packageName).then(() =>
              this._swaggerStat(packageName).then(() =>
                this._opentelemetry(packageName).then(() =>
                  this._nyc(packageName).then(() =>
                    this._changeFileName(packageName).then(() =>
                      this._addDependency(packageName).then(() =>
                        this._addMigrations(packageName).then(() =>
                          this._promclient(packageName).then(() =>
                            this._openapi(packageName).then(() =>
                              this._prettierfix(packageName),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      )
      .catch(err => {
        console.log(err);
      });
  }

  async _symlink(packageName){
    logBarStart(bar1, 11);
    await spawnProcess('npx', ['lerna', 'add', '-D', 'symlink-resolver', '--scope='+`${packageName}`], {packageName});
    logBar(bar1);
  }

  async _dotenv(packageName){
    await spawnProcess('npx', ['lerna', 'add', 'dotenv', '--scope='+`${packageName}`], {packageName});
    await spawnProcess('npx', ['lerna', 'add', 'dotenv-extended', '--scope='+`${packageName}`], {packageName});
    await spawnProcess('npx', ['lerna', 'add', '-D', '@types/dotenv', '--scope='+`${packageName}`], {packageName});
    logBar(bar1);
  }

  async _sourceloopCore(packageName){
    await spawnProcess('npx', ['lerna', 'add', '@sourceloop/core', '--scope='+`${packageName}`], {packageName});
    logBar(bar1);
  }

  async _changeFileName(){
    console.log(process.cwd());
    let oldPath = path.join(process.cwd(),"src/datasource/datasource.ts");
    let newPath = path.join(process.cwd(),`src/datasource/${datasourceName}.datasource.ts`);
    console.log(oldPath);
    console.log(newPath);
    await fs.rename(oldPath,newPath);
  }

  async _addDependency(packageName){
    if(this.answers.serviceSelect === 'y' || this.answers.serviceSelect === 'Y'){
      await spawnProcess('npx', ['lerna', 'add', '@sourceloop/'+`${this.service.selector}`, '--scope='+`${packageName}`], {packageName});
    }
    logBar(bar1);
  }

  async _addMigrations(){
   if(this.answers.migratedb === 'y' || this.answers.migratedb === 'Y'){
      await spawnProcess('npx', ['lerna', 'create', 'migrations', '-y'], {cwd: process.cwd()});
      await spawnProcess('npx', ['lerna', 'add', 'db-migrate', '--scope=migrations'], {cwd: process.cwd()});
      await spawnProcess('npx', ['lerna', 'add', 'dotenv', '--scope=migrations'], {cwd: process.cwd()});
      await spawnProcess('npx', ['lerna', 'add', 'dotenv-extended', '--scope=migrations'], {cwd: process.cwd()});
      await spawnProcess('npx', ['lerna', 'add', '-D', '@types/dotenv', '--scope=migrations'], {cwd: process.cwd()});
      await spawnProcess('npx', ['lerna', 'add', '-D', 'npm-run-all', '--scope=migrations'], {cwd: process.cwd()});
      if(this.answers.datasourceConnectorName === 'postgresql'){
        await spawnProcess('npx', ['lerna', 'add', 'db-migrate-pg', '--scope=migrations'], {cwd: process.cwd()});
      }
      else{
        await spawnProcess('npx', ['lerna', 'add', 'db-migrate-mysql', '--scope=migrations'], {cwd: process.cwd()});
      }
    }
  }

  async _bearerVerifier(packageName){
    await spawnProcess('npx', ['lerna', 'add', 'loopback4-authentication', '--scope='+`${packageName}`], {packageName});
    await spawnProcess('npx', ['lerna', 'add', 'loopback4-authorization', '--scope='+`${packageName}`], {packageName});
    logBar(bar1);
  }

  async _swaggerStat(packageName){
    await spawnProcess('npx', ['lerna', 'add', 'swagger-stats', '--scope='+`${packageName}`], {packageName});
    logBar(bar1);
  }

  async _opentelemetry(packageName){
    await spawnProcess('npx', ['lerna', 'add', '@opentelemetry/exporter-jaeger', '--scope='+`${packageName}`], {packageName});
    await spawnProcess('npx', ['lerna', 'add', '@opentelemetry/node', '--scope='+`${packageName}`], {packageName});
    await spawnProcess('npx', ['lerna', 'add', '@opentelemetry/plugin-dns', '--scope='+`${packageName}`], {packageName});
    await spawnProcess('npx', ['lerna', 'add', '@opentelemetry/plugin-http', '--scope='+`${packageName}`], {packageName});
    await spawnProcess('npx', ['lerna', 'add', '@opentelemetry/plugin-https', '--scope='+`${packageName}`], {packageName});
    await spawnProcess('npx', ['lerna', 'add', '@opentelemetry/plugin-pg', '--scope='+`${packageName}`], {packageName});
    await spawnProcess('npx', ['lerna', 'add', '@opentelemetry/plugin-pg-pool', '--scope='+`${packageName}`], {packageName});
    await spawnProcess('npx', ['lerna', 'add', '@opentelemetry/tracing', '--scope='+`${packageName}`], {packageName});
    logBar(bar1);
  }

  async _nyc(packageName){
    await spawnProcess('npx', ['lerna', 'add', '-D', '@istanbuljs/nyc-config-typescript', '--scope='+`${packageName}`], {packageName});
    await spawnProcess('npx', ['lerna', 'add', '-D', 'nyc', '--scope='+`${packageName}`], {packageName});
    logBar(bar1);
  }
  async _promclient(packageName){
    await spawnProcess('npm', ['i', 'prom-client'], {packageName});
    logBar(bar1);
  }

  async _openapi(packageName){
    await spawnProcess('npm', ['run', 'openapi-spec'], {packageName});
    logBar(bar1);
  }

  async _prettierfix(packageName){
    await spawnProcess('npm',['run', 'prettier:fix'], {packageName});
    logBar(bar1);
    logBarStop(bar1);
  }

  end() {
    return super.end();
  }
};
