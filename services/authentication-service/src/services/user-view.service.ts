// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingScope, Getter, inject, injectable} from '@loopback/core';
import {HasOneRepositoryFactory, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  AuthProvider,
  AuthenticateErrorKeys,
  IAuthUserWithPermissions,
  ILogger,
  LOGGER,
} from '@sourceloop/core';
import * as bcrypt from 'bcrypt';
import {AuthErrorKeys, AuthenticationBindings} from 'loopback4-authentication';
import {AuthServiceBindings} from '../keys';
import {UserCredentials} from '../models/user-credentials.model';
import {UserView} from '../models/user-view.model';
import {User} from '../models/user.model';
import {PasswordDecryptionFn} from '../providers/types';
import {UserCredentialsRepository} from '../repositories';
import {UserViewRepository} from '../repositories/user-view.repository';
@injectable({scope: BindingScope.TRANSIENT})
export class UserViewService {
  public readonly credentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;
  constructor(
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @inject(AuthServiceBindings.PASSWORD_DECRYPTION_PROVIDER)
    private readonly passwordDecryptionFn: PasswordDecryptionFn,
    @repository(UserViewRepository)
    public userViewRepository: UserViewRepository,
    @repository(UserCredentialsRepository)
    public userCredentialsRepository: UserCredentialsRepository,
  ) {}

  async verifyPassword(username: string, password: string): Promise<UserView> {
    let newPassword = password;
    if (process.env.PRIVATE_DECRYPTION_KEY) {
      const decryptedPassword = await this.passwordDecryptionFn(password);
      newPassword = decryptedPassword;
    }
    const user = await this.userViewRepository.findOne({
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
}
