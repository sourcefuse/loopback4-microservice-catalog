import {AnyObject, dependencyType, UpdateOptions} from '../../types';
import BaseUpdateGenerator from '../../update-generator';
import {join} from 'path';
import {readdirSync} from 'fs';
const chalk = require('chalk');
const fse = require('fs-extra');

const configJsonFile = require('../../../package.json');
const tempDeps = configJsonFile.config.templateDependencies;

export default class UpdateGenerator extends BaseUpdateGenerator<UpdateOptions> {
  constructor(public args: string[], public opts: UpdateOptions) {
    super(args, opts);
  }

  initializing() {
    if (!this.fs.exists(join(this.destinationPath(), 'lerna.json'))) {
      this.exit('Run this command at the root of monorepo');
    }
  }

  async updateAllProjects() {
    const types = ['facades', 'services', 'packages'];
    const monoRepo = this.destinationPath();

    for (const type of types) {
      this.destinationRoot(monoRepo);
      const folders = this._getDirectories(
        this.destinationRoot(join('.', type)),
      );
      for (const folder of folders) {
        this.destinationRoot(join(monoRepo, type, folder));

        await super.checkLoopBackProject();
        if (
          this.shouldExit() &&
          this.exitGeneration
            .toString()
            .includes('The command must be run in a LoopBack project.')
        ) {
          this.exitGeneration = '';
          continue;
        }

        await this._updateSourceloopDep();
      }
    }

    // lerna bootstrap at the end
    this.destinationRoot(monoRepo);
    this.spawnCommandSync('lerna', ['bootstrap']);
  }

  private _getDirectories(folderPath: string) {
    const projs = readdirSync(folderPath, {withFileTypes: true})
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    return projs;
  }

  private async _updateSourceloopDep() {
    // remove the dependencies
    const incompatibleDeps = await this._checkDependencies();
    if (incompatibleDeps) {
      //get users choice to update or not
      const choices = [
        {
          name: 'Upgrade project dependencies',
          value: 'upgrade',
        },
        {
          name: 'Skip upgrading project dependencies',
          value: 'continue',
        },
      ];
      const prompts = [
        {
          name: 'decision',
          message: 'How do you want to proceed?',
          type: 'list',
          choices,
          default: 0,
        },
      ];
      const answer = await this.prompt(prompts);
      if (answer && answer.decision === 'continue') {
        return false;
      }
      if (answer && answer.decision === 'upgrade') {
        await this._updateDependencies();
      }
    }
  }

  private _compare(tempDependency: string, dependency: string) {
    if (dependency !== tempDependency) {
      return true;
    } else {
      return false;
    }
  }

  private async _checkDependencies() {
    const packageJson = this.fs.readJSON(
      this.destinationPath('package.json'),
    ) as AnyObject;

    const pkgDeps: {
      dependencies: dependencyType;
      devDependencies: dependencyType;
      peerDependencies: dependencyType;
    } = packageJson
      ? {
          dependencies: {...packageJson.dependencies},
          devDependencies: {...packageJson.devDependencies},
          peerDependencies: {...packageJson.peerDependencies},
        }
      : {dependencies: {}, devDependencies: {}, peerDependencies: {}};

    const depsToUpdate: {
      dependencies: dependencyType;
      devDependencies: dependencyType;
      peerDependencies: dependencyType;
    } = {
      dependencies: {},
      devDependencies: {},
      peerDependencies: {},
    };

    let found = false;
    // find the incompatable dependencies
    for (const d in tempDeps) {
      const dep = pkgDeps.dependencies[d];
      const devDep = pkgDeps.devDependencies[d];
      const peerDep = pkgDeps.peerDependencies[d];
      if (!dep && !devDep && !peerDep) continue;

      const tempDependency = tempDeps[d];
      if (dep && this._compare(tempDependency, dep)) {
        depsToUpdate.dependencies[d] = tempDependency;
        found = true;
      }
      if (devDep && this._compare(tempDependency, devDep)) {
        found = true;
        depsToUpdate.devDependencies[d] = tempDependency;
      }
      if (peerDep && this._compare(tempDependency, peerDep)) {
        found = true;
        depsToUpdate.peerDependencies[d] = tempDependency;
      }
    }

    if (!found) {
      // No incompatible dependencies
      this.log(
        chalk.green(
          `The project dependencies are compatible with @sourceloop/cli@${configJsonFile.version}`,
        ),
      );
      return false;
    }

    // print the incompatible dependencies
    if (found) {
      this.log(
        chalk.red(
          `${packageJson.name} contains the following sourceloop dependencies that are incompatible with @sourceloop/cli@${configJsonFile.version}`,
        ),
      );
      this.log('dependencies');
      for (const s in depsToUpdate.dependencies) {
        this.log(
          chalk.yellow('- %s: %s (sl cli %s)'),
          s,
          pkgDeps.dependencies[s],
          depsToUpdate.dependencies[s],
        );
      }
      this.log('devDependencies');
      for (const s in depsToUpdate.devDependencies) {
        this.log(
          chalk.yellow('- %s: %s (cli %s)'),
          s,
          pkgDeps.devDependencies[s],
          depsToUpdate.devDependencies[s],
        );
      }
      this.log('peerDependencies');
      for (const s in depsToUpdate.peerDependencies) {
        this.log(
          chalk.yellow('- %s: %s (cli %s)'),
          s,
          pkgDeps.peerDependencies[s],
          depsToUpdate.peerDependencies[s],
        );
      }
      return true;
    }
  }

  private async _updateDependencies() {
    const packageJs = this.fs.readJSON(
      this.destinationPath('package.json'),
    ) as AnyObject;

    const updates = [];
    for (const d in tempDeps) {
      if (
        packageJs.dependencies &&
        packageJs.dependencies[d] &&
        packageJs.dependencies[d] !== tempDeps[d]
      ) {
        updates.push(
          `- Dependency ${d}: ${packageJs.dependencies[d]} => ${tempDeps[d]}`,
        );
        packageJs.dependencies[d] = tempDeps[d];
      }

      if (
        packageJs.peerDependencies &&
        packageJs.peerDependencies[d] &&
        packageJs.peerDependencies[d] !== tempDeps[d]
      ) {
        updates.push(
          `- Dependency ${d}: ${packageJs.peerDependencies[d]} => ${tempDeps[d]}`,
        );
        packageJs.peerDependencies[d] = tempDeps[d];
      }

      if (
        packageJs.devDependencies &&
        packageJs.devDependencies[d] &&
        packageJs.devDependencies[d] !== tempDeps[d]
      ) {
        updates.push(
          `- Dependency ${d}: ${packageJs.devDependencies[d]} => ${tempDeps[d]}`,
        );
        packageJs.devDependencies[d] = tempDeps[d];
      }
    }
    this.log(
      chalk.red('Upgrading dependencies may break the current project.'),
    );
    this.fs.writeJSON(this.destinationPath('package.json'), packageJs);
    //deleting the node modules and lock file
    await fse.removeSync(this.destinationPath('node_modules'));
    this.fs.delete(join(this.destinationPath(), 'package-lock.json'));
    const currDir = this.destinationPath();
    if (currDir.includes('/packages/')) {
      await this.spawnCommandSync('npm', ['i']);
    }
  }

  async end() {
    return super.end();
  }
}
