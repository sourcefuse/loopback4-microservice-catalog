// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {SearchFilter} from '.';
import {SearchQueryBuilder} from './classes';
import {SearchFunctionType, SearchServiceConfig} from './types';

export namespace SearchServiceBindings {
  export const DATASOURCE_NAME = 'SearchServiceDb';
  export const SearchFunction =
    BindingKey.create<SearchFunctionType<unknown>>('sf.search.function');
  export const MySQLQueryBuilder = BindingKey.create<typeof SearchQueryBuilder>(
    'sf.search.builder.mysql',
  );
  export const PostgreSQLQueryBuilder = BindingKey.create<
    typeof SearchQueryBuilder
  >('sf.search.builder.psql');
  export const Config =
    BindingKey.create<SearchServiceConfig>('sf.search.config');
  export const FetchedColumns =
    BindingKey.create<string[]>('sf.search.columns');
  export const SearchFilterFunction =
    BindingKey.create<SearchFilter>('sf.search.filter');
}

export const IGNORED_COLUMN = '-';
