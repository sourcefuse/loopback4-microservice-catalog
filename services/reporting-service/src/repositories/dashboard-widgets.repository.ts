import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {DashboardWidget} from '../models';

import {inject} from '@loopback/core';
import {ReportingServiceComponentBindings} from '../keys';

export class DashboardWidgetRepository extends DefaultCrudRepository<
  DashboardWidget,
  typeof DashboardWidget.prototype.id
> {
  constructor(
    @inject(ReportingServiceComponentBindings.DATASOURCE)
    dataSource: juggler.DataSource,
  ) {
    super(DashboardWidget, dataSource);
  }
}
