// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {AnyObject, Count, juggler, Where} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SearchServiceConfig} from '..';
import {SearchServiceBindings} from '../keys';
import {SearchQuery} from '../models';

export class SearchQueryRepository extends DefaultUserModifyCrudRepository<
  SearchQuery,
  typeof SearchQuery.prototype.id
> {
  constructor(
    @inject(`datasources.${SearchServiceBindings.DATASOURCE_NAME}`)
    dataSource: juggler.DataSource,
    @inject(SearchServiceBindings.Config)
    private readonly config: SearchServiceConfig,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(SearchQuery, dataSource, getCurrentUser);
  }

  deleteAll(where?: Where<SearchQuery>, options?: AnyObject): Promise<Count> {
    return super.deleteAllHard(where, options);
  }
}
