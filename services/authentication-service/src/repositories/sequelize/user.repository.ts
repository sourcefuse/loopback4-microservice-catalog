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
  repository,
} from '@loopback/repository';
import {Options} from '@loopback/repository/src/common-types';
import {HttpErrors} from '@loopback/rest';
import {SequelizeDataSource} from '@loopback/sequelize';
import {
  AuthProvider,
  AuthenticateErrorKeys,
  ILogger,
  LOGGER,
  UserStatus,
} from '@sourceloop/core';
import * as bcrypt from 'bcrypt';
import {AuthErrorKeys} from 'loopback4-authentication';
import {SequelizeSoftCrudRepository} from 'loopback4-soft-delete/sequelize';
import {AuthServiceBindings} from '../../keys';
import {
  Tenant,
  User,
  UserCredentials,
  UserRelations,
  UserTenant,
} from '../../models';
import {PasswordDecryptionFn} from '../../providers';
import {AuthDbSourceName} from '../../types';
import {OtpRepository} from '../otp.repository';
import {TenantRepository} from './tenant.repository';
import {UserCredentialsRepository} from './user-credentials.repository';
import {UserTenantRepository} from './user-tenant.repository';
const saltRounds = 10;
export class UserRepository extends SequelizeSoftCrudRepository<
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
    dataSource: SequelizeDataSource,
    @repository.getter(UserCredentialsRepository)
    getUserCredsRepository: Getter<UserCredentialsRepository>,
    @repository.getter(OtpRepository)
    public getOtpRepository: Getter<OtpRepository>,
    @repository.getter('TenantRepository')
    protected tenantRepositoryGetter: Getter<TenantRepository>,
    @repository.getter('UserTenantRepository')
    protected userTenantRepositoryGetter: Getter<UserTenantRepository>,
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
    @inject(AuthServiceBindings.PASSWORD_DECRYPTION_PROVIDER)
    private readonly passwordDecryptionFn: PasswordDecryptionFn,
    @inject('models.User')
    private readonly user: typeof Entity & {prototype: User},
  ) {
    super(user, dataSource);
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

  async create(entity: DataObject<User>, options?: Options): Promise<User> {
    const user = await super.create(entity, options);
    try {
      // Add temporary password for first time
      const password = (await bcrypt.hash(
        process.env.USER_TEMP_PASSWORD as string,
        saltRounds,
      )) as string;
      const creds = new UserCredentials({
        authProvider: 'internal',
        password,
      });
      await this.credentials(user.id).create(creds);
    } catch (err) {
      throw new HttpErrors.UnprocessableEntity(
        `Error while hashing password ${err.message}`,
      );
    }
    return user;
  }

  async createWithoutPassword(
    entity: DataObject<User>,
    options?: Options,
  ): Promise<User> {
    return super.create(entity, options);
  }

  async verifyPassword(username: string, password: string): Promise<User> {
    let newPassword = password;
    if (process.env.PRIVATE_DECRYPTION_KEY) {
      const decryptedPassword = await this.passwordDecryptionFn(password);
      newPassword = decryptedPassword;
    }
    const user = await super.findOne({
      where: {username: username.toLowerCase()},
    });
    const creds = user && (await this.credentials(user.id).get());
    if (!user || user.deleted) {
      throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.UserDoesNotExist);
    } else if (
      !creds?.password ||
      creds.authProvider !== AuthProvider.INTERNAL ||
      !(await bcrypt.compare(newPassword, creds.password))
    ) {
      this.logger.error('User creds not found in DB or is invalid');
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    } else {
      return user;
    }
  }
  async decryptPassword(password: string): Promise<string> {
    const decryptedPassword = await this.passwordDecryptionFn(password);
    return decryptedPassword;
  }
  async updatePassword(
    username: string,
    password: string,
    newPassword: string,
  ): Promise<User> {
    const user = await super.findOne({where: {username}});
    const creds = user && (await this.credentials(user.id).get());
    if ((!user || user.deleted) ?? !creds?.password) {
      throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.UserDoesNotExist);
    } else if (creds.authProvider !== AuthProvider.INTERNAL) {
      throw new HttpErrors.BadRequest(
        AuthenticateErrorKeys.PasswordCannotBeChanged,
      );
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

  async changePassword(
    username: string,
    newPassword: string,
    oldPassword?: string,
  ): Promise<User> {
    const user = await super.findOne({where: {username}});
    const creds = user && (await this.credentials(user.id).get());

    if (oldPassword) {
      // This method considers old password as OTP
      const otp = await (await this.getOtpRepository()).get(username);
      if (otp?.otp !== oldPassword) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.WrongPassword);
      }
    }

    if (creds?.authProvider !== AuthProvider.INTERNAL) {
      throw new HttpErrors.Unauthorized(
        AuthenticateErrorKeys.PasswordCannotBeChanged,
      );
    }
    if ((!user || user.deleted) ?? !creds?.password) {
      throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.UserDoesNotExist);
    } else if (await bcrypt.compare(newPassword, creds.password)) {
      throw new HttpErrors.Unauthorized(
        'Password cannot be same as previous password!',
      );
    } else {
      // DO nothing
    }
    await this.credentials(user.id).patch({
      password: await bcrypt.hash(newPassword, saltRounds),
    });
    return user;
  }

  async updateLastLogin(userId: string): Promise<void> {
    await super.updateById(
      userId,
      {
        lastLogin: Date.now(),
      },
      {
        currentUser: {id: userId},
      },
    );
  }

  async firstTimeUser(userId: string): Promise<boolean> {
    const user = await super.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HttpErrors.NotFound(AuthenticateErrorKeys.UserDoesNotExist);
    }

    const userTenant = await (
      await this.userTenantRepositoryGetter()
    ).findOne({
      where: {
        userId,
        tenantId: user.defaultTenantId,
        status: {
          inq: [UserStatus.REGISTERED, UserStatus.PASSWORD_CHANGE_NEEDED],
        },
      },
    });
    return !!userTenant;
  }
}
