// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import * as jwt from 'jsonwebtoken';
import {JwtKeysRepository} from '../repositories';
import {JWTSignerFn} from './types';

export class JWTAsymmetricSignerProvider<T extends string | object | Buffer>
  implements Provider<JWTSignerFn<T>>
{
  constructor(
    @repository(JwtKeysRepository)
    public jwtKeysRepo: JwtKeysRepository,
  ) {}

  value(): JWTSignerFn<T> {
    return async (data: T, options: jwt.SignOptions) => {
      // Load private keys
      const privateKeys = await this.jwtKeysRepo.find({
        order: ['createdOn DESC'],
      });

      if (!privateKeys.length) {
        throw new HttpErrors.InternalServerError('No keys found');
      }

      // Use the latest private key (assuming it's the last one added)
      const privateKey = privateKeys[0];

      const accessToken = jwt.sign(
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
      return accessToken;
    };
  }
}
