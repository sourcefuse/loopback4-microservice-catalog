import {Provider} from '@loopback/core';
import * as bcrypt from 'bcrypt';
import {PasswordVerifyFn} from './types';

export class PasswordVerifyProvider implements Provider<PasswordVerifyFn> {
  value(): PasswordVerifyFn {
    return async (plainPassword: string, hashedPassword: string) => {
      return bcrypt.compare(plainPassword, hashedPassword);
    };
  }
}
