// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject} from '../../types';
import BaseUpdateGenerator from '../../update-generator';
import {join} from 'path';
import fs, {readdirSync} from 'fs';
import {PackageDependencies, UpdateOptions} from './types/types';
import {JSON_SPACING} from '../../utils';
const chalk = require('chalk'); //NOSONAR
const fse = require('fs-extra'); //NOSONAR

const configJsonFile = require('../../../package.json');
const tempDeps = configJsonFile.config.templateDependencies;

const packageJsonFile = 'package.json';

export default class UpdateGenerator extends BaseUpdateGenerator<
  UpdateOptions
> {
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

        const pkgJs = this.fs.readJSON(
          this.destinationPath(packageJsonFile),
        ) as AnyObject;

        if (pkgJs) {
          this.log(
            chalk.cyan(
              `Updating dependencies in the following project- ${pkgJs.name}`,
            ),
          );

          await this._updateSourceloopDep();
        }
      }
    }

    // lerna bootstrap at the end
    this.destinationRoot(monoRepo);
    await this.spawnCommandSync('lerna', ['bootstrap', '--force-local']);
  }

  private _getDirectories(folderPath: string) {
    return readdirSync(folderPath, {withFileTypes: true})
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  }

  private async _updateSourceloopDep() {
    // remove the dependencies
    const incompatibleDeps = await this._checkDependencies();
    if (incompatibleDeps) {
      await this._updateDependencies();
    }
    const currDir = this.destinationPath();
    if (currDir.includes('/packages/')) {
      await this.spawnCommandSync('npm', ['i']);
    }
  }

  private async _checkDependencies() {
    const {pkgDeps, depsToUpdate} = await this._initialiseDependencies();

    let found = false;
    // find the incompatable dependencies
    for (const d in tempDeps) {
      const dep = pkgDeps.dependencies[d];
      const devDep = pkgDeps.devDependencies[d];
      const peerDep = pkgDeps.peerDependencies[d];
      if (!dep && !devDep && !peerDep) continue;

      const tempDependency = tempDeps[d];
      if (dep && tempDependency !== dep) {
        depsToUpdate.dependencies[d] = tempDependency;
        found = true;
      }
      if (devDep && tempDependency !== devDep) {
        found = true;
        depsToUpdate.devDependencies[d] = tempDependency;
      }
      if (peerDep && tempDependency !== peerDep) {
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
    } else {
      return this._printDepsToUpdate(depsToUpdate, pkgDeps);
    }
  }

  private async _printDepsToUpdate(
    depsToUpdate: PackageDependencies,
    pkgDeps: PackageDependencies,
  ) {
    const packageJson = this.fs.readJSON(
      this.destinationPath(packageJsonFile),
    ) as AnyObject;
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

  private async _initialiseDependencies() {
    const packageJson = this.fs.readJSON(
      this.destinationPath(packageJsonFile),
    ) as AnyObject;

    const pkgDeps: PackageDependencies = packageJson
      ? {
          dependencies: {...packageJson.dependencies},
          devDependencies: {...packageJson.devDependencies},
          peerDependencies: {...packageJson.peerDependencies},
        }
      : {dependencies: {}, devDependencies: {}, peerDependencies: {}};

    const depsToUpdate: PackageDependencies = {
      dependencies: {},
      devDependencies: {},
      peerDependencies: {},
    };
    return {pkgDeps, depsToUpdate};
  }

  private async _updateDependencies() {
    const packageJs = this.fs.readJSON(
      this.destinationPath(packageJsonFile),
    ) as AnyObject;

    for (const d in tempDeps) {
      if (
        packageJs.dependencies?.[d] &&
        packageJs.dependencies?.[d] !== tempDeps[d]
      ) {
        packageJs.dependencies[d] = tempDeps[d];
      }

      if (
        packageJs.peerDependencies?.[d] &&
        packageJs.peerDependencies?.[d] !== tempDeps[d]
      ) {
        packageJs.peerDependencies[d] = tempDeps[d];
      }

      if (
        packageJs.devDependencies?.[d] &&
        packageJs.devDependencies?.[d] !== tempDeps[d]
      ) {
        packageJs.devDependencies[d] = tempDeps[d];
      }
    }
    this.log(
      chalk.red('Upgrading dependencies may break the current project.'),
    );
    fs.writeFileSync(
      this.destinationPath(packageJsonFile),
      JSON.stringify(packageJs, undefined, JSON_SPACING),
      {flag: 'w+'},
    );
    //deleting the node modules and lock file
    fse.removeSync(this.destinationPath('node_modules'));
    fse.removeSync(join(this.destinationPath(), 'package-lock.json'));
  }

  async end() {
    return super.end();
  }
}
