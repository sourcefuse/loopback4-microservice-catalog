import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {AuthDbSourceName} from '@sourceloop/authentication-service';
import {DefaultSoftCrudRepository} from '@sourceloop/core';

import {PgdbDataSource} from '../datasources';
import {
  Role,
  Tenant,
  User,
  UserLevelPermission,
  UserTenant,
  UserTenantRelations,
} from '../models';
import {RoleExtRepository} from './role-ext.repository';
import {TenantExtRepository} from './tenant-ext.repository';
import {UserLevelPermissionExtRepository} from './user-level-permission-ext.repository';
import {UserExtRepository} from './user-ext.repository';

export class UserTenantExtRepository extends DefaultSoftCrudRepository<
  UserTenant,
  typeof UserTenant.prototype.id,
  UserTenantRelations
> {
  public readonly tenant: BelongsToAccessor<
    Tenant,
    typeof UserTenant.prototype.id
  >;

  public readonly role: BelongsToAccessor<Role, typeof UserTenant.prototype.id>;

  public readonly userLevelPermissions: HasManyRepositoryFactory<
    UserLevelPermission,
    typeof UserTenant.prototype.id
  >;

  public readonly user: BelongsToAccessor<User, typeof UserTenant.prototype.id>;

  constructor(
    @inject(`datasources.${AuthDbSourceName}`) dataSource: PgdbDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserExtRepository>,
    @repository.getter('TenantRepository')
    protected tenantRepositoryGetter: Getter<TenantExtRepository>,
    @repository.getter('RoleRepository')
    protected roleRepositoryGetter: Getter<RoleExtRepository>,
    @repository.getter('UserLevelPermissionRepository')
    protected userLevelPermissionRepositoryGetter: Getter<UserLevelPermissionExtRepository>,
  ) {
    super(UserTenant, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);

    this.userLevelPermissions = this.createHasManyRepositoryFactoryFor(
      'userLevelPermissions',
      userLevelPermissionRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userLevelPermissions',
      this.userLevelPermissions.inclusionResolver,
    );

    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter);
    this.registerInclusionResolver('role', this.role.inclusionResolver);

    this.tenant = this.createBelongsToAccessorFor(
      'tenant',
      tenantRepositoryGetter,
    );
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
  }
}
