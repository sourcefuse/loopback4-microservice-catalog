import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Widget} from '../models';

import {inject} from '@loopback/core';
import {ReportingServiceComponentBindings} from '../keys';

export class WidgetsRepository extends DefaultCrudRepository<
  Widget,
  typeof Widget.prototype.id
> {
  constructor(
    @inject(ReportingServiceComponentBindings.DATASOURCE)
    dataSource: juggler.DataSource,
  ) {
    super(Widget, dataSource);
  }
}
