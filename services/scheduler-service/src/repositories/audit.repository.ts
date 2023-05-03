import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {AuditDbSourceName} from '@sourceloop/audit-log';
import {ConditionalAuditLog} from '../models';

/**
 * Audit Log Repository for `@sourceloop/audit-log`.
 *
 * @remarks
 * This will only be used, if the audit log flag is set in the environment variable. (More details provided in README.md)
 */
export class AuditLogRepository extends DefaultCrudRepository<
  ConditionalAuditLog,
  typeof ConditionalAuditLog.prototype.id
> {
  constructor(
    @inject(`datasources.${AuditDbSourceName}`) dataSource: juggler.DataSource,
  ) {
    super(ConditionalAuditLog, dataSource);
  }
}
