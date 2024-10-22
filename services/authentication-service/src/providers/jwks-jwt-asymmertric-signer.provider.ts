// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/core';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
import {JWTSignerFn} from './types';

const PRIVATE_KEYS_PATH = path.join(__dirname, 'private-keys.json');

export class JwksJWTAsymmetricSignerProvider<T extends string | object | Buffer>
  implements Provider<JWTSignerFn<T>>
{
  value(): JWTSignerFn<T> {
    return async (data: T, options: jwt.SignOptions) => {
      // Load private keys
      const privateKeys = JSON.parse(
        fs.readFileSync(PRIVATE_KEYS_PATH, 'utf8'),
      );

      // Use the latest private key (assuming it's the last one added)
      const latestKeyId = Object.keys(privateKeys).pop();
      const privateKey = privateKeys[latestKeyId ?? 0];

      const accessToken = jwt.sign(
        data,
        {key: privateKey, passphrase: 'your-passphrase'},
        {
          ...options,
          algorithm: 'RS256',
          keyid: latestKeyId,
        },
      );
      return accessToken;
    };
  }
}
