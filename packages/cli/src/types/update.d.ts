// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
declare module '@loopback/cli/generators/update' {
  import Generator from 'yeoman-generator';
  import BaseGenerator from '@loopback/cli/lib/base-generator';
  class UpdateGenerator<
    T extends Generator.GeneratorOptions,
  > extends BaseGenerator<T> {
    constructor(args: string[], opts: T);
    _setupGenerator(): void;
    setOptions(): Promise<void>;
    checkLoopBackProject(): Promise<void>;
    _openChangeLog(): Promise<void>;
    end(): Promise<void>;
  }
  export = UpdateGenerator;
}
