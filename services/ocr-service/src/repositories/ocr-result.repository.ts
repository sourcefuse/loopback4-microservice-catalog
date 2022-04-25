import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {dbDataSource} from '../datasources';
import {OcrResults, OcrResultsRelations} from '../models';

export class OcrResultRepository extends DefaultCrudRepository<
  OcrResults,
  typeof OcrResults.prototype.contract_name,
  OcrResultsRelations
> {
  constructor(
    @inject('datasources.db') dataSource: dbDataSource,
  ) {
    super(OcrResults, dataSource);
  }
}
