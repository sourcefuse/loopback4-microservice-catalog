// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {IAuthUser} from 'loopback4-authentication';
import * as AppleStrategy from 'passport-apple';

import {ApplePreVerifyFn} from './types';

export class ApplePreVerifyProvider implements Provider<ApplePreVerifyFn> {
  value(): ApplePreVerifyFn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: AppleStrategy.Profile,
      user: IAuthUser | null,
    ) => user;
  }
}
