// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {IAuthUser, Keycloak} from 'loopback4-authentication';

import {KeyCloakPostVerifyFn} from './types';

export class KeyCloakPostVerifyProvider
  implements Provider<KeyCloakPostVerifyFn>
{
  value(): KeyCloakPostVerifyFn {
    return async (profile: Keycloak.Profile, user: IAuthUser | null) => user;
  }
}
