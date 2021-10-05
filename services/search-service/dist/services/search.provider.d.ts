import { Provider } from '@loopback/core';
import { juggler, Model } from '@loopback/repository';
import { MySqlQueryBuilder, PsqlQueryBuilder } from '../classes';
import { SearchFunctionType, SearchServiceConfig } from '../types';
export declare class SearchProvider<T extends Model> implements Provider<SearchFunctionType<T>> {
    private readonly config;
    private readonly datasource;
    private readonly mySQLBuilder;
    private readonly psqlBuilder;
    constructor(config: SearchServiceConfig<T>, datasource: juggler.DataSource, mySQLBuilder: typeof MySqlQueryBuilder, psqlBuilder: typeof PsqlQueryBuilder);
    value(): SearchFunctionType<T>;
}
