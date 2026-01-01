// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {JwtKeysRepository} from '@sourceloop/core';
import * as jwt from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';
import * as jose from 'node-jose';
import {IAuthUserWithPermissions} from '../keys';
export class BearerTokenVerifyProvider implements Provider<VerifyFunction.BearerFn> {
  constructor(
    @repository(JwtKeysRepository)
    public jwtKeysRepo: JwtKeysRepository,
  ) {}
  value(): VerifyFunction.BearerFn {
    return async (token: string) => {
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
      const payload = jwt.verify(token, pem, {
        issuer: process.env.JWT_ISSUER,
        algorithms: ['RS256'],
      }) as IAuthUserWithPermissions;

      return payload;
    };
  }
}
