import {Provider} from '@loopback/context';
import {IAuthUser, KeycloakProfile} from 'loopback4-authentication';

import {KeyCloakPreVerifyFn} from './types';

export class KeyCloakPreVerifyProvider
  implements Provider<KeyCloakPreVerifyFn>
{
  constructor() {}

  value(): KeyCloakPreVerifyFn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: KeycloakProfile,
      user: IAuthUser | null,
    ) => user;
  }
}
