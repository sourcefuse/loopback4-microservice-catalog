// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Constructor, inject, Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors, Request} from '@loopback/rest';
import {verify} from 'jsonwebtoken';
import {
  VerifyFunction,
  AuthenticationBindings,
  EntityWithIdentifier,
  IAuthUser,
} from 'loopback4-authentication';
import moment from 'moment';
import * as fs from 'fs/promises';
import {ILogger, LOGGER} from '../../logger-extension';
import {IAuthUserWithPermissions} from '../keys';
import {RevokedTokenRepository} from '../repositories';

export class FacadesBearerAsymmetricTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn>
{
  constructor(
    @repository(RevokedTokenRepository)
    public revokedTokenRepository: RevokedTokenRepository,
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
    @inject(AuthenticationBindings.USER_MODEL, {optional: true})
    public authUserModel?: Constructor<EntityWithIdentifier & IAuthUser>,
  ) {}

  value(): VerifyFunction.BearerFn {
    return async (token: string, req?: Request) => {
      try {
        const isRevoked = await this.revokedTokenRepository.get(token);
        if (isRevoked?.token) {
          throw new HttpErrors.Unauthorized('TokenRevoked');
        }
      } catch (error) {
        if (HttpErrors.HttpError.prototype.isPrototypeOf(error)) {
          throw error;
        }
        this.logger.error('Revoked token repository not available !');
      }

      let user: IAuthUserWithPermissions;
      try {
        const publicKey = await fs.readFile(process.env.JWT_PUBLIC_KEY ?? '');
        user = verify(token, publicKey, {
          issuer: process.env.JWT_ISSUER,
          algorithms: ['RS256'],
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
