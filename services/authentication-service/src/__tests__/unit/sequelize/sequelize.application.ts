// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin, juggler} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {SequelizeDataSource} from '@loopback/sequelize';
import * as path from 'path';
import {AuthenticationServiceComponent} from '../../../component';

import {AuthenticationBindings} from 'loopback4-authentication';
import {AuthServiceBindings} from '../../../keys';
import {AuthCacheSourceName, AuthDbSourceName} from '../../../types';
export {ApplicationConfig};

export class SequelizeAuthenticationServiceApplication extends BootMixin(
  RepositoryMixin(RestApplication),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.static('/', path.join(__dirname, '../public'));

    const ds = new SequelizeDataSource({
      name: 'AuthDbSourceName',
      connector: 'sqlite3',
      file: ':memory:',
      database: 'test',
    });
    const redisDs = new juggler.DataSource({
      name: 'redis',
      connector: 'kv-memory',
    });

    this.bind(`datasources.${AuthDbSourceName}`).to(ds);
    this.bind(`datasources.${AuthCacheSourceName}`).to(redisDs);
    this.bind(AuthenticationBindings.CURRENT_CLIENT).to({
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
    });
    this.bind(AuthenticationBindings.CURRENT_USER).to({
      id: 1,
      username: 'test_user',
      password: 'temp123!@',
    });
    this.bind(AuthServiceBindings.Config).to({
      useCustomSequence: false,
      useSequelize: true,
    });
    this.component(AuthenticationServiceComponent);
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
