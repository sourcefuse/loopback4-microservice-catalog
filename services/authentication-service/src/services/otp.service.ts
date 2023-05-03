// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import {AuthErrorKeys} from 'loopback4-authentication';
import {AuthClient, User} from '../models';
import {OtpResponse} from '../modules/auth';
import {OtpFn, VerifyBindings} from '../providers';
import {OtpCacheRepository, UserRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class OtpService {
  constructor(
    @repository(OtpCacheRepository)
    private readonly otpCacheRepo: OtpCacheRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
    @inject(VerifyBindings.OTP_PROVIDER, {optional: true})
    private readonly otpSender: OtpFn,
  ) {}

  async sendOtp(
    user: User | null,
    client?: AuthClient,
  ): Promise<OtpResponse | void> {
    if (!client) {
      this.logger.error('Auth client not found or invalid');
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    }
    if (!user) {
      this.logger.error('Auth user not found or invalid');
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    }

    const res: OtpResponse = await this.otpSender(user);

    await this.otpCacheRepo.delete(user.username);
    await this.otpCacheRepo.set(user.username, {
      otpSecret: res.key,
      clientId: client.clientId,
      clientSecret: client.secret,
    });
  }
}
