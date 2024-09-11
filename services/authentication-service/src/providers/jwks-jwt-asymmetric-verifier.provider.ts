// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/core';
import {repository} from '@loopback/repository';
import * as jwt from 'jsonwebtoken';
import * as jose from 'node-jose';
import {JwtKeysRepository} from '../repositories';
import {JWTVerifierFn} from './types';

export class JwksJWTAsymmetricVerifierProvider<T>
  implements Provider<JWTVerifierFn<T>>
{
  constructor(
    @repository(JwtKeysRepository)
    public jwtKeysRepo: JwtKeysRepository,
  ) {}
  value(): JWTVerifierFn<T> {
    return async (token: string, options: jwt.VerifyOptions) => {
      // Get the key that matches the token's kid
      const decoded = jwt.decode(token, {complete: true});
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
      const payload = jwt.verify(token, pem, options) as T;

      return payload;
    };
  }
}
