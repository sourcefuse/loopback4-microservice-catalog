// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {SequelizeDataSource} from '@loopback/sequelize';
import * as path from 'path';
import {TaskServiceComponent} from '../../../component';
import {TaskHttpComponent} from '../../../connectors/http';
import {TaskServiceBindings} from '../../../keys';
export {ApplicationConfig};

export class TaskServiceSequelizeApplication extends BootMixin(
  RepositoryMixin(RestApplication),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.static('/', path.join(__dirname, '../public'));

    this.projectRoot = __dirname;

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.bind(TaskServiceBindings.CONFIG).to({
      useCustomSequence: false,
      useSequelize: true,
    });
    this.component(TaskHttpComponent);
    this.component(TaskServiceComponent);
    const taskserviceDb = new SequelizeDataSource({
      name: 'taskdb',
      connector: 'sqlite3',
      file: ':memory:',
      database: 'test',
    });
    const workflowDb = new SequelizeDataSource({
      name: 'workflowCache',
      connector: 'sqlite3',
      file: ':memory:',
      database: 'test',
    });
    this.bind(`datasources.taskdb`).to(taskserviceDb);
    this.bind(`datasources.WorkflowCache`).to(workflowDb);
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
