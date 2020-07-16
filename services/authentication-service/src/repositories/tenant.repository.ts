import {Getter, inject} from '@loopback/core';
import {
  HasManyRepositoryFactory,
  repository,
  juggler,
} from '@loopback/repository';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';

import {Tenant, TenantConfig} from '../models';
import {TenantConfigRepository} from './tenant-config.repository';
import {AuthDbSourceName} from '../types';

export class TenantRepository extends DefaultUserModifyCrudRepository<
  Tenant,
  typeof Tenant.prototype.id
> {
  public readonly tenantConfigs: HasManyRepositoryFactory<
    TenantConfig,
    typeof Tenant.prototype.id
  >;

  constructor(
    @inject(`datasources.${AuthDbSourceName}`) dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @repository.getter('TenantConfigRepository')
    protected tenantConfigRepositoryGetter: Getter<TenantConfigRepository>,
  ) {
    super(Tenant, dataSource, getCurrentUser);
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
