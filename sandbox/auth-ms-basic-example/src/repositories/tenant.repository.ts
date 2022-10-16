// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {
  HasManyRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import {DefaultSoftCrudRepository} from '@sourceloop/core';
import {
  AuthDbSourceName,
  Tenant,
  TenantConfig,
  TenantConfigRepository,
} from '@sourceloop/authentication-service';

export class TenantRepository extends DefaultSoftCrudRepository<
  Tenant,
  typeof Tenant.prototype.id
> {
  public readonly tenantConfigs: HasManyRepositoryFactory<
    TenantConfig,
    typeof Tenant.prototype.id
  >;

  constructor(
    @inject(`datasources.${AuthDbSourceName}`) dataSource: juggler.DataSource,
    @repository.getter('TenantConfigRepository')
    protected tenantConfigRepositoryGetter: Getter<TenantConfigRepository>,
  ) {
    super(Tenant, dataSource);
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
