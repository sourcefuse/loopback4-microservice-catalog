// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/* eslint-disable  @typescript-eslint/naming-convention */
import ExtensionGeneratorLb4 from '@loopback/cli/generators/extension';
import * as Generator from 'yeoman-generator';
/* eslint-disable  @typescript-eslint/naming-convention */

export default class ExtensionGenerator<
  T extends Generator.GeneratorOptions,
> extends ExtensionGeneratorLb4<T> {}
