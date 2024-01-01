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
import {WorkflowServiceComponent} from '../../../component';
import {WorkflowServiceBindings} from '../../../keys';
import {WorkflowCacheSourceName} from '../../../types';
import {MOCK_CAMUNDA} from '../../const';
export {ApplicationConfig};

export class WorkflowServiceSequelizeApplication extends BootMixin(
  RepositoryMixin(RestApplication),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.static('/', path.join(__dirname, '../public'));
    this.bind(WorkflowServiceBindings.Config).to({
      workflowEngineBaseUrl: MOCK_CAMUNDA,
      useCustomSequence: false,
      useSequelize: true,
    });
    this.component(WorkflowServiceComponent);
    const datasource = new SequelizeDataSource({
      name: 'WorkflowCacheSourceName',
      connector: 'sqlite3',
      file: ':memory:',
      database: 'test',
    });
    this.bind(`datasources.${WorkflowCacheSourceName}`).to(datasource);
    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
      repositories: {
        dirs: ['repos'],
        extensions: ['.repos.js'],
        nested: true,
      },
    };
  }
}
