// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/* eslint-disable  @typescript-eslint/naming-convention */
import UpdateGeneratorLb4 from '@loopback/cli/generators/update';
import * as Generator from 'yeoman-generator';
/* eslint-enable  @typescript-eslint/naming-convention */

export default class UpdateGenerator<
  T extends Generator.GeneratorOptions,
> extends UpdateGeneratorLb4<T> {}
