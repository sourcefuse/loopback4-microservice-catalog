import {Provider} from '@loopback/core';
import * as bcrypt from 'bcrypt';
import {PasswordVerifyFn} from './types';

export class PasswordVerifyProvider implements Provider<PasswordVerifyFn> {
  value(): PasswordVerifyFn {
    // sonarignore:start
    return async (
      plainPassword: string,
      hashedPassword: string,
      key?: string,
    ) => {
      return bcrypt.compare(plainPassword, hashedPassword);
    };
    // sonarignore:end
  }
}
