import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository} from '@loopback/repository';
import {AuthDbSourceName} from '@sourceloop/authentication-service';
import {DefaultSoftCrudRepository} from '@sourceloop/core';
import {PgdbDataSource} from '../datasources';
import {UserLevelPermission, UserTenant} from '../models';
import {UserTenantExtRepository} from './user-tenant-ext.repository';

export class UserLevelPermissionExtRepository extends DefaultSoftCrudRepository<
  UserLevelPermission,
  typeof UserLevelPermission.prototype.id
> {
  public readonly userTenant: BelongsToAccessor<
    UserTenant,
    typeof UserLevelPermission.prototype.id
  >;

  constructor(
    @inject(`datasources.${AuthDbSourceName}`) dataSource: PgdbDataSource,
    @repository.getter('UserTenantRepository')
    protected userTenantRepositoryGetter: Getter<UserTenantExtRepository>,
  ) {
    super(UserLevelPermission, dataSource);
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
