import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  juggler,
  repository,
  BelongsToAccessor,
} from '@loopback/repository';
import {UserTenantPrefs, UserTenant} from '../models';
import {UserTenantDataSourceName} from '../keys';
import {UserTenantRepository} from './user-tenant.repository';

export class UserTenantPrefsRepository extends DefaultCrudRepository<
  UserTenantPrefs,
  typeof UserTenantPrefs.prototype.id
> {
  public readonly userTenant: BelongsToAccessor<
    UserTenant,
    typeof UserTenantPrefs.prototype.id
  >;

  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('UserTenantRepository')
    protected userTenantRepositoryGetter: Getter<UserTenantRepository>,
  ) {
    super(UserTenantPrefs, dataSource);
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
