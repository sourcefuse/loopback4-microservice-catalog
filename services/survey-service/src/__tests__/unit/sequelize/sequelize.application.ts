// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {SequelizeDataSource} from '@loopback/sequelize';
import * as path from 'path';
import {SurveyServiceComponent} from '../../../component';
import {SurveyServiceBindings} from '../../../keys';
export {ApplicationConfig};
export class SurveyServiceSequelizeApplication extends BootMixin(
  RepositoryMixin(RestApplication),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.static('/', path.join(__dirname, '../public'));
    this.bind(SurveyServiceBindings.Config).to({
      useCustomSequence: false,
      useSequelize: true,
    });
    this.bind('rest.http.request').to({});
    this.component(SurveyServiceComponent);
    const ds = new SequelizeDataSource({
      name: 'SurveyDbSourceName',
      connector: 'sqlite3',
      file: ':memory:',
      database: 'test',
    });

    this.bind(`datasources.SurveyDb`).to(ds);
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
