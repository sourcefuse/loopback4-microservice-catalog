// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {JwtKeysRepository} from '@sourceloop/core';
import * as jwt from 'jsonwebtoken';
import * as jose from 'node-jose';
import {AuthServiceBindings} from '../keys';
import {IAuthServiceConfig} from '../types';
import {JWTVerifierFn} from './types';
export class JWTAsymmetricVerifierProvider<T> implements Provider<
  JWTVerifierFn<T>
> {
  constructor(
    @repository(JwtKeysRepository)
    public jwtKeysRepo: JwtKeysRepository,
    @inject(AuthServiceBindings.Config, {optional: true})
    private readonly authConfig?: IAuthServiceConfig,
  ) {}
  value(): JWTVerifierFn<T> {
    return async (code: string, options: jwt.VerifyOptions) => {
      let payload: T;
      if (this.authConfig?.useSymmetricEncryption) {
        payload = jwt.verify(code, process.env.JWT_SECRET as string, {
          ...options,
          issuer: process.env.JWT_ISSUER,
          algorithms: ['HS256'],
        }) as T;
      } else {
        // Get the key that matches the token's kid
        const decoded = jwt.decode(code.trim(), {complete: true});
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

        // Verify the token with the retrieved PEM-formatted public key
        payload = jwt.verify(code, pem, {
          ...options,
          issuer: process.env.JWT_ISSUER,
          algorithms: ['RS256'],
        }) as T;
      }
      return payload;
    };
  }
}
