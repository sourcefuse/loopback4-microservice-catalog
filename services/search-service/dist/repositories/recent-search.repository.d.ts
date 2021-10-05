import { Getter } from '@loopback/core';
import { DefaultCrudRepository, HasManyRepositoryFactory, juggler } from '@loopback/repository';
import { IAuthUserWithPermissions } from '@sourceloop/core';
import { SearchServiceConfig } from '..';
import { RecentSearch, SearchQuery } from '../models';
import { SearchQueryRepository } from './search-query.repository';
export declare class RecentSearchRepository extends DefaultCrudRepository<RecentSearch, typeof RecentSearch.prototype.id> {
    private readonly config;
    readonly params: HasManyRepositoryFactory<SearchQuery, typeof SearchQuery.prototype.id>;
    constructor(dataSource: juggler.DataSource, queryRepositoryGetter: Getter<SearchQueryRepository>, config: SearchServiceConfig);
    create(query: SearchQuery, user?: IAuthUserWithPermissions): Promise<RecentSearch>;
}
