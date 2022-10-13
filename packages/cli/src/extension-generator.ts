// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import ExtensionGeneratorLb4 from '@loopback/cli/generators/extension';
import * as Generator from 'yeoman-generator';
export default class ExtensionGenerator<
  T extends Generator.GeneratorOptions,
> extends ExtensionGeneratorLb4<T> {
  constructor(args: string[], opts: T) {
    super(args, opts);
  }
}
