// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  Entity,
  HasManyRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
  tenantGuard,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {UserTenantDataSourceName} from '../keys';
import {
  Role,
  Tenant,
  User,
  UserGroup,
  UserInvitation,
  UserLevelPermission,
  UserTenant,
  UserTenantRelations,
} from '../models';
import {RoleRepository} from './role.repository';
import {TenantRepository} from './tenant.repository';
import {UserGroupRepository} from './user-group.repository';
import {UserInvitationRepository} from './user-invitation.repository';
import {UserLevelPermissionRepository} from './user-level-permission.repository';
import {UserRepository} from './user.repository';

@tenantGuard()
export class UserTenantRepository extends DefaultUserModifyCrudRepository<
  UserTenant,
  typeof UserTenant.prototype.id,
  UserTenantRelations
> {
  public readonly userLevelPermissions: HasManyRepositoryFactory<
    UserLevelPermission,
    typeof UserTenant.prototype.id
  >;

  public readonly userGroups: HasManyRepositoryFactory<
    UserGroup,
    typeof UserTenant.prototype.id
  >;

  public readonly user: BelongsToAccessor<User, typeof UserTenant.prototype.id>;

  public readonly tenant: BelongsToAccessor<
    Tenant,
    typeof UserTenant.prototype.id
  >;

  public readonly role: BelongsToAccessor<Role, typeof UserTenant.prototype.id>;

  public readonly userInvitations: HasManyRepositoryFactory<
    UserInvitation,
    typeof UserTenant.prototype.id
  >;

  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('UserLevelPermissionRepository')
    protected userLevelPermissionRepositoryGetter: Getter<UserLevelPermissionRepository>,
    @repository.getter('UserGroupRepository')
    protected userGroupRepositoryGetter: Getter<UserGroupRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('TenantRepository')
    protected tenantRepositoryGetter: Getter<TenantRepository>,
    @repository.getter('RoleRepository')
    protected roleRepositoryGetter: Getter<RoleRepository>,
    @repository.getter('UserInvitationRepository')
    protected userInvitationRepositoryGetter: Getter<UserInvitationRepository>,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @inject('models.UserTenant')
    private readonly userTenant: typeof Entity & {prototype: UserTenant},
  ) {
    super(userTenant, dataSource, getCurrentUser);
    this.userInvitations = this.createHasManyRepositoryFactoryFor(
      'userInvitations',
      userInvitationRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userInvitations',
      this.userInvitations.inclusionResolver,
    );
    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
    this.tenant = this.createBelongsToAccessorFor(
      'tenant',
      tenantRepositoryGetter,
    );
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.userGroups = this.createHasManyRepositoryFactoryFor(
      'userGroups',
      userGroupRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userGroups',
      this.userGroups.inclusionResolver,
    );
    this.userLevelPermissions = this.createHasManyRepositoryFactoryFor(
      'userLevelPermissions',
      userLevelPermissionRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userLevelPermissions',
      this.userLevelPermissions.inclusionResolver,
    );
  }
}
