import {inject} from '@loopback/core';
import {DefaultCrudRepository, Entity, juggler} from '@loopback/repository';
import {AuditDbSourceName} from '@sourceloop/audit-log';

import {tenantGuard} from '@sourceloop/core';
import {MappingLog} from '../models/tenant-support';

@tenantGuard()
export class MappingLogRepository extends DefaultCrudRepository<
  MappingLog,
  typeof MappingLog.prototype.id
> {
  constructor(
    @inject(`datasources.${AuditDbSourceName}`) dataSource: juggler.DataSource,
    @inject('models.MappingLog')
    private readonly mappingLog: typeof Entity & {prototype: MappingLog},
  ) {
    super(mappingLog, dataSource);
  }
}
