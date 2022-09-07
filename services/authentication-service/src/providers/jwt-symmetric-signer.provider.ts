import {Provider} from '@loopback/core';
import * as jwt from 'jsonwebtoken';
import {JWTSignerFn} from './types';
export class JWTSymmetricSignerProvider<T> implements Provider<JWTSignerFn<T>> {
  value(): JWTSignerFn<T> {
    return async (data: string | T, options: jwt.SignOptions) => {
      if (typeof data !== 'string') {
        data = JSON.stringify(data);
      }

      const secret = process.env.JWT_SECRET as string;

      const accessToken = jwt.sign(JSON.parse(data), secret as string, {
        ...options,
        issuer: process.env.JWT_ISSUER,
        algorithm: 'HS256',
      });
      return accessToken;
    };
  }
}
