// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  HasManyRepositoryFactory,
  HasOneRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import {
  AuthDbSourceName,
  OtpRepository,
  Tenant,
  TenantRepository,
  User,
  UserCredentials,
  UserCredentialsRepository,
  UserRelations,
  UserTenant,
  UserTenantRepository,
} from '@sourceloop/authentication-service';
import {DefaultSoftCrudRepository, ILogger, LOGGER} from '@sourceloop/core';

export class UserRepository extends DefaultSoftCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly credentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;
  public readonly tenant: BelongsToAccessor<Tenant, typeof User.prototype.id>;

  public readonly userTenants: HasManyRepositoryFactory<
    UserTenant,
    typeof User.prototype.id
  >;

  constructor(
    @inject(`datasources.${AuthDbSourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter(UserCredentialsRepository)
    getUserCredsRepository: Getter<UserCredentialsRepository>,
    @repository.getter(OtpRepository)
    public getOtpRepository: Getter<OtpRepository>,
    @repository.getter('TenantRepository')
    protected tenantRepositoryGetter: Getter<TenantRepository>,
    @repository.getter('UserTenantRepository')
    protected userTenantRepositoryGetter: Getter<UserTenantRepository>,
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
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
    this.tenant = this.createBelongsToAccessorFor(
      'defaultTenant',
      tenantRepositoryGetter,
    );
    this.registerInclusionResolver(
      'defaultTenant',
      this.tenant.inclusionResolver,
    );

    this.credentials = this.createHasOneRepositoryFactoryFor(
      'credentials',
      getUserCredsRepository,
    );
    this.registerInclusionResolver(
      'credentials',
      this.credentials.inclusionResolver,
    );
  }
}
