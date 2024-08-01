// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {AnyObject, Count, Options, Where} from '@loopback/repository';
import {DataObject} from '@loopback/repository/src/common-types';
import {SequelizeDataSource} from '@loopback/sequelize';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';
import {DATASOURCE_NAME} from '../../keys';
import {SearchQuery} from '../../models';

export class SearchQueryRepository extends SequelizeUserModifyCrudRepository<
  SearchQuery,
  typeof SearchQuery.prototype.id
> {
  constructor(
    @inject(`datasources.${DATASOURCE_NAME}`)
    dataSource: SequelizeDataSource,
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
  create(
    entity: DataObject<SearchQuery>,
    options?: Options | undefined,
  ): Promise<SearchQuery> {
    if (entity.where) {
      delete entity.where;
    }
    return super.create(entity, options);
  }
}
