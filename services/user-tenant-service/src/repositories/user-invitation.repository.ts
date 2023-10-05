import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  juggler,
  repository,
  BelongsToAccessor,
} from '@loopback/repository';
import {UserInvitation, UserTenant} from '../models';
import {UserTenantDataSourceName} from '../keys';
import {UserTenantRepository} from './user-tenant.repository';

export class UserInvitationRepository extends DefaultCrudRepository<
  UserInvitation,
  typeof UserInvitation.prototype.id
> {
  public readonly userTenant: BelongsToAccessor<
    UserTenant,
    typeof UserInvitation.prototype.id
  >;

  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('UserTenantRepository')
    protected userTenantRepositoryGetter: Getter<UserTenantRepository>,
  ) {
    super(UserInvitation, dataSource);
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
