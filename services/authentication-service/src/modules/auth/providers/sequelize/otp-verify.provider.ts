// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {ILogger, LOGGER} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {AuthClient} from '../../../../models';
import {
  OtpCacheRepository,
  UserRepository,
} from '../../../../repositories/sequelize';
import {OtpService} from '../../../../services/sequelize';
import {OtpVerifyProvider as JugglerOtpVerifyProvider} from '../otp-verify.provider';
export class OtpVerifyProvider extends JugglerOtpVerifyProvider {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(OtpCacheRepository)
    public otpCacheRepo: OtpCacheRepository,
    @inject(LOGGER.LOGGER_INJECT) protected readonly logger: ILogger,
    @inject(AuthenticationBindings.CURRENT_CLIENT)
    protected readonly client: AuthClient,
    @inject('services.otpService')
    protected readonly otpService: OtpService,
  ) {
    super(userRepository, otpCacheRepo, logger, client, otpService);
  }
}
