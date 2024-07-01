// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider, inject} from '@loopback/core';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import {AuthServiceBindings} from '../keys';
import {IAuthServiceConfig} from '../types';
import {JWTSignerFn} from './types';

export class JWTSignerProvider<T extends string | object | Buffer>
  implements Provider<JWTSignerFn<T>>
{
  constructor(
    @inject(AuthServiceBindings.Config, {optional: true})
    private readonly authConfig?: IAuthServiceConfig,
  ) {}
  value(): JWTSignerFn<T> {
    return async (data: string | T, options: jwt.SignOptions) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let privateKey: any; //NOSONAR
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let accessToken: any; //NOSONAR
      if (this.authConfig?.useSymmetricEncryption) {
        accessToken = jwt.sign(data, process.env.JWT_SECRET as string, {
          ...options,
          issuer: process.env.JWT_ISSUER,
          algorithm: 'HS256',
        });
      } else {
        privateKey = fs.readFileSync(
          process.env.JWT_PRIVATE_KEY ?? '',
        ) as Buffer;
        accessToken = jwt.sign(data, privateKey, {
          ...options,
          issuer: process.env.JWT_ISSUER,
          algorithm: 'RS256',
        });
      }

      return accessToken;
    };
  }
}
