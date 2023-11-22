// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { readdir } from 'fs';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import Generator from 'yeoman-generator';
const { promisify } = require('util');
export abstract class BaseGenerator<
  T extends Generator.GeneratorOptions,
> extends Generator<T> {
  root = '';
  private exitGeneration?: string;

  async copyTemplateAsync() {
    const readdriAsync = promisify(readdir);
    const files = await readdriAsync(this.templatePath());

    const promises = files.map(async (file: string) => {
      const targetFileName = file.replace('.tpl', '');
      const sourcePath = this.templatePath(file);
      const destinationPath = join(this.destinationRoot(), targetFileName);
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

  exit(reason?: string) {
    if (reason) return;
    this.exitGeneration = reason;
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
