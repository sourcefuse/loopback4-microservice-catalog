import { inject } from '@loopback/core';
import { juggler } from '@loopback/repository';
import { DefaultSoftCrudRepository } from '@sourceloop/core';
import { HocrResults, HocrResultsRelations } from '../models';
import { OcrDbSourceName } from '../types';

export class HocrResultRepository extends DefaultSoftCrudRepository<
  HocrResults,
  typeof HocrResults.prototype.id,
  HocrResultsRelations
> {
  constructor(
    @inject(`datasources.${OcrDbSourceName}`) dataSource: juggler.DataSource,
  ) {
    super(HocrResults, dataSource);
  }
}
