import {inject} from '@loopback/core';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
import {AuditDbSourceName} from '@sourceloop/audit-log';
import {Job} from '../../models';

import {tenantGuard} from '@sourceloop/core';

@tenantGuard()
export class JobRepository extends SequelizeCrudRepository<
  Job,
  typeof Job.prototype.id
> {
  constructor(
    @inject(`datasources.${AuditDbSourceName}`) dataSource: SequelizeDataSource,
  ) {
    super(Job, dataSource);
  }
}
