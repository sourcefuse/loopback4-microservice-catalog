import { juggler } from '@loopback/repository';
import { DefaultSoftCrudRepository } from '@sourceloop/core';
import { OcrResults, OcrResultsRelations } from '../models';
export declare class OcrResultRepository extends DefaultSoftCrudRepository<OcrResults, typeof OcrResults.prototype.id, OcrResultsRelations> {
    constructor(dataSource: juggler.DataSource);
}
