// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider, inject} from '@loopback/core';
import * as fs from 'fs/promises';
import * as jwt from 'jsonwebtoken';
import {AuthServiceBindings} from '../keys';
import {IAuthServiceConfig} from '../types';
import {JWTVerifierFn} from './types';
export class JWTAsymmetricVerifierProvider<T>
  implements Provider<JWTVerifierFn<T>>
{
  constructor(
    @inject(AuthServiceBindings.Config, {optional: true})
    private readonly authConfig?: IAuthServiceConfig,
  ) {}
  value(): JWTVerifierFn<T> {
    return async (code: string, options: jwt.VerifyOptions) => {
      const publicKey = (await fs.readFile(
        process.env.JWT_PUBLIC_KEY ?? '',
      )) as Buffer;
      const payload = this.authConfig?.useSymmetricEncryption
        ? (jwt.verify(code, process.env.JWT_SECRET as string, {
            ...options,
            issuer: process.env.JWT_ISSUER,
            algorithms: ['HS256'],
          }) as T)
        : (jwt.verify(code, publicKey, {
            ...options,
            issuer: process.env.JWT_ISSUER,
            algorithms: ['RS256'],
          }) as T);
      return payload;
    };
  }
}
