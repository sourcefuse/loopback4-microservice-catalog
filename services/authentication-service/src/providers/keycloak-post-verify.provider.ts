import {Provider} from '@loopback/context';
import {IAuthUser, Keycloak} from 'loopback4-authentication';

import {KeyCloakPostVerifyFn} from './types';

export class KeyCloakPostVerifyProvider
  implements Provider<KeyCloakPostVerifyFn>
{
  constructor() {}

  value(): KeyCloakPostVerifyFn {
    return async (profile: Keycloak.Profile, user: IAuthUser | null) => user;
  }
}
