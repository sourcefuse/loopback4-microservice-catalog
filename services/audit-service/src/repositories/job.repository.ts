import {inject} from '@loopback/core';
import {DefaultCrudRepository, Entity, juggler} from '@loopback/repository';
import {AuditDbSourceName} from '@sourceloop/audit-log';

import {tenantGuard} from '@sourceloop/core';
import {Job} from '../models/tenant-support';

@tenantGuard()
export class JobRepository extends DefaultCrudRepository<
  Job,
  typeof Job.prototype.id
> {
  constructor(
    @inject(`datasources.${AuditDbSourceName}`) dataSource: juggler.DataSource,
    @inject('models.Job')
    private readonly job: typeof Entity & {prototype: Job},
  ) {
    super(job, dataSource);
  }
}
