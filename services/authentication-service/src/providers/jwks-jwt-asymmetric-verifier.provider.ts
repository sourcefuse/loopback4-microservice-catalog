// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/core';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import * as jose from 'node-jose';
import * as path from 'path';
import {JWTVerifierFn} from './types';

const JWKS_FILE_PATH = path.join(__dirname, 'jwks.json');

export class JwksJWTAsymmetricVerifierProvider<T>
  implements Provider<JWTVerifierFn<T>>
{
  value(): JWTVerifierFn<T> {
    return async (token: string, options: jwt.VerifyOptions) => {
      const jwks = JSON.parse(fs.readFileSync(JWKS_FILE_PATH, 'utf8'));

      // Get the key that matches the token's kid
      const decoded = jwt.decode(token, {complete: true});
      const kid = decoded?.header.kid;

      // Find the public key by kid in the JWKS
      const key = jwks.keys.find((k: {kid: string}) => k.kid === kid);

      if (!key) {
        throw new Error('Key not found for verification');
      }

      // Convert the JWK back to PEM format for verification
      const pem = await jose.JWK.asKey(key).then(jwk => jwk.toPEM(false));

      // Verify the token
      const payload = jwt.verify(token, pem) as T;

      return payload;
    };
  }
}
