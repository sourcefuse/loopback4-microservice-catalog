// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {IAuthUser} from 'loopback4-authentication';
import * as FacebookStrategy from 'passport-facebook';
import {FacebookPostVerifyFn} from './types';

export class FacebookPostVerifyProvider
  implements Provider<FacebookPostVerifyFn>
{
  value(): FacebookPostVerifyFn {
    return async (profile: FacebookStrategy.Profile, user: IAuthUser | null) =>
      user;
  }
}
