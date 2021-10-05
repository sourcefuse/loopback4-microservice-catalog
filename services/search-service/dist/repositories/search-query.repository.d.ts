import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { SearchServiceConfig } from '..';
import { SearchQuery } from '../models';
export declare class SearchQueryRepository extends DefaultCrudRepository<SearchQuery, typeof SearchQuery.prototype.id> {
    private readonly config;
    constructor(dataSource: juggler.DataSource, config: SearchServiceConfig);
}
