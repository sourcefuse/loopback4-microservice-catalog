// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository} from '@loopback/repository';
import {SequelizeDataSource} from '@loopback/sequelize';
import {SequelizeSoftCrudRepository} from 'loopback4-soft-delete/sequelize';
import {UserLevelResource, UserTenant} from '../../models';
import {AuthDbSourceName} from '../../types';
import {UserTenantRepository} from '../user-tenant.repository';

export class UserLevelResourceRepository extends SequelizeSoftCrudRepository<
  UserLevelResource,
  typeof UserLevelResource.prototype.id
> {
  public readonly userTenant: BelongsToAccessor<
    UserTenant,
    typeof UserLevelResource.prototype.id
  >;

  constructor(
    @inject(`datasources.${AuthDbSourceName}`)
    dataSource: SequelizeDataSource,
    @repository.getter('UserTenantRepository')
    protected userTenantRepositoryGetter: Getter<UserTenantRepository>,
  ) {
    super(UserLevelResource, dataSource);
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
