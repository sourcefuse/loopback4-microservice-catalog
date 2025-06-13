// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {readdir} from 'fs';
import {mkdir} from 'fs/promises';
import {join} from 'path';
// eslint-disable-next-line @typescript-eslint/naming-convention
import Generator from 'yeoman-generator';
const {promisify} = require('util');
export abstract class BaseGenerator<
  T extends Generator.GeneratorOptions,
> extends Generator<T> {
  root = '';
  private exitGeneration: string | Error = '';

  async copyTemplateAsync() {
    const readdriAsync = promisify(readdir);
    const files = await readdriAsync(this.templatePath());

    const promises = files.map(async (file: string) => {
      const targetFileName = file.replace('.tpl', '');
      const sourcePath = this.templatePath(file);
      const destinationPath = join(this.destinationRoot(), targetFileName);
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      //@ts-ignore
      await this.fs.copyTplAsync(sourcePath, destinationPath, this.options);
    });
    await Promise.all(promises);
  }

  name() {
    return this.options.namespace.split(':')[1];
  }

  destinationRoot(rootPath?: string): string {
    if (rootPath) {
      this.root = rootPath;
    }
    return super.destinationRoot(rootPath);
  }

  exit(reason?: string | Error) {
    if (!reason) return;
    this.exitGeneration = reason;
    if (this.options.inMcp) {
      if (reason instanceof Error) {
        throw new Error(reason.message);
      } else {
        throw new Error(reason);
      }
    }
  }

  shouldExit() {
    return !!this.exitGeneration;
  }

  async createFolders(names: string[], force = false) {
    for (const name of names) {
      await mkdir(`${join(this.destinationRoot(), name)}`, {
        recursive: force,
      });
    }
  }
}
