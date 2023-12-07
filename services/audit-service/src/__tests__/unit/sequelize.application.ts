// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {SequelizeDataSource} from '@loopback/sequelize';
import {AuditDbSourceName} from '@sourceloop/audit-log';
import * as path from 'path';
import {AuditServiceComponent} from '../../component';
import {AuditServiceBindings} from '../../keys';

export {ApplicationConfig};

export class SequelizeAuditServiceApplication extends BootMixin(
  RepositoryMixin(RestApplication),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.static('/', path.join(__dirname, '../public'));

    const ds = new SequelizeDataSource({
      name: AuditDbSourceName,
      connector: 'sqlite3',
      file: ':memory:',
      database: 'test',
    });
    this.bind(`datasources.${AuditDbSourceName}`).to(ds);
    this.bind(AuditServiceBindings.Config).to({
      useCustomSequence: false,
      useSequelize: true,
    });

    this.component(AuditServiceComponent);
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
