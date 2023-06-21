// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/core';
import * as jwt from 'jsonwebtoken';
import {JWTSignerFn} from './types';
export class JWTSymmetricSignerProvider<T extends string | object | Buffer>
  implements Provider<JWTSignerFn<T>>
{
  value(): JWTSignerFn<T> {
    return async (data: string | T, options: jwt.SignOptions) => {
      const secret = process.env.JWT_SECRET as string;

      const accessToken = jwt.sign(data, secret, {
        ...options,
        issuer: process.env.JWT_ISSUER,
        algorithm: 'HS256',
      });
      return accessToken;
    };
  }
}
