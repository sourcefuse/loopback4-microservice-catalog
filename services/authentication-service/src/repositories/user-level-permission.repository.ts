import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository, juggler} from '@loopback/repository';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';

import {UserLevelPermission, UserTenant} from '../models';

import {UserTenantRepository} from './user-tenant.repository';
import {AuthDbSourceName} from '../types';

export class UserLevelPermissionRepository extends DefaultUserModifyCrudRepository<
  UserLevelPermission,
  typeof UserLevelPermission.prototype.id
> {
  public readonly userTenant: BelongsToAccessor<
    UserTenant,
    typeof UserLevelPermission.prototype.id
  >;

  constructor(
    @inject(`datasources.${AuthDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @repository.getter('UserTenantRepository')
    protected userTenantRepositoryGetter: Getter<UserTenantRepository>,
  ) {
    super(UserLevelPermission, dataSource, getCurrentUser);
    this.userTenant = this.createBelongsToAccessorFor(
      'userTenant',
      userTenantRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userTenant',
      this.userTenant.inclusionResolver,
    );
  }
}
