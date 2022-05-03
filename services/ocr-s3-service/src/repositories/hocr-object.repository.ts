import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {HocrObject, HocrObjectRelations} from '../models';

export class HocrObjectRepository extends DefaultCrudRepository<
  HocrObject,
  typeof HocrObject.prototype.id,
  HocrObjectRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(HocrObject, dataSource);
  }
}
