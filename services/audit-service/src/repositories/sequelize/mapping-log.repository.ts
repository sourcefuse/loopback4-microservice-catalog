import {inject} from '@loopback/core';
import {Entity} from '@loopback/repository';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
import {AuditDbSourceName} from '@sourceloop/audit-log';
import {tenantGuard} from '@sourceloop/core';
import {MappingLog} from '../../models/tenant-support';

@tenantGuard()
export class MappingLogRepository extends SequelizeCrudRepository<
  MappingLog,
  typeof MappingLog.prototype.id
> {
  constructor(
    @inject(`datasources.${AuditDbSourceName}`) dataSource: SequelizeDataSource,
    @inject('models.MappingLog')
    private readonly mappingLog: typeof Entity & {prototype: MappingLog},
  ) {
    super(mappingLog, dataSource);
  }
}
