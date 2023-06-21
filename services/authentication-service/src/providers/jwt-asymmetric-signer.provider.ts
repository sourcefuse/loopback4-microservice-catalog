// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/core';
import * as fs from 'fs/promises';
import * as jwt from 'jsonwebtoken';
import {JWTSignerFn} from './types';

export class JWTAsymmetricSignerProvider<T extends string | object | Buffer>
  implements Provider<JWTSignerFn<T>>
{
  value(): JWTSignerFn<T> {
    return async (data: T, options: jwt.SignOptions) => {
      const secret = (await fs.readFile(
        process.env.JWT_PRIVATE_KEY ?? '',
      )) as Buffer;
      const accessToken = jwt.sign(data, secret, {
        ...options,
        issuer: process.env.JWT_ISSUER,
        algorithm: 'RS256',
      });
      return accessToken;
    };
  }
}
