import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  juggler,
  repository,
  BelongsToAccessor,
} from '@loopback/repository';
import {UserGroup, UserGroupRelations, Group, UserTenant} from '../models';
import {UserTenantDataSourceName} from '../keys';
import {GroupRepository} from './group.repository';
import {UserTenantRepository} from './user-tenant.repository';

export class UserGroupRepository extends DefaultCrudRepository<
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
    @repository.getter('GroupRepository')
    protected groupRepositoryGetter: Getter<GroupRepository>,
    @repository.getter('UserTenantRepository')
    protected userTenantRepositoryGetter: Getter<UserTenantRepository>,
  ) {
    super(UserGroup, dataSource);
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
