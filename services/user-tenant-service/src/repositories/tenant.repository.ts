import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  juggler,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {
  Tenant,
  TenantRelations,
  TenantConfig,
  UserTenant,
  User,
  Role,
  Group,
} from '../models';
import {UserTenantDataSourceName} from '../keys';
import {TenantConfigRepository} from './tenant-config.repository';
import {UserTenantRepository} from './user-tenant.repository';
import {UserRepository} from './user.repository';
import {RoleRepository} from './role.repository';
import {GroupRepository} from './group.repository';

export class TenantRepository extends DefaultCrudRepository<
  Tenant,
  typeof Tenant.prototype.id,
  TenantRelations
> {
  public readonly tenantConfigs: HasManyRepositoryFactory<
    TenantConfig,
    typeof Tenant.prototype.id
  >;

  public readonly userTenants: HasManyRepositoryFactory<
    UserTenant,
    typeof Tenant.prototype.id
  >;

  public readonly users: HasManyRepositoryFactory<
    User,
    typeof Tenant.prototype.id
  >;

  public readonly roles: HasManyRepositoryFactory<
    Role,
    typeof Tenant.prototype.id
  >;

  public readonly groups: HasManyRepositoryFactory<
    Group,
    typeof Tenant.prototype.id
  >;

  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('TenantConfigRepository')
    protected tenantConfigRepositoryGetter: Getter<TenantConfigRepository>,
    @repository.getter('UserTenantRepository')
    protected userTenantRepositoryGetter: Getter<UserTenantRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('RoleRepository')
    protected roleRepositoryGetter: Getter<RoleRepository>,
    @repository.getter('GroupRepository')
    protected groupRepositoryGetter: Getter<GroupRepository>,
  ) {
    super(Tenant, dataSource);
    this.groups = this.createHasManyRepositoryFactoryFor(
      'groups',
      groupRepositoryGetter,
    );
    this.registerInclusionResolver('groups', this.groups.inclusionResolver);
    this.roles = this.createHasManyRepositoryFactoryFor(
      'roles',
      roleRepositoryGetter,
    );
    this.registerInclusionResolver('roles', this.roles.inclusionResolver);
    this.users = this.createHasManyRepositoryFactoryFor(
      'users',
      userRepositoryGetter,
    );
    this.registerInclusionResolver('users', this.users.inclusionResolver);
    this.userTenants = this.createHasManyRepositoryFactoryFor(
      'userTenants',
      userTenantRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userTenants',
      this.userTenants.inclusionResolver,
    );
    this.tenantConfigs = this.createHasManyRepositoryFactoryFor(
      'tenantConfigs',
      tenantConfigRepositoryGetter,
    );
    this.registerInclusionResolver(
      'tenantConfigs',
      this.tenantConfigs.inclusionResolver,
    );
  }
}
