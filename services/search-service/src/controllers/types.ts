// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, Model} from '@loopback/repository';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SearchFilter} from '..';
import {SearchQuery} from '../models';
import {SearchFunctionType, SearchServiceConfig} from '../types';

export interface SearchControllerBase<T extends Model> {
  readonly searchFn: SearchFunctionType<T>;
  readonly config: SearchServiceConfig;
  readonly filter: SearchFilter;

  /**
   * Implementation of the endpoint `GET /search`.
   * @param query search query
   */
  search(
    query: SearchQuery,
    saveInRecents: boolean,
    getUser: Getter<IAuthUserWithPermissions>,
  ): Promise<T[]>;
}

export interface SearchControllerCtor<T extends Model> {
  new (
    config: SearchServiceConfig,
    searchFn: SearchFunctionType<T>,
    filter: SearchFilter,
  ): SearchControllerBase<T>;
}
