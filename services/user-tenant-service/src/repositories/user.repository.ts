// Copyright (c) 2022 Sourcefuse Technologies
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
  juggler,
  Options,
  repository,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  AuthenticateErrorKeys,
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import * as bcrypt from 'bcrypt';
import {AuthenticationBindings, AuthErrorKeys} from 'loopback4-authentication';

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

const saltRounds = 10;
export class UserRepository extends DefaultUserModifyCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly tenant: BelongsToAccessor<Tenant, typeof User.prototype.id>;

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
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @repository.getter('TenantRepository')
    protected tenantRepositoryGetter: Getter<TenantRepository>,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
    @repository.getter('UserTenantRepository')
    protected userTenantRepositoryGetter: Getter<UserTenantRepository>,
    @inject('models.User')
    private readonly user: typeof Entity & {prototype: User},
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
    this.tenant = this.createBelongsToAccessorFor(
      'defaultTenant',
      tenantRepositoryGetter,
    );
    this.registerInclusionResolver(
      'defaultTenant',
      this.tenant.inclusionResolver,
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
      throw new HttpErrors.UnprocessableEntity('Error while hashing password');
    }
    return user;
  }

  async verifyPassword(username: string, password: string): Promise<User> {
    const user = await super.findOne({where: {username}});
    const creds = user && (await this.credentials(user.id).get());
    if (!user || user.deleted || !creds || !creds.password) {
      throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.UserDoesNotExist);
    } else if (!(await bcrypt.compare(password, creds.password))) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    } else if (
      process.env.USER_TEMP_PASSWORD &&
      (await bcrypt.compare(password, process.env.USER_TEMP_PASSWORD))
    ) {
      throw new HttpErrors.Forbidden(
        AuthenticateErrorKeys.TempPasswordLoginDisallowed,
      );
    } else {
      return user;
    }
  }

  async updatePassword(
    username: string,
    password: string,
    newPassword: string,
  ): Promise<User> {
    const user = await super.findOne({where: {username}});
    const creds = user && (await this.credentials(user.id).get());
    if (!user || user.deleted || !creds || !creds.password) {
      throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.UserDoesNotExist);
    } else if (!(await bcrypt.compare(password, creds.password))) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.WrongPassword);
    } else if (await bcrypt.compare(newPassword, creds.password)) {
      throw new HttpErrors.Unauthorized(
        'Password cannot be same as previous password!',
      );
    } else {
      // Do nothing
    }
    await this.credentials(user.id).patch({
      password: await bcrypt.hash(newPassword, saltRounds),
    });
    return user;
  }
}
