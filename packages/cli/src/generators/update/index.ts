// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import fs, {Dirent} from 'fs';
import {join} from 'path';
import {AnyObject} from '@loopback/repository';
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
      this.log(chalk.cyan(`Error reading directory: ${error}`));
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
   * The function `_incompatibleDependencies` checks and updates dependencies in different categories
   * based on compatibility.
   * @param {AnyObject} pkgDeps - `pkgDeps` is an object containing dependencies categorized into
   * `dependencies`, `devDependencies`, and `peerDependencies`. Each of these categories contains
   * key-value pairs where the key is the dependency name and the value is the version or details of
   * that dependency.
   * @param {AnyObject} depsToUpdate - `depsToUpdate` is an object containing dependencies that need to
   * be updated. It has three properties: `dependencies`, `devDependencies`, and `peerDependencies`,
   * each of which holds a list of dependencies to be updated.
   * @returns The function `_incompatibleDependencies` returns a boolean value indicating whether any
   * incompatible dependencies were found and updated during the process.
   */
  private _incompatibleDependencies(
    pkgDeps: AnyObject,
    depsToUpdate: AnyObject,
  ): boolean {
    let found = false;

    for (const d in tempDeps) {
      const tempDependency = tempDeps[d];
      found = this._checkAndUpdateDependency(
        pkgDeps.dependencies[d],
        tempDependency,
        depsToUpdate.dependencies,
        d,
        found,
      );

      found = this._checkAndUpdateDependency(
        pkgDeps.devDependencies[d],
        tempDependency,
        depsToUpdate.devDependencies,
        d,
        found,
      );

      found = this._checkAndUpdateDependency(
        pkgDeps.peerDependencies[d],
        tempDependency,
        depsToUpdate.peerDependencies,
        d,
        found,
      );
    }
    return found;
  }

  /**
   * The function checks and updates a dependency if it is different from the current one.
   * @param {string | undefined} currentDep - `currentDep` is a string or undefined value representing
   * the current dependency being checked.
   * @param {string} tempDependency - The `tempDependency` parameter is a string representing the
   * temporary dependency that needs to be checked and potentially updated.
   * @param {AnyObject} depsToUpdate - `depsToUpdate` is an object that stores dependencies that need
   * to be updated.
   * @param {string} depName - depName is a string representing the name of a dependency.
   * @param {boolean} found - The `found` parameter is a boolean flag that indicates whether a
   * dependency has been found during a check and update operation. It is used to keep track of whether
   * any changes were made to the dependencies during the process.
   * @returns a boolean value.
   */
  private _checkAndUpdateDependency(
    currentDep: string | undefined,
    tempDependency: string,
    depsToUpdate: AnyObject,
    depName: string,
    found: boolean,
  ): boolean {
    if (currentDep && tempDependency !== currentDep) {
      depsToUpdate[depName] = tempDependency;
      return true;
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
