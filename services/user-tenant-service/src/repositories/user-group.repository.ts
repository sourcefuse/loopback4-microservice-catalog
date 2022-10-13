// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository, juggler} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {UserTenantDataSourceName} from '../keys';
import {Group, UserGroup, UserGroupRelations, UserTenant} from '../models';
import {GroupRepository} from './group.repository';
import {UserTenantRepository} from './user-tenant.repository';

export class UserGroupRepository extends DefaultUserModifyCrudRepository<
  UserGroup,
  typeof UserGroup.prototype.id,
  UserGroupRelations
> {
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
