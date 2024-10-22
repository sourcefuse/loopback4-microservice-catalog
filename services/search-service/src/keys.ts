// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {SearchFilter} from '.';
import {SearchQueryBuilder} from './classes';
import {ModelProviderFn} from './services/model.provider';
import {SearchFunctionType, SearchServiceConfig} from './types';

export namespace SearchServiceBindings {
  export const modelProvider = BindingKey.create<ModelProviderFn>(
    'sf.search.modelprovider',
  );
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
export const DATASOURCE_NAME = 'SearchServiceDb';
