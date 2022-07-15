// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter} from '@loopback/context';
import {inject} from '@loopback/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {juggler} from '@loopback/repository';
import {UserTenantDataSourceName} from '../keys';
import {UserView} from '../models';

export class UserViewRepository extends DefaultUserModifyCrudRepository<
  UserView,
  typeof UserView.prototype.id
> {
  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(UserView, dataSource, getCurrentUser);
  }
}
