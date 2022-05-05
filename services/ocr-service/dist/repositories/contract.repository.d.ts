import { juggler } from '@loopback/repository';
import { DefaultSoftCrudRepository } from '@sourceloop/core';
import { Contracts, ContractsRelations } from '../models';
export declare class ContractRepository extends DefaultSoftCrudRepository<Contracts, typeof Contracts.prototype.id, ContractsRelations> {
    constructor(dataSource: juggler.DataSource);
}
