import {Getter, inject} from '@loopback/core';
import {HasManyRepositoryFactory, repository} from '@loopback/repository';
import {AuthDbSourceName} from '@sourceloop/authentication-service';
import {DefaultSoftCrudRepository} from '@sourceloop/core';
import {PgdbDataSource} from '../datasources';
import {Role, RoleRelations, UserTenant} from '../models';
import {UserTenantExtRepository} from './user-tenant-ext.repository';

export class RoleExtRepository extends DefaultSoftCrudRepository<
  Role,
  typeof Role.prototype.id,
  RoleRelations
> {
  public readonly userTenants: HasManyRepositoryFactory<
    UserTenant,
    typeof Role.prototype.id
  >;

  constructor(
    @inject(`datasources.${AuthDbSourceName}`) dataSource: PgdbDataSource,
    @repository.getter('UserTenantRepository')
    protected userTenantRepositoryGetter: Getter<UserTenantExtRepository>,
  ) {
    super(Role, dataSource);
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
