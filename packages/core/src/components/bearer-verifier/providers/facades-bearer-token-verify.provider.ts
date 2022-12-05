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

import {ILogger, LOGGER} from '../../logger-extension';
import {IAuthUserWithPermissions} from '../keys';
import {RevokedTokenRepository} from '../repositories';

/**
 * @param {FacadesBearerTokenVerifyProvider} - exporting class `FacadesBearerTokenVerifyProvider`
 * @param {VerifyFunction.BearerFn} VerifyFunction.BearerFn A provider for the `VerifyFunction.BearerFn`
 * @constructor The constructor function is used to inject the `RevokedTokenRepository` and the `Logger` into the class
 * @param {RevokedTokenRepository} revokedTokenRepository - This is the repository that will be used
 * to store the revoked tokens.
 * @param {ILogger} logger - This is the logger that we injected in the previous step.
 * @param [authUserModel] - This is the model that will be used to store the user information.
 */
export class FacadesBearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn>
{
  constructor(
    @repository(RevokedTokenRepository)
    public revokedTokenRepository: RevokedTokenRepository,
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
    @inject(AuthenticationBindings.USER_MODEL, {optional: true})
    public authUserModel?: Constructor<EntityWithIdentifier & IAuthUser>,
  ) {}

  /**
   *  @param {VerifyFunction.BearerFn} - a fucntion that will be called when the token is verified.
   *  @return - a token of string type and req.
   *  Constant @param {isRevoked} - that checks if the token is revoked or not.
   *  @return - If it is a HttpError, then it will be thrown.
   *  */
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

      /**
       * @param {user} - a variable that will be used to store the user information.
       * @param {verify()} - a function that verifies the token.
       */
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

      /**
       *  This is used to check if the password is expired or not.
       *  */
      if (
        user.passwordExpiryTime &&
        moment().isSameOrAfter(moment(user.passwordExpiryTime))
      ) {
        throw new HttpErrors.Unauthorized('PasswordExpiryError');
      }

      /**
       * @param {this.authUserModel} - checks if the user model is defined or not.
       * @return - If it is defined, then it will return the user model.
       * @return - If it is not defined, then it will return the user.
       * */
      if (this.authUserModel) {
        return new this.authUserModel(user);
      } else {
        return user;
      }
    };
  }
}
