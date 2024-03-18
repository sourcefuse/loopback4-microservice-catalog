import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {AuditDbSourceName} from '@sourceloop/audit-log';

import {Job} from '../models';

import {tenantGuard} from '@sourceloop/core';

@tenantGuard()
export class JobRepository extends DefaultCrudRepository<
  Job,
  typeof Job.prototype.id
> {
  constructor(
    @inject(`datasources.${AuditDbSourceName}`) dataSource: juggler.DataSource,
  ) {
    super(Job, dataSource);
  }
}
