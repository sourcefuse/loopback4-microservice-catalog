// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors, Request} from '@loopback/rest';
import {AuthenticateErrorKeys, ILogger, LOGGER} from '@sourceloop/core';
import {VerifyFunction} from 'loopback4-authentication';
import moment from 'moment-timezone';
import {AuthCodeBindings, JWTVerifierFn} from '../../../providers';

import {RevokedTokenRepository} from '../../../repositories';
import {AuthUser} from '../models/auth-user.model';

export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn>
{
  constructor(
    @repository(RevokedTokenRepository)
    public revokedTokenRepository: RevokedTokenRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject(AuthCodeBindings.JWT_VERIFIER)
    public jwtVerifier: JWTVerifierFn<AuthUser>,
  ) {}

  value(): VerifyFunction.BearerFn {
    return async (token: string, req?: Request) => {
      const isRevoked = await this.revokedTokenRepository.get(token);
      if (isRevoked?.token) {
        throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.TokenRevoked);
      }

      let user: AuthUser;
      try {
        user = await this.jwtVerifier(token, {
          issuer: process.env.JWT_ISSUER,
          algorithms: ['HS256'],
        });
      } catch (error) {
        this.logger.error(JSON.stringify(error));
        throw new HttpErrors.Unauthorized('TokenExpired');
      }

      if (
        user.passwordExpiryTime &&
        moment().isSameOrAfter(moment(user.passwordExpiryTime))
      ) {
        throw new HttpErrors.Unauthorized(
          AuthenticateErrorKeys.PasswordExpiryError,
        );
      }
      return user;
    };
  }
}
