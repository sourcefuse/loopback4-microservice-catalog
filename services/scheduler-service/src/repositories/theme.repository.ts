import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {SchedulerBindings} from '../keys';
import {Theme, ThemeRelations} from '../models';

export class ThemeRepository extends DefaultCrudRepository<
  Theme,
  typeof Theme.prototype.id,
  ThemeRelations
> {
  constructor(
    @inject(SchedulerBindings.dbConnector) dataSource: juggler.DataSource,
  ) {
    super(Theme, dataSource);
  }
}
