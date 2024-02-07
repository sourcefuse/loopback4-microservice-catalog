import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {AuditDbSourceName} from '@sourceloop/audit-log';

import {tenantGuard} from '@sourceloop/core';
import {MappingLog} from '../models';

@tenantGuard()
export class MappingLogRepository extends DefaultCrudRepository<
  MappingLog,
  typeof MappingLog.prototype.id
> {
  constructor(
    @inject(`datasources.${AuditDbSourceName}`) dataSource: juggler.DataSource,
  ) {
    super(MappingLog, dataSource);
  }
}
