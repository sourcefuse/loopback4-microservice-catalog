// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import fs, {Dirent} from 'fs';
import {join} from 'path';
import {AnyObject} from '@loopback/repository'
// eslint-disable-next-line @typescript-eslint/naming-convention
import BaseUpdateGenerator from '../../update-generator';
import {JSON_SPACING} from '../../utils';
import {PackageDependencies, UpdateOptions} from './types/types';
const chalk = require('chalk'); //NOSONAR
const fse = require('fs-extra'); //NOSONAR

const configJsonFile = require('../../../package.json');
const tempDeps = configJsonFile.config.templateDependencies;
const {promisify} = require('util');

const packageJsonFile = 'package.json';

export default class UpdateGenerator extends BaseUpdateGenerator<UpdateOptions> {
  constructor(
    public args: string[],
    public opts: UpdateOptions,
  ) {
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
      const folders = await this._getDirectories(
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

    this.destinationRoot(monoRepo);
  }

  private async _getDirectories(folderPath: string) {
    try {
      const dirents: Dirent[] = await fs.promises.readdir(folderPath, {
        withFileTypes: true,
      });

      const directories: string[] = dirents
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      return directories;
    } catch (error) {
      return [];
    }
  }

  private async _updateSourceloopDep() {
    // remove the dependencies
    const incompatibleDeps = await this._checkDependencies();
    if (incompatibleDeps) {
      await this._updateDependencies();
    }
    const BACK_TO_ROOT = join('..', '..');
    const currDir = this.destinationPath(
      join(this.destinationPath(), BACK_TO_ROOT),
    );
    if (currDir.includes('/packages/')) {
      await this.spawnCommand('npm', ['i']);
    }
  }

  private async _checkDependencies(): Promise<boolean> {
    const {pkgDeps, depsToUpdate} = await this._initialiseDependencies();

    const found = this._incompatibleDependencies(pkgDeps, depsToUpdate);

    if (!found) {
      this.log(
        chalk.green(
          `The project dependencies are compatible with @sourceloop/cli@${configJsonFile.version}`,
        ),
      );
      return false;
    }
    return this._printDepsToUpdate(depsToUpdate, pkgDeps);
  }

  /**
   * The function `_incompatibleDependencies` checks for incompatible dependencies and updates them
   * accordingly.
   * @param {any} pkgDeps - `pkgDeps` is an object containing the dependencies of a package, including
   * `dependencies`, `devDependencies`, and `peerDependencies`.
   * @param {any} depsToUpdate - `depsToUpdate` is an object that contains dependencies that need to be
   * updated. It has three properties: `dependencies`, `devDependencies`, and `peerDependencies`, each
   * containing key-value pairs of dependency names and their corresponding updated versions.
   * @returns a boolean value, indicating whether any incompatible dependencies were found and updated
   * in the `depsToUpdate` object.
   */
  private _incompatibleDependencies(pkgDeps: AnyObject, depsToUpdate: AnyObject): boolean {
    let found = false;

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
        depsToUpdate.devDependencies[d] = tempDependency;
        found = true;
      }
      if (peerDep && tempDependency !== peerDep) {
        depsToUpdate.peerDependencies[d] = tempDependency;
        found = true;
      }
    }

    return found;
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
    const writeFileAsync = promisify(fs.writeFile);
    await writeFileAsync(
      this.destinationPath(packageJsonFile),
      JSON.stringify(packageJs, undefined, JSON_SPACING),
      {flag: 'w+'},
    );
    //deleting the node modules and lock file
    fse.remove(this.destinationPath('node_modules'), (err: Error) => {
      //nothing
    });
    fse.remove(
      join(this.destinationPath(), 'package-lock.json'),
      (err: Error) => {
        //nothing
      },
    );
  }

  async end() {
    return super.end();
  }
}
