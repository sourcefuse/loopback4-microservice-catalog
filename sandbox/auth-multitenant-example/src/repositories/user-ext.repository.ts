import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DataObject,
  HasManyRepositoryFactory,
  HasOneRepositoryFactory,
  Options,
  repository,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {AuthDbSourceName} from '@sourceloop/authentication-service';
import {
  AuthenticateErrorKeys,
  DefaultSoftCrudRepository,
} from '@sourceloop/core';
import * as bcrypt from 'bcrypt';
import {AuthErrorKeys} from 'loopback4-authentication';
import {PgdbDataSource} from '../datasources';
import {
  Tenant,
  User,
  UserCredentials,
  UserRelations,
  UserTenant,
} from '../models';
import {TenantExtRepository} from './tenant-ext.repository';
import {UserCredentialsExtRepository} from './user-credentials-ext.repository';
import {UserTenantExtRepository} from './user-tenant-ext.repository';

const saltRounds = 10;
export class UserExtRepository extends DefaultSoftCrudRepository<
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
    @inject(`datasources.${AuthDbSourceName}`) dataSource: PgdbDataSource,
    @repository.getter('TenantRepository')
    protected tenantRepositoryGetter: Getter<TenantExtRepository>,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsExtRepository>,
    @repository.getter('UserTenantRepository')
    protected userTenantRepositoryGetter: Getter<UserTenantExtRepository>,
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
      'userCredentials',
      userCredentialsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userCredentials',
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
          case 'keycloak': {
            creds = new UserCredentials({
              authProvider: 'keycloak',
              authId: options?.authId,
            });
            break;
          }
          case 'internal':
          default: {
            const password = await bcrypt.hash(
              process.env.USER_TEMP_PASSWORD,
              saltRounds,
            );
            creds = new UserCredentials({
              authProvider: 'internal',
              password,
            });
            break;
          }
        }
      } else {
        const password = await bcrypt.hash(
          process.env.USER_TEMP_PASSWORD,
          saltRounds,
        );
        creds = new UserCredentials({
          authProvider: 'internal',
          password,
        });
      }
      await this.credentials(user.id).create(creds, options);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      super.deleteByIdHard(user.id);
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
