// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {IAuthUser, Keycloak} from 'loopback4-authentication';

import {KeyCloakPreVerifyFn} from './types';

export class KeyCloakPreVerifyProvider
  implements Provider<KeyCloakPreVerifyFn>
{
  value(): KeyCloakPreVerifyFn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: Keycloak.Profile,
      user: IAuthUser | null,
    ) => user;
  }
}
