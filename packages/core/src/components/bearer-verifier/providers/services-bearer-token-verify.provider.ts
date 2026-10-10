// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Constructor, inject, Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {verify} from 'jsonwebtoken';
import {
  AuthenticationBindings,
  EntityWithIdentifier,
  IAuthUser,
  VerifyFunction,
} from 'loopback4-authentication';
import moment from 'moment-timezone';
import {RevokedTokenRepository} from '../../../repositories';
import {ILogger, LOGGER} from '../../logger-extension';
import {IAuthUserWithPermissions} from '../keys';
import {checkIfTokenRevoked} from './utils/revoked-token-checker.util';

export class ServicesBearerTokenVerifyProvider implements Provider<VerifyFunction.BearerFn> {
  constructor(
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @repository(RevokedTokenRepository)
    public revokedTokenRepo: RevokedTokenRepository,
    @inject(AuthenticationBindings.USER_MODEL, {optional: true})
    public authUserModel?: Constructor<EntityWithIdentifier & IAuthUser>,
  ) {}

  value(): VerifyFunction.BearerFn {
    return async (token: string) => {
      // Check if token has been revoked
      await checkIfTokenRevoked(token, this.revokedTokenRepo, this.logger);

      let user: IAuthUserWithPermissions;

      try {
        user = verify(token, process.env.JWT_SECRET as string, {
          issuer: process.env.JWT_ISSUER,
          algorithms: ['HS256'],
        }) as IAuthUserWithPermissions;
      } catch (error) {
        this.logger.error(JSON.stringify(error));
        throw new HttpErrors.Unauthorized('TokenExpired');
      }

      if (
        user.passwordExpiryTime &&
        moment().isSameOrAfter(moment(user.passwordExpiryTime))
      ) {
        throw new HttpErrors.Unauthorized('PasswordExpiryError');
      }
      if (this.authUserModel) {
        return new this.authUserModel(user);
      } else {
        return user;
      }
    };
  }
}
