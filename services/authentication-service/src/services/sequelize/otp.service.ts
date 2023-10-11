import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {ILogger, LOGGER} from '@sourceloop/core';
import {OtpFn, VerifyBindings} from '../..';
import {OtpCacheRepository, UserRepository} from '../../repositories/sequelize';
import {OtpService as JugglerOtpService} from '../otp.service';
export class OtpService extends JugglerOtpService {
  constructor(
    @repository(OtpCacheRepository)
    protected readonly otpCacheRepo: OtpCacheRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(LOGGER.LOGGER_INJECT) protected readonly logger: ILogger,
    @inject(VerifyBindings.OTP_PROVIDER, {optional: true})
    protected readonly otpSender: OtpFn,
  ) {
    super(otpCacheRepo, userRepository, logger, otpSender);
  }
}
