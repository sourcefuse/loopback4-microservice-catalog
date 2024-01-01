import {Provider} from '@loopback/context';
import {IAuthUser} from 'loopback4-authentication';
// eslint-disable-next-line @typescript-eslint/naming-convention
import * as SamlStrategy from '@node-saml/passport-saml';
import {SamlPostVerifyFn} from './types';

export class SamlPostVerifyProvider implements Provider<SamlPostVerifyFn> {
  value(): SamlPostVerifyFn {
    return async (profile: SamlStrategy.Profile, user: IAuthUser | null) =>
      user;
  }
}
