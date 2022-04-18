import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {AuthUser} from '../modules/auth';
import {OtpSenderFn} from './types';

export class OtpSenderProvider implements Provider<OtpSenderFn> {
  constructor() {}

  value(): OtpSenderFn {
    return async (_otp: string, _user: AuthUser) => {
      throw new HttpErrors.NotImplemented(`OtpSenderProvider not implemented`);
    };
  }
}
