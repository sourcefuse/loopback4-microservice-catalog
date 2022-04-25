import {
  inject
} from '@loopback/core';
import {
  DefaultCrudRepository
} from '@loopback/repository';
import {
  dbDataSource
} from '../datasources';
import {
  Contracts,
  ContractsRelations
} from '../models';

export class ContractRepository extends DefaultCrudRepository <
  Contracts,
  typeof Contracts.prototype.id,
  ContractsRelations >
  {
    constructor(
      @inject('datasources.db') dataSource: dbDataSource,
    ) {
      super(Contracts, dataSource);
    }
  }