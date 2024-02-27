import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {ReportingServiceComponentBindings} from '../keys';
import {Dashboard} from '../models';

export class DashboardRepository extends DefaultCrudRepository<
  Dashboard,
  typeof Dashboard.prototype.id
> {
  constructor(
    @inject(ReportingServiceComponentBindings.DATASOURCE)
    dataSource: juggler.DataSource,
  ) {
    super(Dashboard, dataSource);
  }
}
