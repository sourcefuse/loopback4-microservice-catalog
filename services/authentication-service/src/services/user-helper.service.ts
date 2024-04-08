// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/context';
import {BindingScope, injectable} from '@loopback/core';
import {
  DataObject,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  AuthProvider,
  AuthenticateErrorKeys,
  ILogger,
  LOGGER,
  UserStatus,
} from '@sourceloop/core';
import * as bcrypt from 'bcrypt';
import {User, UserCredentials} from '../models';

import {Options} from '@loopback/repository/src/common-types';
import {AuthErrorKeys} from 'loopback4-authentication';
import {AuthServiceBindings} from '../keys';
import {PasswordDecryptionFn, PasswordHashingFn} from '../providers';
import {
  OtpRepository,
  UserCredentialsRepository,
  UserRepository,
  UserTenantRepository,
} from '../repositories';
const saltRounds = 10;

@injectable({scope: BindingScope.TRANSIENT})
export class UserHelperService {
  public readonly credentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredentialsRepository: UserCredentialsRepository,
    @repository.getter(OtpRepository)
    public getOtpRepository: Getter<OtpRepository>,
    @repository.getter('UserTenantRepository')
    protected userTenantRepositoryGetter: Getter<UserTenantRepository>,
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
    @inject(AuthServiceBindings.PASSWORD_DECRYPTION_PROVIDER)
    private readonly passwordDecryptionFn: PasswordDecryptionFn,
    @inject(AuthServiceBindings.PASSWORD_HASHING_PROVIDER)
    private readonly passwordHashingProvider: PasswordHashingFn,
  ) {}

  async create(entity: DataObject<User>, options?: Options): Promise<User> {
    const user = await this.userRepository.create(entity, options);
    try {
      // Add temporary password for first time
      const password = await this.passwordHashingProvider(
        process.env.USER_TEMP_PASSWORD as string,
      );
      const creds = new UserCredentials({
        userId: user.id,
        authProvider: 'internal',
        password,
      });
      await this.userCredentialsRepository.create(creds);
    } catch (err) {
      throw new HttpErrors.UnprocessableEntity('Error while hashing password');
    }
    return user;
  }

  async createWithoutPassword(
    entity: DataObject<User>,
    options?: Options,
  ): Promise<User> {
    return this.userRepository.create(entity, options);
  }

  async verifyPassword(username: string, password: string): Promise<User> {
    let newPassword = password;
    if (process.env.PRIVATE_DECRYPTION_KEY) {
      const decryptedPassword = await this.passwordDecryptionFn(password);
      newPassword = decryptedPassword;
    }
    const user = await this.userRepository.findOne({
      where: {username: username.toLowerCase()},
    });
    const creds =
      user &&
      (await this.userCredentialsRepository.findOne({
        where: {userId: user.id},
      }));
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
    const user = await this.userRepository.findOne({where: {username}});
    const creds =
      user &&
      (await this.userCredentialsRepository.findOne({
        where: {userId: user.id},
      }));
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
    creds.password = await bcrypt.hash(newPassword, saltRounds);
    await this.userCredentialsRepository.update(creds);
    return user;
  }

  async changePassword(
    username: string,
    newPassword: string,
    oldPassword?: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({where: {username}});
    const creds =
      user &&
      (await this.userCredentialsRepository.findOne({
        where: {userId: user.id},
      }));

    if (oldPassword) {
      // This method considers old password as OTP
      const otp = await (await this.getOtpRepository()).get(username);
      if (!otp || otp.otp !== oldPassword) {
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
    creds.password = await bcrypt.hash(newPassword, saltRounds);
    await this.userCredentialsRepository.update(creds);
    return user;
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.updateById(
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
    const user = await this.userRepository.findOne({
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
