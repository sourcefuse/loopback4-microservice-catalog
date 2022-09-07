import {Provider} from '@loopback/core';
import * as fs from 'fs/promises';
import * as jwt from 'jsonwebtoken';
import {JWTSignerFn} from './types';

export class JWTAsymmetricSignerProvider<T>
  implements Provider<JWTSignerFn<T>>
{
  constructor() {}
  value(): JWTSignerFn<T> {
    return async (data: string | T, options: jwt.SignOptions) => {
      if (typeof data !== 'string') {
        data = JSON.stringify(data);
      }

      const secret = (await fs.readFile(
        process.env.JWT_PRIVATE_KEY ?? '',
      )) as Buffer;

      const accessToken = jwt.sign(JSON.parse(data), secret, {
        ...options,
        issuer: process.env.JWT_ISSUER,
        algorithm: 'RS256',
      });
      return accessToken;
    };
  }
}
