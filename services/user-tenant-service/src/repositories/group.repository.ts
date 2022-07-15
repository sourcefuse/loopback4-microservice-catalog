// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {
  HasManyRepositoryFactory,
  repository,
  juggler,
} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {UserTenantDataSourceName} from '../keys';
import {Group, GroupRelations, UserGroup} from '../models';
import {UserGroupRepository} from './user-group.repository';

export class GroupRepository extends DefaultUserModifyCrudRepository<
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
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @repository.getter('UserGroupRepository')
    protected userGroupRepositoryGetter: Getter<UserGroupRepository>,
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
