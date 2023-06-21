// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/core';
import * as fs from 'fs/promises';
import * as jwt from 'jsonwebtoken';
import {JWTVerifierFn} from './types';
export class JWTAsymmetricVerifierProvider<T>
  implements Provider<JWTVerifierFn<T>>
{
  value(): JWTVerifierFn<T> {
    return async (code: string, options: jwt.VerifyOptions) => {
      const secret = (await fs.readFile(
        process.env.JWT_PUBLIC_KEY ?? '',
      )) as Buffer;
      const payload = jwt.verify(code, secret, {
        ...options,
        issuer: process.env.JWT_ISSUER,
        algorithms: ['RS256'],
      }) as T;
      return payload;
    };
  }
}
