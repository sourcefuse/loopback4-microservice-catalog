// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Constructor, inject} from '@loopback/core';
import {AuditDbSourceName} from '@sourceloop/audit-log';

import {AuditLog} from '../../models';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
import {AuditLogExtraLogicMixin} from '../audit-log.repository';

export class AuditLogRepository extends AuditLogExtraLogicMixin<
  AuditLog,
  typeof AuditLog.prototype.id,
  Constructor<SequelizeCrudRepository<AuditLog, typeof AuditLog.prototype.id>>
>(SequelizeCrudRepository) {
  constructor(
    @inject(`datasources.${AuditDbSourceName}`) dataSource: SequelizeDataSource,
  ) {
    super(AuditLog, dataSource);
  }
}
