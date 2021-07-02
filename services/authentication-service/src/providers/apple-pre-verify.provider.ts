import {Provider} from '@loopback/context';
import {IAuthUser} from 'loopback4-authentication';
import * as AppleStrategy from 'passport-apple';

import {ApplePreVerifyFn} from './types';

export class ApplePreVerifyProvider implements Provider<ApplePreVerifyFn> {
  constructor() {}

  value(): ApplePreVerifyFn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: AppleStrategy.Profile,
      user: IAuthUser | null,
    ) => {
      return user;
    };
  }
}
