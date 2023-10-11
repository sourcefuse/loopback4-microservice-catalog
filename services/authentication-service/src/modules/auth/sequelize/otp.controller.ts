import { inject } from '@loopback/context';
import { repository } from '@loopback/repository';
import { ILogger, LOGGER } from '@sourceloop/core';
import { AuthClientRepository, OtpCacheRepository, UserCredentialsRepository, UserRepository } from '../../../repositories/sequelize';
import { OtpController as JugglerOtpController } from '../otp.controller';
export class OtpController extends JugglerOtpController{
  constructor(
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
    @repository(UserRepository)
    public userRepo: UserRepository,
    @repository(OtpCacheRepository)
    public otpCacheRepo: OtpCacheRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {
    super(authClientRepository,userRepo,otpCacheRepo,userCredsRepository,logger)
  }
  }