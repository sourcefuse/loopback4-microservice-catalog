import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Sibling, SiblingRelations} from '../models';
import {inject} from '@loopback/core';

export class SiblingRepository extends DefaultCrudRepository<
  Sibling,
  typeof Sibling.prototype.id,
  SiblingRelations
> {
  constructor(
    @inject('datasources.db')
    dataSource: juggler.DataSource,
  ) {
    super(Sibling, dataSource);
  }
}
