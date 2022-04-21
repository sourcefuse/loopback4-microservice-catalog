import {Provider} from '@loopback/context';
import {OtpGenerateFn} from './types';
import * as crypto from 'crypto';

export class OtpGenerateProvider implements Provider<OtpGenerateFn> {
  constructor() {}

  value(): OtpGenerateFn {
    return async () => {
      const min = 100000;
      const max = 999999;
      const otp = crypto.randomInt(min, max);
      return otp.toString();
    };
  }
}
