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
import {UserTenantServiceComponent} from '../../../sequelize.component';

export {ApplicationConfig};

export class UserTenantServiceApplication extends BootMixin(
  RepositoryMixin(RestApplication),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.static('/', path.join(__dirname, '../public'));

    this.component(UserTenantServiceComponent);
    const ds = new SequelizeDataSource({
      name: 'AuthDB',
      connector: 'sqlite3',
      file: ':memory:',
      database: 'test',
    });

    this.bind(`datasources.AuthDB`).to(ds);

    this.bind(AuthenticationBindings.CURRENT_USER).to({
      id: 1,
      username: 'test_user',
      password: 'temp123!@',
    });
    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
