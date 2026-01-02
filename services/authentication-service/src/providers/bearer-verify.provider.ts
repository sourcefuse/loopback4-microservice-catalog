// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors, Request} from '@loopback/rest';
import {ILogger, JwtKeysRepository, LOGGER} from '@sourceloop/core';
import * as jwt from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';
import * as jose from 'node-jose';
import {AuthServiceBindings} from '../keys';
import {SignupRequest} from '../models/signup-request.model';
import {IAuthServiceConfig} from '../types';

export class SignupBearerVerifyProvider implements Provider<
  VerifyFunction.BearerFn<SignupRequest>
> {
  constructor(
    @repository(JwtKeysRepository)
    public jwtKeysRepo: JwtKeysRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject(AuthServiceBindings.Config, {optional: true})
    private readonly authConfig?: IAuthServiceConfig,
  ) {}

  value(): VerifyFunction.BearerFn<SignupRequest> {
    return async (token: string, req?: Request) => {
      let result: SignupRequest;

      try {
        if (this.authConfig?.useSymmetricEncryption) {
          result = jwt.verify(token, process.env.JWT_SECRET as string, {
            issuer: process.env.JWT_ISSUER,
            algorithms: ['HS256'],
          }) as SignupRequest;
        } else {
          // Get the key that matches the token's kid
          const decoded = jwt.decode(token.trim(), {complete: true});
          if (!decoded) {
            throw new Error('Code is not valid');
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
          result = jwt.verify(token, pem, {
            issuer: process.env.JWT_ISSUER,
            algorithms: ['RS256'],
          }) as SignupRequest;
        }
      } catch (error) {
        this.logger.error(JSON.stringify(error));
        throw new HttpErrors.Unauthorized('TokenExpired');
      }
      return result;
    };
  }
}
