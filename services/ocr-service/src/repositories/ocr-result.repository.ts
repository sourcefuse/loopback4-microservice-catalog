// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, juggler, repository} from '@loopback/repository';
import {DefaultSoftCrudRepository} from '@sourceloop/core';
import {OcrDbSourceName} from '../types';
import {Contracts, OcrResults} from '../models';
import {ContractRepository} from './contract.repository';

export class OcrResultRepository extends DefaultSoftCrudRepository<
  OcrResults,
  typeof OcrResults.prototype.id
> {
  public readonly contracts: BelongsToAccessor<
    Contracts,
    typeof OcrResults.prototype.id
  >;
  constructor(
    @inject(`datasources.${OcrDbSourceName}`) dataSource: juggler.DataSource,
    @repository.getter('ContractsRepository')
    protected contractsRepositoryGetter: Getter<ContractRepository>,
  ) {
    super(OcrResults, dataSource);
    this.contracts = this.createBelongsToAccessorFor(
      'contracts',
      contractsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'contracts',
      this.contracts.inclusionResolver,
    );
  }
}
