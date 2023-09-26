import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {ParentConfig, ParentConfigRelations} from '../models';
import {inject} from '@loopback/core';

export class ParentConfigRepository extends DefaultCrudRepository<
  ParentConfig,
  typeof ParentConfig.prototype.id,
  ParentConfigRelations
> {
  constructor(
    @inject('datasources.db')
    dataSource: juggler.DataSource,
  ) {
    super(ParentConfig, dataSource);
  }
}
