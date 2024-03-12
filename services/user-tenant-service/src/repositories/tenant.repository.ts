// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {
  Entity,
  HasManyRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {UserTenantDataSourceName} from '../keys';
import {
  Group,
  Role,
  Tenant,
  TenantConfig,
  TenantRelations,
  User,
  UserTenant,
} from '../models';
import {GroupRepository} from './group.repository';
import {RoleRepository} from './role.repository';
import {TenantConfigRepository} from './tenant-config.repository';
import {UserTenantRepository} from './user-tenant.repository';
import {UserRepository} from './user.repository';

export class TenantRepository extends DefaultUserModifyCrudRepository<
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
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @inject('models.Tenant')
    private readonly tenant: typeof Entity & {prototype: Tenant},
  ) {
    super(tenant, dataSource, getCurrentUser);
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
