// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {IAuthUser} from 'loopback4-authentication';

import * as Auth0Strategy from 'passport-auth0';

import {Auth0PostVerifyFn} from './types';

export class Auth0PostVerifyProvider implements Provider<Auth0PostVerifyFn> {
  value(): Auth0PostVerifyFn {
    return async (profile: Auth0Strategy.Profile, user: IAuthUser | null) =>
      user;
  }
}
