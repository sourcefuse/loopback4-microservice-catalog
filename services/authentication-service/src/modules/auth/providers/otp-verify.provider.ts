// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import {
  AuthenticationBindings,
  AuthErrorKeys,
  VerifyFunction,
} from 'loopback4-authentication';
import {totp} from 'otplib';
import {AuthClient} from '../../../models';
import {OtpCacheRepository, UserRepository} from '../../../repositories';
import {UserRepository as SequelizeUserRepository} from '../../../repositories/sequelize';
import {OtpService} from '../../../services';
import {OtpService as SequelizeOtpService} from '../../../services/sequelize';
export class OtpVerifyProvider implements Provider<VerifyFunction.OtpAuthFn> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository | SequelizeUserRepository,
    @repository(OtpCacheRepository)
    public otpCacheRepo: OtpCacheRepository,
    @inject(LOGGER.LOGGER_INJECT) protected readonly logger: ILogger,
    @inject(AuthenticationBindings.CURRENT_CLIENT)
    protected readonly client: AuthClient,
    @inject('services.otpService')
    protected readonly otpService: OtpService | SequelizeOtpService,
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

      //sender
      if (!otp) {
        await this.otpService.sendOtp(user, this.client);
        return user;
      }

      //verifier
      const otpCache = await this.otpCacheRepo.get(username);
      if (!otpCache) {
        this.logger.error('Invalid Username');
        throw new HttpErrors.Unauthorized(AuthErrorKeys.OtpExpired);
      }

      let isValid = false;
      try {
        if (otpCache.otpSecret) isValid = totp.check(otp, otpCache.otpSecret);
      } catch (err) {
        this.logger.error(err);
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
      if (!isValid) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.OtpInvalid);
      }
      return user;
    };
  }
}
