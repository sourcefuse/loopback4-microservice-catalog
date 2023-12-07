import {inject} from '@loopback/core';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
import {AuditDbSourceName} from '@sourceloop/audit-log';
import {MappingLog} from '../../models';
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
