import {Provider} from '@loopback/context';
import {IAuthUser} from 'loopback4-authentication';
import * as AppleStrategy from 'passport-apple';

import {ApplePostVerifyFn} from './types';

export class ApplePostVerifyProvider implements Provider<ApplePostVerifyFn> {
  value(): ApplePostVerifyFn {
    return async (profile: AppleStrategy.Profile, user: IAuthUser | null) =>
      user;
  }
}
