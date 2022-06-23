import {Provider} from '@loopback/context';
import {User} from '../../../models';
import {OtpSenderFn} from '../../../providers';

export class OtpSenderProvider implements Provider<OtpSenderFn> {
  constructor() {}

  value(): OtpSenderFn {
    return async (_otp: string, _user: User) => {
      // this is intentional
    };
  }
}
