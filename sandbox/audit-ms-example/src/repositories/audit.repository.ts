// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AuditDbSourceName, AuditLog} from '@sourceloop/audit-log';
import {PgDataSource} from '../datasources';

export class AuditLogRepository extends DefaultCrudRepository<
  AuditLog,
  typeof AuditLog.prototype.id
> {
  constructor(
    @inject(`datasources.${AuditDbSourceName}`) dataSource: PgDataSource,
  ) {
    super(AuditLog, dataSource);
  }
}
