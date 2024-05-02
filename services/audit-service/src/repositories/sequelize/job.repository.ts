import {inject} from '@loopback/core';
import {Entity} from '@loopback/repository';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
import {AuditDbSourceName} from '@sourceloop/audit-log';
import {tenantGuard} from '@sourceloop/core';
import {Job} from '../../models/tenant-support';

@tenantGuard()
export class JobRepository extends SequelizeCrudRepository<
  Job,
  typeof Job.prototype.id
> {
  constructor(
    @inject(`datasources.${AuditDbSourceName}`) dataSource: SequelizeDataSource,
    @inject('models.Job')
    private readonly job: typeof Entity & {prototype: Job},
  ) {
    super(job, dataSource);
  }
}
