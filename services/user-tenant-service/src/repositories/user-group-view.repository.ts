// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/context';
import {juggler, repository} from '@loopback/repository';
import {
  ConditionalAuditRepositoryMixin,
  IAuditMixinOptions,
} from '@sourceloop/audit-log';
import {DefaultUserModifyCrudRepository} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {IAuthUserWithPermissions} from 'loopback4-authorization';
import {UserTenantDataSourceName} from '../keys';
import {UserGroupView} from '../models/group-user-view.model';
import {AuditLogRepository} from './audit.repository';
import {UserGroupRepository} from './user-group.repository';

const UserGroupViewAuditOpts: IAuditMixinOptions = {
  actionKey: 'User_Group_View_Logs',
};

export class UserGroupViewRepository extends ConditionalAuditRepositoryMixin(
  DefaultUserModifyCrudRepository<
    UserGroupView,
    typeof UserGroupView.prototype.id,
    UserGroupView
  >,
  UserGroupViewAuditOpts,
) {
  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @repository.getter('UserGroupRepository')
    protected userGroupRepositoryGetter: Getter<UserGroupRepository>,
    @repository.getter('AuditLogRepository')
    public getAuditLogRepository: Getter<AuditLogRepository>,
  ) {
    super(UserGroupView, dataSource, getCurrentUser);
  }
}
