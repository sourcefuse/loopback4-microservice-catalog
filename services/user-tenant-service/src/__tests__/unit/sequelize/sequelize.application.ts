// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {SequelizeDataSource} from '@loopback/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';
import * as path from 'path';
import {UserTenantServiceComponent} from '../../../component';
import {UserTenantServiceComponentBindings} from '../../../keys';
export {ApplicationConfig};

export class UserTenantServiceSequelizeApplication extends BootMixin(
  RepositoryMixin(RestApplication),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.static('/', path.join(__dirname, '../public'));
    this.bind(UserTenantServiceComponentBindings.Config).to({
      useCustomSequence: false,
      useSequelize: true,
    });
    this.bind(AuthenticationBindings.CURRENT_USER).to({
      id: 1,
      username: 'test_user',
      password: 'temp123!@',
    });
    this.component(UserTenantServiceComponent);
    const ds = new SequelizeDataSource({
      name: 'AuthDb',
      connector: 'sqlite3',
      file: ':memory:',
      database: 'test',
    });

    this.bind(`datasources.AuthDB`).to(ds);
    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
      repositories: {
        dirs: ['repository'],
        extensions: ['.repository.js'],
        nested: true,
      },
    };
  }
}
