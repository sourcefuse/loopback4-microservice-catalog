// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {HasManyRepositoryFactory, repository} from '@loopback/repository';
import {SequelizeDataSource} from '@loopback/sequelize';
import {IAuthUserWithPermissions, tenantGuard} from '@sourceloop/core';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';
import {UserTenantDataSourceName} from '../../keys';
import {Group, GroupRelations, UserGroup} from '../../models';
import {UserGroupRepository} from './user-group.repository';

@tenantGuard()
export class GroupRepository extends SequelizeUserModifyCrudRepository<
  Group,
  typeof Group.prototype.id,
  GroupRelations
> {
  public readonly userGroups: HasManyRepositoryFactory<
    UserGroup,
    typeof Group.prototype.id
  >;

  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: SequelizeDataSource,
    @repository.getter('UserGroupRepository')
    protected userGroupRepositoryGetter: Getter<UserGroupRepository>,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(Group, dataSource, getCurrentUser);
    this.userGroups = this.createHasManyRepositoryFactoryFor(
      'userGroups',
      userGroupRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userGroups',
      this.userGroups.inclusionResolver,
    );
  }
}
