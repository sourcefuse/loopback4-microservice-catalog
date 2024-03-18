// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, Entity, repository} from '@loopback/repository';
import {SequelizeDataSource} from '@loopback/sequelize';
import {IAuthUserWithPermissions, tenantGuard} from '@sourceloop/core';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';
import {UserTenantDataSourceName} from '../../keys';
import {Tenant, TenantConfig, TenantConfigRelations} from '../../models';
import {TenantRepository} from './tenant.repository';

@tenantGuard()
export class TenantConfigRepository extends SequelizeUserModifyCrudRepository<
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
    dataSource: SequelizeDataSource,
    @repository.getter('TenantRepository')
    protected tenantRepositoryGetter: Getter<TenantRepository>,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @inject('models.TenantConfig')
    private readonly tenantConfig: typeof Entity & {prototype: TenantConfig},
  ) {
    super(tenantConfig, dataSource, getCurrentUser);
    this.tenant = this.createBelongsToAccessorFor(
      'tenant',
      tenantRepositoryGetter,
    );
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
  }
}
