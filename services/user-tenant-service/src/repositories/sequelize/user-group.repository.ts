// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository} from '@loopback/repository';
import {SequelizeDataSource} from '@loopback/sequelize';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';
import {UserTenantDataSourceName} from '../../keys';
import {Group, UserGroup, UserGroupRelations, UserTenant} from '../../models';
import {GroupRepository} from './group.repository';
import {UserTenantRepository} from './user-tenant.repository';

export class UserGroupRepository extends SequelizeUserModifyCrudRepository<
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
    dataSource: SequelizeDataSource,
    @repository.getter('GroupRepository')
    protected groupRepositoryGetter: Getter<GroupRepository>,
    @repository.getter('UserTenantRepository')
    protected userTenantRepositoryGetter: Getter<UserTenantRepository>,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
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
