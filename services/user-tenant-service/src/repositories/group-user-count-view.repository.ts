// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/context';
import {repository, juggler} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {UserTenantDataSourceName} from '../keys';
import {GroupUserCountView} from '../models/group-user-count-view.model';
import {UserGroupRepository} from './user-group.repository';

export class UserGroupCountViewRepository extends DefaultUserModifyCrudRepository<
  GroupUserCountView,
  typeof GroupUserCountView.prototype.id,
  GroupUserCountView
> {
  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @repository.getter('UserGroupRepository')
    protected userGroupRepositoryGetter: Getter<UserGroupRepository>,
  ) {
    super(GroupUserCountView, dataSource, getCurrentUser);
  }
}
