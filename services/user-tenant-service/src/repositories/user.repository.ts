import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  juggler,
  repository,
  BelongsToAccessor,
  HasOneRepositoryFactory,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {
  User,
  UserRelations,
  Tenant,
  UserCredentials,
  UserTenant,
} from '../models';
import {UserTenantDataSourceName} from '../keys';
import {TenantRepository} from './tenant.repository';
import {UserCredentialsRepository} from './user-credentials.repository';
import {UserTenantRepository} from './user-tenant.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly defaultTenant: BelongsToAccessor<
    Tenant,
    typeof User.prototype.id
  >;

  public readonly credentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;

  public readonly userTenants: HasManyRepositoryFactory<
    UserTenant,
    typeof User.prototype.id
  >;

  constructor(
    @inject(`datasources.${UserTenantDataSourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('TenantRepository')
    protected tenantRepositoryGetter: Getter<TenantRepository>,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
    @repository.getter('UserTenantRepository')
    protected userTenantRepositoryGetter: Getter<UserTenantRepository>,
  ) {
    super(User, dataSource);
    this.userTenants = this.createHasManyRepositoryFactoryFor(
      'userTenants',
      userTenantRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userTenants',
      this.userTenants.inclusionResolver,
    );
    this.credentials = this.createHasOneRepositoryFactoryFor(
      'credentials',
      userCredentialsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'credentials',
      this.credentials.inclusionResolver,
    );
    this.defaultTenant = this.createBelongsToAccessorFor(
      'defaultTenant',
      tenantRepositoryGetter,
    );
    this.registerInclusionResolver(
      'defaultTenant',
      this.defaultTenant.inclusionResolver,
    );
  }
}
