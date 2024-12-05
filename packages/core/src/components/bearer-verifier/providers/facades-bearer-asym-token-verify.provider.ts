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
import {JwtKeysRepository} from '../../../repositories';
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
    @repository(JwtKeysRepository)
    public jwtKeysRepo: JwtKeysRepository,
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
        // Get the key that matches the token's kid
        const decoded = jwt.decode(token.trim(), {complete: true});
        if (!decoded) {
          throw new Error('Token is not valid');
        }
        const kid = decoded?.header.kid;

        // Load the JWKS
        const key = await this.jwtKeysRepo.findOne({
          where: {
            keyId: kid,
          },
        });

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
}
