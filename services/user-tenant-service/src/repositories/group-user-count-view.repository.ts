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
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {UserTenantDataSourceName} from '../keys';
import {GroupUserCountView} from '../models/group-user-count-view.model';
import {AuditLogRepository} from './audit.repository';
import {UserGroupRepository} from './user-group.repository';

const UserGroupCountAuditOpts: IAuditMixinOptions = {
  actionKey: 'User_Group_Count_Audit_Logs',
};

export class UserGroupCountViewRepository extends ConditionalAuditRepositoryMixin(
  DefaultUserModifyCrudRepository<
    GroupUserCountView,
    typeof GroupUserCountView.prototype.id,
    GroupUserCountView
  >,
  UserGroupCountAuditOpts,
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
    super(GroupUserCountView, dataSource, getCurrentUser);
  }
}
