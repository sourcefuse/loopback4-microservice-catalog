// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {
  HasManyRepositoryFactory,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository';
import {SequelizeDataSource} from '@loopback/sequelize';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {sequelizetenantGuard} from '@sourceloop/core/src/components/tenant-utilities/decorators/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';
import {UserTenantDataSourceName} from '../../keys';
import {Role, RoleRelations, UserTenant, UserView} from '../../models';
import {UserTenantRepository} from './user-tenant.repository';
import {UserViewRepository} from './user-view.repository';
@sequelizetenantGuard()
export class RoleRepository extends SequelizeUserModifyCrudRepository<
  Role,
  typeof Role.prototype.id,
  RoleRelations
> {
  public readonly userTenants: HasManyRepositoryFactory<
    UserTenant,
    typeof Role.prototype.id
  >;

  public readonly createdByUser: HasOneRepositoryFactory<
    UserView,
    typeof Role.prototype.id
  >;

  public readonly modifiedByUser: HasOneRepositoryFactory<
    UserView,
    typeof Role.prototype.id
  >;

  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: SequelizeDataSource,
    @repository.getter('UserTenantRepository')
    protected userTenantRepositoryGetter: Getter<UserTenantRepository>,
    @repository.getter('UserViewRepository')
    protected userViewRepositoryGetter: Getter<UserViewRepository>,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(Role, dataSource, getCurrentUser);
    this.modifiedByUser = this.createHasOneRepositoryFactoryFor(
      'modifiedByUser',
      userViewRepositoryGetter,
    );
    this.registerInclusionResolver(
      'modifiedByUser',
      this.modifiedByUser.inclusionResolver,
    );
    this.createdByUser = this.createHasOneRepositoryFactoryFor(
      'createdByUser',
      userViewRepositoryGetter,
    );
    this.registerInclusionResolver(
      'createdByUser',
      this.createdByUser.inclusionResolver,
    );
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
