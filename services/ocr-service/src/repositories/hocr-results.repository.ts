import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, juggler, repository } from '@loopback/repository';
import { DefaultSoftCrudRepository } from '@sourceloop/core';
import { Contracts, HocrResults, HocrResultsRelations } from '../models';
import { OcrDbSourceName } from '../types';
import { ContractRepository } from './contracts.repository';

export class HocrResultRepository extends DefaultSoftCrudRepository<
  HocrResults,
  typeof HocrResults.prototype.id,
  HocrResultsRelations
> {
  public readonly contracts: BelongsToAccessor<
    Contracts,
    typeof HocrResults.prototype.id
  >;

  constructor(
    @inject(`datasources.${OcrDbSourceName}`) dataSource: juggler.DataSource,
    @repository.getter('ContractsRepository')
    protected contractRepositoryGetter: Getter<ContractRepository>,
  ) {
    super(HocrResults, dataSource);
    this.contracts = this.createBelongsToAccessorFor(
      'contracts',
      contractRepositoryGetter,
    );
  }
}
