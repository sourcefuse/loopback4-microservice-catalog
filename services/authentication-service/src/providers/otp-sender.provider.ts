import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {User} from '../models';
import {OtpSenderFn} from './types';

export class OtpSenderProvider implements Provider<OtpSenderFn> {
  value(): OtpSenderFn {
    return async (_otp: string, _user: User) => {
      throw new HttpErrors.NotImplemented(`OtpSenderFn not implemented`);
    };
  }
}
