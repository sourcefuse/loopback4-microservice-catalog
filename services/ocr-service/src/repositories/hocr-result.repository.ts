import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {dbDataSource} from '../datasources';
import {HocrResults, HocrResultsRelations} from '../models';

export class HocrResultRepository extends DefaultCrudRepository<
  HocrResults,
  typeof HocrResults.prototype.contract_name,
  HocrResultsRelations
> {
  constructor(
    @inject('datasources.db') dataSource: dbDataSource,
  ) {
    super(HocrResults, dataSource);
  }
}
