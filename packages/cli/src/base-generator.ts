// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {readdirSync} from 'fs';
import {mkdir} from 'fs/promises';
import {join} from 'path';
import Generator from 'yeoman-generator';
export abstract class BaseGenerator<
  T extends Generator.GeneratorOptions,
> extends Generator<T> {
  root = '';
  private exitGeneration?: string;
  constructor(args: string[], opts: T) {
    super(args, opts);
  }

  copyTemplates() {
    readdirSync(this.templatePath()).forEach(file => {
      const targetFileName = file.replace('.tpl', '');
      const sourcePath = this.templatePath(file);
      const destinationPath = join(this.destinationRoot(), targetFileName);
      this.fs.copyTpl(sourcePath, destinationPath, this.options);
    });
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
    if (!!reason) return;
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
