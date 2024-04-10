// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {DefaultCrudRepository, Entity, juggler} from '@loopback/repository';
import {AuditDbSourceName} from '@sourceloop/audit-log';

import {AuditLog} from '../models/tenant-support';

import {tenantGuard} from '@sourceloop/core';

@tenantGuard()
export class AuditLogRepository extends DefaultCrudRepository<
  AuditLog,
  typeof AuditLog.prototype.id
> {
  constructor(
    @inject(`datasources.${AuditDbSourceName}`) dataSource: juggler.DataSource,
    @inject('models.AuditLog')
    private readonly auditLog: typeof Entity & {prototype: AuditLog},
  ) {
    super(auditLog, dataSource);
  }
}
