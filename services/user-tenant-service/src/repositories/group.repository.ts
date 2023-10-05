import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  juggler,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {Group, GroupRelations, UserGroup} from '../models';
import {UserTenantDataSourceName} from '../keys';
import {UserGroupRepository} from './user-group.repository';
import {tenantGuard} from '@sourceloop/core';

@tenantGuard()
export class GroupRepository extends DefaultCrudRepository<
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
    @repository.getter('UserGroupRepository')
    protected userGroupRepositoryGetter: Getter<UserGroupRepository>,
  ) {
    super(Group, dataSource);
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
