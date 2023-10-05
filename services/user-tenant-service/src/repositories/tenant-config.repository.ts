import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  juggler,
  repository,
  BelongsToAccessor,
} from '@loopback/repository';
import {TenantConfig, TenantConfigRelations, Tenant} from '../models';
import {UserTenantDataSourceName} from '../keys';
import {TenantRepository} from './tenant.repository';
import {tenantGuard} from '@sourceloop/core';

@tenantGuard()
export class TenantConfigRepository extends DefaultCrudRepository<
  TenantConfig,
  typeof TenantConfig.prototype.id,
  TenantConfigRelations
> {
  public readonly tenant: BelongsToAccessor<
    Tenant,
    typeof TenantConfig.prototype.id
  >;

  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('TenantRepository')
    protected tenantRepositoryGetter: Getter<TenantRepository>,
  ) {
    super(TenantConfig, dataSource);
    this.tenant = this.createBelongsToAccessorFor(
      'tenant',
      tenantRepositoryGetter,
    );
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
  }
}
