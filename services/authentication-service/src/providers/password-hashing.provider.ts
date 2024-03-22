import {Provider} from '@loopback/core';
import * as bcrypt from 'bcrypt';
import {PasswordHashingFn} from './types';
const saltRounds = 10;
export class PasswordHashingProvider implements Provider<PasswordHashingFn> {
  value(): PasswordHashingFn {
    return async (password?: string, key?: string) => {
      const hashedPassword = bcrypt.hash(
        password ?? (process.env.USER_TEMP_PASSWORD as string),
        saltRounds,
      );
      return hashedPassword;
    };
  }
}
