// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {injectable, BindingScope, Provider} from '@loopback/core';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SearchQuery, SearchWhereFilterMap} from '..';

export type SearchFilter = (
  query: SearchQuery,
  user: IAuthUserWithPermissions,
) => Promise<SearchWhereFilterMap | undefined>;

@injectable({scope: BindingScope.TRANSIENT})
export class SearchFilterProvider implements Provider<SearchFilter> {
  value(): SearchFilter {
    return async (query, user) => query.where;
  }
}
