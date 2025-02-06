// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Constructor, inject, Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors, Request} from '@loopback/rest';
import * as jwt from 'jsonwebtoken';
import {
  AuthenticationBindings,
  EntityWithIdentifier,
  IAuthUser,
  VerifyFunction,
} from 'loopback4-authentication';
import moment from 'moment';
import * as jose from 'node-jose';
import {
  PublicKeysRepository,
  RevokedTokenRepository,
} from '../../../repositories';
import {ILogger, LOGGER} from '../../logger-extension';
import {IAuthUserWithPermissions} from '../keys';

export class FacadesBearerAsymmetricTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn>
{
  constructor(
    @repository(RevokedTokenRepository)
    public revokedTokenRepository: RevokedTokenRepository,
    @repository(PublicKeysRepository)
    public publicKeysRepository: PublicKeysRepository,
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
    @inject(AuthenticationBindings.USER_MODEL, {optional: true})
    public authUserModel?: Constructor<EntityWithIdentifier & IAuthUser>,
  ) {}

  /**
   * The function returns a BearerFn that verifies a token, checks if it is revoked, verifies the token
   * to get the user, and checks the password expiry before returning the authenticated user.
   * @returns The `value()` function is returning a `BearerFn` function that takes a token and an
   * optional request object as parameters. Inside the function, it first checks if the token is
   * revoked, then verifies the token and retrieves the user information. After that, it checks the
   * password expiry for the user. Finally, it returns either a new instance of `authUserModel` with
   * the user data or the
   */
  value(): VerifyFunction.BearerFn {
    return async (token: string, req?: Request) => {
      await this._checkIfTokenRevoked(token);
      let user = await this._verifyTokenAndGetUser(token);
      this._checkPasswordExpiry(user);
      try {
        // Get the key that matches the token's kid
        const decoded = jwt.decode(token.trim(), {complete: true});
        if (!decoded) {
          throw new Error('Token is not valid');
        }
        const kid = decoded?.header.kid ?? '';

        // Get the public key from the cache
        const key = await this.publicKeysRepository.get(kid);

        if (!key) {
          throw new Error('Key not found for verification');
        }

        // Convert the JWK to PEM format for verification
        const jwkKey = await jose.JWK.asKey(key.publicKey, 'pem');
        const pem = jwkKey.toPEM(false);

        // Verify the token with the retrieved PEM-formatted public key
        user = jwt.verify(token, pem, {
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

  /**
   * The function `_checkIfTokenRevoked` checks if a token is revoked and throws an error if it is.
   * @param {string} token - The `token` parameter in the `_checkIfTokenRevoked` function is a string
   * that represents the token being checked for revocation. This token is used to query the
   * `revokedTokenRepository` to determine if it has been revoked. If the token is found to be revoked,
   * an `
   */
  private async _checkIfTokenRevoked(token: string): Promise<void> {
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
  }

  /**
   * The function `_verifyTokenAndGetUser` verifies a token, decodes it, retrieves the corresponding
   * key, and then verifies the token's authenticity using the key.
   * @param {string} token - The `token` parameter in the `_verifyTokenAndGetUser` function is a string
   * that represents the JWT (JSON Web Token) that needs to be verified and decoded to extract user
   * information and permissions.
   * @returns The function `_verifyTokenAndGetUser` is returning a Promise that resolves to an object
   * of type `IAuthUserWithPermissions`. This object likely contains information about the
   * authenticated user along with their permissions. The function first decodes the JWT token,
   * retrieves the key associated with the token, verifies the token using the key, and finally returns
   * the decoded user information if the verification is successful. If any errors
   */
  private async _verifyTokenAndGetUser(
    token: string,
  ): Promise<IAuthUserWithPermissions> {
    try {
      const decoded = jwt.decode(token.trim(), {complete: true});
      if (!decoded) {
        throw new Error('Token is not valid');
      }

      const kid = decoded?.header.kid;
      const key = await this.publicKeysRepository.get(kid ?? '');
      if (!key) {
        throw new Error('Key not found for verification');
      }

      const jwkKey = await jose.JWK.asKey(key.publicKey, 'pem');
      const pem = jwkKey.toPEM(false);

      return jwt.verify(token, pem, {
        issuer: process.env.JWT_ISSUER,
        algorithms: ['RS256'],
      }) as IAuthUserWithPermissions;
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new HttpErrors.Unauthorized('TokenExpired');
    }
  }

  /**
   * The function `_checkPasswordExpiry` checks if a user's password has expired based on the
   * `passwordExpiryTime` property in the `user` object.
   * @param {IAuthUserWithPermissions} user - The `user` parameter is of type
   * `IAuthUserWithPermissions`, which likely represents a user object with authentication-related
   * properties and permissions. In this specific function `_checkPasswordExpiry`, it checks if the
   * `user` object has a `passwordExpiryTime` property set and if the current
   */
  private _checkPasswordExpiry(user: IAuthUserWithPermissions): void {
    if (
      user.passwordExpiryTime &&
      moment().isSameOrAfter(moment(user.passwordExpiryTime))
    ) {
      throw new HttpErrors.Unauthorized('PasswordExpiryError');
    }
  }
}
