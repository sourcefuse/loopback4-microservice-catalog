import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, juggler, repository, BelongsToAccessor} from '@loopback/repository';
import {UserLevelPermission, UserTenant} from '../models';
import { UserTenantDataSourceName } from '../keys';
import {UserTenantRepository} from './user-tenant.repository';

export class UserLevelPermissionRepository extends DefaultCrudRepository<
  UserLevelPermission,
  typeof UserLevelPermission.prototype.id
> {

  public readonly userTenant: BelongsToAccessor<UserTenant, typeof UserLevelPermission.prototype.id>;

  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: juggler.DataSource, @repository.getter('UserTenantRepository') protected userTenantRepositoryGetter: Getter<UserTenantRepository>, 
  ) {
    super(UserLevelPermission, dataSource);
    this.userTenant = this.createBelongsToAccessorFor('userTenant', userTenantRepositoryGetter,);
    this.registerInclusionResolver('userTenant', this.userTenant.inclusionResolver);
  }
}
