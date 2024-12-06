// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import * as jwt from 'jsonwebtoken';
import {AuthServiceBindings} from '../keys';
import {JwtKeysRepository} from '../repositories';
import {IAuthServiceConfig} from '../types';
import {JWTSignerFn} from './types';

export class JWTSignerProvider<T extends string | object | Buffer>
  implements Provider<JWTSignerFn<T>>
{
  constructor(
    @repository(JwtKeysRepository)
    public jwtKeysRepo: JwtKeysRepository,
    @inject(AuthServiceBindings.Config, {optional: true})
    private readonly authConfig?: IAuthServiceConfig,
  ) {}
  value(): JWTSignerFn<T> {
    return async (data: string | T, options: jwt.SignOptions) => {
      let accessToken: string;
      if (this.authConfig?.useSymmetricEncryption) {
        accessToken = jwt.sign(data, process.env.JWT_SECRET as string, {
          ...options,
          issuer: process.env.JWT_ISSUER,
          algorithm: 'HS256',
        });
      } else {
        // Load private keys
        const privateKeys = await this.jwtKeysRepo.find({
          order: ['createdOn DESC'],
        });

        if (!privateKeys.length) {
          throw new HttpErrors.InternalServerError('No keys found');
        }

        // Use the latest private key (assuming it's the last one added)
        const privateKey = privateKeys[0];

        accessToken = jwt.sign(
          data,
          {
            key: privateKey.privateKey,
            passphrase: process.env.JWT_PRIVATE_KEY_PASSPHRASE,
          },
          {
            ...options,
            algorithm: 'RS256',
            issuer: process.env.JWT_ISSUER,
            keyid: privateKey.keyId,
          },
        );
      }

      return accessToken;
    };
  }
}
