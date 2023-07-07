// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import * as path from 'path';
import {SurveyServiceComponent} from './component';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';

export {ApplicationConfig};

export class SurveyServiceApplication extends BootMixin(
  RepositoryMixin(RestApplication),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.static('/', path.join(__dirname, '../public'));
    this.component(SurveyServiceComponent);

    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
