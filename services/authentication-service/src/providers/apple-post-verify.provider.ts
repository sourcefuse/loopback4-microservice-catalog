﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {IAuthUser} from 'loopback4-authentication';
// eslint-disable-next-line @typescript-eslint/naming-convention
import * as AppleStrategy from 'passport-apple';

import {ApplePostVerifyFn} from './types';

export class ApplePostVerifyProvider implements Provider<ApplePostVerifyFn> {
  value(): ApplePostVerifyFn {
    return async (profile: AppleStrategy.Profile, user: IAuthUser | null) =>
      user;
  }
}
