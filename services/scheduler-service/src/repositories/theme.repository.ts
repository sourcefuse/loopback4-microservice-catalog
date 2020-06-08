import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Theme, ThemeRelations} from '../models';

export class ThemeRepository extends DefaultCrudRepository<
  Theme,
  typeof Theme.prototype.id,
  ThemeRelations
> {
  constructor(
    @inject('scheduler.datasources.pgdb') dataSource: juggler.DataSource,
  ) {
    super(Theme, dataSource);
  }
}
