// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {AuthErrorKeys, VerifyFunction} from 'loopback4-authentication';
import {
  OtpCacheRepository,
  UserCredentialsRepository,
  UserRepository,
} from '../../../repositories';
import {ILogger, LOGGER} from '@sourceloop/core';
import {authenticator} from 'otplib';
import {UserCredentials} from '../../../models';

export class GoogleAuthenticatorVerifyProvider
  implements Provider<VerifyFunction.OtpAuthFn>
{
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @repository(OtpCacheRepository)
    public otpCacheRepo: OtpCacheRepository,
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
  ) {}

  value(): VerifyFunction.OtpAuthFn {
    return async (username: string, otp: string) => {
      const user = await this.userRepository.findOne({
        where: {
          username: username,
        },
      });
      if (!user) {
        this.logger.error('Invalid Username');
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }

      const authenticatorSecret: Pick<UserCredentials, 'secretKey'> | null =
        await this.userCredsRepository.findOne({
          where: {
            userId: user.id,
          },
          fields: {
            secretKey: true,
          },
        });

      if (!authenticatorSecret?.secretKey) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }

      let isValid = false;
      try {
        isValid = authenticator
          .create(authenticator.allOptions())
          .verify({token: otp, secret: authenticatorSecret.secretKey});
      } catch (err) {
        this.logger.error(err);
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
      if (!isValid) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.OtpExpired);
      }
      return user;
    };
  }
}
