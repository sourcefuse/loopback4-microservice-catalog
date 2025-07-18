// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DataObject,
  Entity,
  HasManyRepositoryFactory,
  HasOneRepositoryFactory,
  Options,
  juggler,
  repository,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {UserTenantDataSourceName} from '../keys';
import {
  Tenant,
  User,
  UserCredentials,
  UserRelations,
  UserTenant,
} from '../models';
import {TenantRepository} from './tenant.repository';
import {UserCredentialsRepository} from './user-credentials.repository';
import {UserTenantRepository} from './user-tenant.repository';

export class UserRepository extends DefaultUserModifyCrudRepository<
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
    @inject('models.User')
    private readonly user: typeof Entity & {prototype: User},
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(user, dataSource, getCurrentUser);
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

  async create(entity: DataObject<User>, options?: Options): Promise<User> {
    const userExists = await super.findOne({
      where: {username: entity.username},
    });
    if (userExists) {
      throw new HttpErrors.BadRequest('User already exists');
    }
    const user = await super.create(entity, options);
    try {
      let creds: UserCredentials;
      if (options?.authProvider) {
        switch (options.authProvider) {
          case 'internal': {
            creds = new UserCredentials({
              authProvider: 'internal',
            });
            break;
          }
          case 'keycloak':
          default: {
            creds = new UserCredentials({
              authProvider: 'keycloak',
              authId: options?.authId,
            });
            break;
          }
        }
      } else {
        creds = new UserCredentials({
          authProvider: 'keycloak',
          authId: options?.authId,
        });
      }
      await this.credentials(user.id).create(creds, options);
    } catch (err) {
      await super.deleteByIdHard(user.id);
      throw new HttpErrors.UnprocessableEntity(
        `Error while hashing password ${err.message}`,
      );
    }
    return user;
  }
}
