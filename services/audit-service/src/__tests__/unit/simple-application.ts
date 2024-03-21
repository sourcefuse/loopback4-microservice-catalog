// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {AuditLogComponent} from '@sourceloop/audit-log';
import {TenantUtilitiesBindings} from '@sourceloop/core';
import * as path from 'path';
import {AuditServiceComponent} from '../../component';

export {ApplicationConfig};

export class SimpleAuditServiceApplication extends BootMixin(
  RepositoryMixin(RestApplication),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.static('/', path.join(__dirname, '../public'));

    this.bind(TenantUtilitiesBindings.DisableTenantGuard).to({
      disable: true,
    });

    this.component(AuditLogComponent);
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
