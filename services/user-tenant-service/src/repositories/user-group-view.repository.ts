// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/context';
import {repository, juggler} from '@loopback/repository';
import {DefaultUserModifyCrudRepository} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {IAuthUserWithPermissions} from 'loopback4-authorization';
import {UserTenantDataSourceName} from '../keys';
import {UserGroupView} from '../models/group-user-view.model';
import {UserGroupRepository} from './user-group.repository';

export class UserGroupViewRepository extends DefaultUserModifyCrudRepository<
  UserGroupView,
  typeof UserGroupView.prototype.id,
  UserGroupView
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
    super(UserGroupView, dataSource, getCurrentUser);
  }
}
