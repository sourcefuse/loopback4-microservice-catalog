// Copyright IBM Corp. 2017,2020. All Rights Reserved.
// Node module: @loopback/cli
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';
const AppGenerator = require('@loopback/cli/generators/app');
const path = require('path');
const {spawn} = require('child_process');
const fs = require('fs');

module.exports = class MGenerator extends AppGenerator {
  constructor(args, opts) {
    super(args, opts);
  }

  _setupGenerator() {
    return super._setupGenerator();
  }

  setOptions() {
    if (this.shouldExit()) { return };
    return super.setOptions();
  }

  promptProjectName() {
    if (this.shouldExit()) { return };
    return super.promptProjectName();
  }

  promptProjectDir() {
    if (this.shouldExit()) { return };
    return super.promptProjectDir();
  }

  async promptUniquePrefix() {
    this.answers = await this.prompt([
        {
            type: 'input',
            name: 'uniquePrefix',
            message: 'Unique prefix for the docker image:'
        }
    ]);
  }

  promptApplication() {
    if (this.shouldExit()) { return };
    return super.promptApplication();
  }

  promptOptions() {
    if (this.shouldExit()) { return };
    return super.promptOptions();
  }

  promptYarnInstall() {
    if (this.shouldExit()) { return };
    return super.promptYarnInstall();
  }

  buildAppClassMixins() {
    if (this.shouldExit()) { return };
    return super.buildAppClassMixins();
  }

  scaffold() {
    return super.scaffold();
  }

  install() {
    const packageJsonFile = path.join(process.cwd(), 'package.json');
    const packageJson = require(packageJsonFile);
    const scripts = packageJson.scripts;
    this._setupMicroservice(packageJson.name);
    scripts['symlink-resolver'] = "symlink-resolver";
    scripts['resolve-links'] = "npm run symlink-resolver build ./node_modules/@local";
    scripts['prestart'] = "npm run rebuild && npm run openapi-spec";
    scripts['rebuild'] = "npm run clean && npm run build";
    scripts['start'] = "node -r ./dist/opentelemetry-registry.js -r source-map-support/register .";
    scripts['docker:build'] = "DOCKER_BUILDKIT=1 sudo docker build --build-arg NR_ENABLED=$NR_ENABLED_VALUE -t $IMAGE_REPO_NAME/"
    +this.answers.uniquePrefix+"-$npm_package_name:$npm_package_version .";
    scripts['docker:push'] = "sudo docker push $IMAGE_REPO_NAME/"+this.answers.uniquePrefix+"-$npm_package_name:$npm_package_version";
    scripts['docker:build:dev'] = "DOCKER_BUILDKIT=1 sudo docker build --build-arg NR_ENABLED=$NR_ENABLED_VALUE -t $IMAGE_REPO_NAME/"
    +this.answers.uniquePrefix+"-$npm_package_name:$IMAGE_TAG_VERSION .";
    scripts['docker:push:dev'] = "sudo docker push $IMAGE_REPO_NAME/"+this.answers.uniquePrefix+"-$npm_package_name:$IMAGE_TAG_VERSION";
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
                    this._promclient(packageName).then(() =>
                      this._openapi(packageName),
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
    await this._spawnProcess('npx', ['lerna', 'add', '-D', 'symlink-resolver', '--scope='+`${packageName}`], {packageName});
  }

  async _dotenv(packageName){
    await this._spawnProcess('npx', ['lerna', 'add', 'dotenv', '--scope='+`${packageName}`], {packageName});
    await this._spawnProcess('npx', ['lerna', 'add', 'dotenv-extended', '--scope='+`${packageName}`], {packageName});
    await this._spawnProcess('npx', ['lerna', 'add', '-D', '@types/dotenv', '--scope='+`${packageName}`], {packageName});
  }

  async _sourceloopCore(packageName){
    await this._spawnProcess('npx', ['lerna', 'add', '@sourceloop/core', '--scope='+`${packageName}`], {packageName});
  }

  async _bearerVerifier(packageName){
    await this._spawnProcess('npx', ['lerna', 'add', 'loopback4-authentication', '--scope='+`${packageName}`], {packageName});
    await this._spawnProcess('npx', ['lerna', 'add', 'loopback4-authorization', '--scope='+`${packageName}`], {packageName});
  }

  async _swaggerStat(packageName){
    await this._spawnProcess('npx', ['lerna', 'add', 'swagger-stats', '--scope='+`${packageName}`], {packageName});
  }

  async _opentelemetry(packageName){
    await this._spawnProcess('npx', ['lerna', 'add', '@opentelemetry/exporter-jaeger', '--scope='+`${packageName}`], {packageName});
    await this._spawnProcess('npx', ['lerna', 'add', '@opentelemetry/node', '--scope='+`${packageName}`], {packageName});
    await this._spawnProcess('npx', ['lerna', 'add', '@opentelemetry/plugin-dns', '--scope='+`${packageName}`], {packageName});
    await this._spawnProcess('npx', ['lerna', 'add', '@opentelemetry/plugin-http', '--scope='+`${packageName}`], {packageName});
    await this._spawnProcess('npx', ['lerna', 'add', '@opentelemetry/plugin-https', '--scope='+`${packageName}`], {packageName});
    await this._spawnProcess('npx', ['lerna', 'add', '@opentelemetry/plugin-pg', '--scope='+`${packageName}`], {packageName});
    await this._spawnProcess('npx', ['lerna', 'add', '@opentelemetry/plugin-pg-pool', '--scope='+`${packageName}`], {packageName});
    await this._spawnProcess('npx', ['lerna', 'add', '@opentelemetry/tracing', '--scope='+`${packageName}`], {packageName});
  }

  async _nyc(packageName){
    await this._spawnProcess('npx', ['lerna', 'add', '-D', '@istanbuljs/nyc-config-typescript', '--scope='+`${packageName}`], {packageName});
    await this._spawnProcess('npx', ['lerna', 'add', '-D', 'nyc', '--scope='+`${packageName}`], {packageName});
  }
  async _promclient(packageName){
    await this._spawnProcess('npm', ['i', 'prom-client'], {packageName});
  }

  async _openapi(packageName){
    await this._spawnProcess('npm', ['run', 'openapi-spec'], {packageName});
  }

  _spawnProcess(cmd, cmdArgs, cwd) {
    return new Promise((resolve, reject) => {
      const spawnedProcess = spawn(cmd, cmdArgs, {...cwd});

      spawnedProcess.stdout.on("data", data => {
          console.log(`stdout: ${data}`);
      });
      spawnedProcess.stderr.on("data", data => {
          console.log(`stderr: ${data}`);
      });
      spawnedProcess.on('error', (error) => {
          console.log(`error: ${error.message}`);
          reject(error);
      });
      spawnedProcess.on("close", code => {
          resolve();
      });
    })
  }

  end() {
    return super.end();
  }
};
