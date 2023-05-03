// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {IAuthUser} from 'loopback4-authentication';
import * as InstagramStrategy from 'passport-instagram';

import {InstagramPostVerifyFn} from './types';

export class InstagramPostVerifyProvider
  implements Provider<InstagramPostVerifyFn>
{
  value(): InstagramPostVerifyFn {
    return async (profile: InstagramStrategy.Profile, user: IAuthUser | null) =>
      user;
  }
}
