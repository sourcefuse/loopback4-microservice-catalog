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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let publicKey: any; //NOSONAR
      let payload: T;
      if (this.authConfig?.useSymmetricEncryption) {
        payload = jwt.verify(code, process.env.JWT_SECRET as string, {
          ...options,
          issuer: process.env.JWT_ISSUER,
          algorithms: ['HS256'],
        }) as T;
      } else {
        publicKey = (await fs.readFile(
          process.env.JWT_PUBLIC_KEY ?? '',
        )) as Buffer;
        payload = jwt.verify(code, publicKey, {
          ...options,
          issuer: process.env.JWT_ISSUER,
          algorithms: ['RS256'],
        }) as T;
      }
      return payload;
    };
  }
}
