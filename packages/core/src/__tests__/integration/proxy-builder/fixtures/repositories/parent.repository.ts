import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Parent, ParentRelations} from '../models';
import {inject} from '@loopback/core';

export class ParentRepository extends DefaultCrudRepository<
  Parent,
  typeof Parent.prototype.id,
  ParentRelations
> {
  constructor(
    @inject('datasources.db')
    dataSource: juggler.DataSource,
  ) {
    super(Parent, dataSource);
  }
}
