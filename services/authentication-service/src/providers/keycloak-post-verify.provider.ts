import {Provider} from '@loopback/context';
import {IAuthUser, KeycloakProfile} from 'loopback4-authentication';

import {KeyCloakPostVerifyFn} from './types';

export class KeyCloakPostVerifyProvider
  implements Provider<KeyCloakPostVerifyFn>
{
  constructor() {}

  value(): KeyCloakPostVerifyFn {
    return async (profile: KeycloakProfile, user: IAuthUser | null) => user;
  }
}
