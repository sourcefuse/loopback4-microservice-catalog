import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {OtpSenderFn} from './types';

export class OtpSenderProvider implements Provider<OtpSenderFn> {
  constructor() {}

  value(): OtpSenderFn {
    return async (_otp: string, _username: string) => {
      throw new HttpErrors.NotImplemented(`OtpSenderFn not implemented`);
    };
  }
}
