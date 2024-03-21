// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {Entity} from '@loopback/repository';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
import {AuditDbSourceName} from '@sourceloop/audit-log';
import {tenantGuard} from '@sourceloop/core';
import {AuditLog} from '../../models/tenant-support';

@tenantGuard()
export class AuditLogRepository extends SequelizeCrudRepository<
  AuditLog,
  typeof AuditLog.prototype.id
> {
  constructor(
    @inject(`datasources.${AuditDbSourceName}`) dataSource: SequelizeDataSource,
    @inject('models.AuditLog')
    private readonly auditLog: typeof Entity & {prototype: AuditLog},
  ) {
    super(auditLog, dataSource);
  }
}
