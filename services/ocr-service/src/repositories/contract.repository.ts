// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {DefaultSoftCrudRepository} from '@sourceloop/core';
import {Contracts, ContractsRelations} from '../models';
import {OcrDbSourceName} from '../types';

export class ContractRepository extends DefaultSoftCrudRepository<
  Contracts,
  typeof Contracts.prototype.id,
  ContractsRelations
> {
  constructor(
    @inject(`datasources.${OcrDbSourceName}`) dataSource: juggler.DataSource,
  ) {
    super(Contracts, dataSource);
  }
}
