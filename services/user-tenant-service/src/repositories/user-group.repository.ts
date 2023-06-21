// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, juggler, repository} from '@loopback/repository';
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
import {Group, UserGroup, UserGroupRelations, UserTenant} from '../models';
import {AuditLogRepository} from './audit.repository';
import {GroupRepository} from './group.repository';
import {UserTenantRepository} from './user-tenant.repository';

const UserGroupAuditOpts: IAuditMixinOptions = {
  actionKey: 'User_Group_Logs',
};

export class UserGroupRepository extends ConditionalAuditRepositoryMixin(
  DefaultUserModifyCrudRepository<
    UserGroup,
    typeof UserGroup.prototype.id,
    UserGroupRelations
  >,
  UserGroupAuditOpts,
) {
  public readonly group: BelongsToAccessor<
    Group,
    typeof UserGroup.prototype.id
  >;

  public readonly userTenant: BelongsToAccessor<
    UserTenant,
    typeof UserGroup.prototype.id
  >;

  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @repository.getter('GroupRepository')
    protected groupRepositoryGetter: Getter<GroupRepository>,
    @repository.getter('UserTenantRepository')
    protected userTenantRepositoryGetter: Getter<UserTenantRepository>,
    @repository.getter('AuditLogRepository')
    public getAuditLogRepository: Getter<AuditLogRepository>,
  ) {
    super(UserGroup, dataSource, getCurrentUser);
    this.userTenant = this.createBelongsToAccessorFor(
      'userTenant',
      userTenantRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userTenant',
      this.userTenant.inclusionResolver,
    );
    this.group = this.createBelongsToAccessorFor(
      'group',
      groupRepositoryGetter,
    );
    this.registerInclusionResolver('group', this.group.inclusionResolver);
  }
}
