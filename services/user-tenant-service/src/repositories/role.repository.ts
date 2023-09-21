import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository,juggler, repository, HasManyRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import {Role, RoleRelations, UserTenant, UserView} from '../models';
import { UserTenantDataSourceName } from '../keys';
import {UserTenantRepository} from './user-tenant.repository';
import {UserViewRepository} from './user-view.repository';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.id,
  RoleRelations
> {

  public readonly userTenants: HasManyRepositoryFactory<UserTenant, typeof Role.prototype.id>;

  public readonly createdByUser: HasOneRepositoryFactory<UserView, typeof Role.prototype.id>;

  public readonly modifiedByUser: HasOneRepositoryFactory<UserView, typeof Role.prototype.id>;

  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: juggler.DataSource, @repository.getter('UserTenantRepository') protected userTenantRepositoryGetter: Getter<UserTenantRepository>, @repository.getter('UserViewRepository') protected userViewRepositoryGetter: Getter<UserViewRepository>,
  ) {
    super(Role, dataSource);
    this.modifiedByUser = this.createHasOneRepositoryFactoryFor('modifiedByUser', userViewRepositoryGetter);
    this.registerInclusionResolver('modifiedByUser', this.modifiedByUser.inclusionResolver);
    this.createdByUser = this.createHasOneRepositoryFactoryFor('createdByUser', userViewRepositoryGetter);
    this.registerInclusionResolver('createdByUser', this.createdByUser.inclusionResolver);
    this.userTenants = this.createHasManyRepositoryFactoryFor('userTenants', userTenantRepositoryGetter,);
    this.registerInclusionResolver('userTenants', this.userTenants.inclusionResolver);
  }
}
