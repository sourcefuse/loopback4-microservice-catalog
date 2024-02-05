import {inject} from '@loopback/core';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
import {AuditDbSourceName} from '@sourceloop/audit-log';
import {tenantGuard} from '@sourceloop/core';
import {MappingLog} from '../../models';

@tenantGuard()
export class MappingLogRepository extends SequelizeCrudRepository<
  MappingLog,
  typeof MappingLog.prototype.id
> {
  constructor(
    @inject(`datasources.${AuditDbSourceName}`) dataSource: SequelizeDataSource,
  ) {
    super(MappingLog, dataSource);
  }
}
