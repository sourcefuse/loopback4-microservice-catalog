import {Provider, inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  Otp,
  OtpRepository,
  UserCredentialsRepository,
  UserRepository,
  UserTenantRepository,
} from '@sourceloop/authentication-service';
import {
  AuthProvider,
  AuthenticateErrorKeys,
  ILogger,
  LOGGER,
  UserStatus,
} from '@sourceloop/core';

import * as bcrypt from 'bcrypt';
import {AuthErrorKeys, VerifyFunction} from 'loopback4-authentication';
import {AuthUser} from '../models';
// import { AuthUser } from '../models/auth-user.model';

export class LocalPasswordVerifyProvider
  implements Provider<VerifyFunction.LocalPasswordFn>
{
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredentialsRepository: UserCredentialsRepository,
    @repository(UserTenantRepository)
    public utRepository: UserTenantRepository,
    @repository(OtpRepository)
    public otpRepository: OtpRepository,
    @inject(LOGGER.LOGGER_INJECT)
    private readonly logger: ILogger,
  ) {}

  value(): VerifyFunction.LocalPasswordFn {
    return async (username: string, password: string) => {
      try {
        const user = await this.userRepository.findOne({
          where: {username: username.toLowerCase()},
        });
        const creds =
          user &&
          (await this.userCredentialsRepository.findOne({
            where: {
              userId: user?.id,
              authProvider: AuthProvider.INTERNAL,
            },
          }));
        if (!user || user.deleted) {
          throw new HttpErrors.Unauthorized(
            AuthenticateErrorKeys.UserDoesNotExist,
          );
        } else if (
          !creds?.password ||
          !(await bcrypt.compare(password, creds.password))
        ) {
          this.logger.error('User creds not found in DB or is invalid');
          throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
        } else {
          const userRepos = new AuthUser(user);
          userRepos.permissions = [];
          return userRepos;
        }
      } catch (error) {
        const otp: Otp = await this.otpRepository.get(username);
        if (!otp || otp.otp !== password) {
          throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
        }
        const user = await this.userRepository.findOne({
          where: {username},
        });
        if (!user) {
          throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientUserMissing);
        }

        const userTenant = await this.utRepository.findOne({
          where: {
            userId: user.id,
            tenantId: user.defaultTenantId,
            status: {
              nin: [UserStatus.REJECTED, UserStatus.INACTIVE],
            },
          },
        });
        if (!userTenant) {
          throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.UserInactive);
        }
        const retUser = new AuthUser(user);
        retUser.permissions = [];
        return retUser;
      }
    };
  }
}
