import { inject } from '@loopback/core';
import { juggler } from '@loopback/repository';
import { DefaultSoftCrudRepository } from '@sourceloop/core';
import { OcrDbSourceName } from '../types';
import { OcrResults, OcrResultsRelations } from '../models';

export class OcrResultRepository extends DefaultSoftCrudRepository<
  OcrResults,
  typeof OcrResults.prototype.id,
  OcrResultsRelations
> {
  constructor(
    @inject(`datasources.${OcrDbSourceName}`) dataSource: juggler.DataSource,
  ) {
    super(OcrResults, dataSource);
  }
}
