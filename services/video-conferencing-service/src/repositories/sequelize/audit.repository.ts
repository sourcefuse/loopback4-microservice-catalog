import {inject} from '@loopback/core';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
import {AuditDbSourceName} from '@sourceloop/audit-log';
import {AuditLog} from '../../models';

/**
 * Audit Log Repository for `@sourceloop/audit-log`.
 *
 * @remarks
 * This will only be used, if the audit log flag is set in the environment variable. (More details provided in README.md)
 */
export class AuditLogRepository extends SequelizeCrudRepository<
  AuditLog,
  typeof AuditLog.prototype.id
> {
  constructor(
    @inject(`datasources.${AuditDbSourceName}`) dataSource: SequelizeDataSource,
  ) {
    super(AuditLog, dataSource);
  }
}
