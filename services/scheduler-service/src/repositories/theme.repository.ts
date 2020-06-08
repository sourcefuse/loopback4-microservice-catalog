import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Theme} from '../models';

export class ThemeRepository extends DefaultCrudRepository<
  Theme,
  typeof Theme.prototype.id
> {
  constructor(
    @inject('scheduler.datasources.pgdb') dataSource: juggler.DataSource,
  ) {
    super(Theme, dataSource);
  }
}
