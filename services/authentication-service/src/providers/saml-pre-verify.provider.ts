import {Provider} from '@loopback/context';
import {IAuthUser} from 'loopback4-authentication';
import * as SamlStrategy from '@node-saml/passport-saml';

import {SamlPreVerifyFn} from './types';

export class SamlPreVerifyProvider implements Provider<SamlPreVerifyFn> {
  value(): SamlPreVerifyFn {
    return async (profile: SamlStrategy.Profile, user: IAuthUser | null) =>
      user;
  }
}
