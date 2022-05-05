import { juggler } from '@loopback/repository';
import { DefaultSoftCrudRepository } from '@sourceloop/core';
import { HocrResults, HocrResultsRelations } from '../models';
export declare class HocrResultRepository extends DefaultSoftCrudRepository<HocrResults, typeof HocrResults.prototype.id, HocrResultsRelations> {
    constructor(dataSource: juggler.DataSource);
}
