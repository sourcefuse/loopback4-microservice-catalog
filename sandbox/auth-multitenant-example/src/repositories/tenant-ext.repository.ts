import {Getter, inject} from '@loopback/core';
import {HasManyRepositoryFactory, repository} from '@loopback/repository';
import {AuthDbSourceName} from '@sourceloop/authentication-service';
import {DefaultSoftCrudRepository} from '@sourceloop/core';
import {PgdbDataSource} from '../datasources';
import {Tenant, TenantRelations, UserTenant} from '../models';
import {UserTenantExtRepository} from './user-tenant-ext.repository';

export class TenantExtRepository extends DefaultSoftCrudRepository<
  Tenant,
  typeof Tenant.prototype.id,
  TenantRelations
> {
  public readonly userTenants: HasManyRepositoryFactory<
    UserTenant,
    typeof Tenant.prototype.id
  >;

  constructor(
    @inject(`datasources.${AuthDbSourceName}`) dataSource: PgdbDataSource,
    @repository.getter('UserTenantRepository')
    protected userTenantRepositoryGetter: Getter<UserTenantExtRepository>,
  ) {
    super(Tenant, dataSource);
    this.userTenants = this.createHasManyRepositoryFactoryFor(
      'userTenants',
      userTenantRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userTenants',
      this.userTenants.inclusionResolver,
    );
  }
}
