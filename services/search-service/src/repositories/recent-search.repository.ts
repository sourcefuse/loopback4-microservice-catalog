// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {
  HasManyRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SearchServiceBindings} from '../keys';
import {RecentSearch, SearchQuery} from '../models';
import {SearchQueryRepository} from './search-query.repository';

export class RecentSearchRepository extends DefaultUserModifyCrudRepository<
  RecentSearch,
  typeof RecentSearch.prototype.id
> {
  public readonly params: HasManyRepositoryFactory<
    SearchQuery,
    typeof SearchQuery.prototype.id
  >;

  constructor(
    @inject(`datasources.${SearchServiceBindings.DATASOURCE_NAME}`)
    dataSource: juggler.DataSource,
    @repository.getter('SearchQueryRepository')
    queryRepositoryGetter: Getter<SearchQueryRepository>,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(RecentSearch, dataSource, getCurrentUser);
    this.params = this.createHasManyRepositoryFactoryFor(
      'params',
      queryRepositoryGetter,
    );
    this.registerInclusionResolver('params', this.params.inclusionResolver);
  }
}
