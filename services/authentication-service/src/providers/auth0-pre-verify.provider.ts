// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {IAuthUser} from 'loopback4-authentication';

import * as Auth0Strategy from 'passport-auth0';
import {Auth0PreVerifyFn} from './types';

export class Auth0PreVerifyProvider implements Provider<Auth0PreVerifyFn> {
  value(): Auth0PreVerifyFn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: Auth0Strategy.Profile,
      user: IAuthUser | null,
    ) => user;
  }
}
