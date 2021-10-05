import { BindingKey } from '@loopback/core';
import { SearchQueryBuilder } from './classes';
import { SearchFunctionType, SearchServiceConfig } from './types';
export declare namespace SearchServiceBindings {
    const DATASOURCE_NAME = "SearchServiceDb";
    const SearchFunction: BindingKey<SearchFunctionType<unknown>>;
    const MySQLQueryBuilder: BindingKey<typeof SearchQueryBuilder>;
    const PostgreSQLQueryBuilder: BindingKey<typeof SearchQueryBuilder>;
    const Config: BindingKey<SearchServiceConfig<import("./models").SearchResult>>;
    const FetchedColumns: BindingKey<string[]>;
}
