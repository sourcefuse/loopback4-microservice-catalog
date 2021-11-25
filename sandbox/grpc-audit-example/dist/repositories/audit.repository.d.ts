import { DefaultCrudRepository } from '@loopback/repository';
import { AuditLog } from '@sourceloop/audit-log';
import { PgDataSource } from '../datasources';
export declare class AuditLogRepository extends DefaultCrudRepository<AuditLog, typeof AuditLog.prototype.id> {
    constructor(dataSource: PgDataSource);
}
