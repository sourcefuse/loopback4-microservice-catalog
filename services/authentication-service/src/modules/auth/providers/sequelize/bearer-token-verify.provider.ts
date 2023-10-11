// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {ILogger, LOGGER} from '@sourceloop/core';
import {AuthCodeBindings, JWTVerifierFn} from '../../../../providers';
import {RevokedTokenRepository} from '../../../../repositories/sequelize';
import {AuthUser} from '../../models/auth-user.model';
import {BearerTokenVerifyProvider as JugglerBearerTokenVerifyProvider} from '../bearer-token-verify.provider';
export class BearerTokenVerifyProvider extends JugglerBearerTokenVerifyProvider {
  constructor(
    @repository(RevokedTokenRepository)
    public revokedTokenRepository: RevokedTokenRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject(AuthCodeBindings.JWT_VERIFIER)
    public jwtVerifier: JWTVerifierFn<AuthUser>,
  ) {
    super(revokedTokenRepository, logger, jwtVerifier);
  }
}
