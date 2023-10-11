// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {ILogger, LOGGER} from '@sourceloop/core';
import {
  OtpCacheRepository,
  UserCredentialsRepository,
  UserRepository,
} from '../../../../repositories/sequelize';
import {GoogleAuthenticatorVerifyProvider as JugglerGoogleAuthenticatorVerifyProvider} from '../google-authenticator-verify.provider';
export class GoogleAuthenticatorVerifyProvider extends JugglerGoogleAuthenticatorVerifyProvider {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @repository(OtpCacheRepository)
    public otpCacheRepo: OtpCacheRepository,
    @inject(LOGGER.LOGGER_INJECT) protected readonly logger: ILogger,
  ) {
    super(userRepository, userCredsRepository, otpCacheRepo, logger);
  }
}
