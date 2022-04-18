import {Provider} from '@loopback/context';
import {OtpGenerateFn} from './types';
const crypto = require('crypto');

export class OtpGenerateProvider implements Provider<OtpGenerateFn> {
  constructor() {}

  value(): OtpGenerateFn {
    return async () => {
      const min = 100000;
      const max = 999999;
      return crypto.randomInt(min, max);
    };
  }
}
