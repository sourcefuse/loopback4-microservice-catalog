import {Provider} from '@loopback/context';
import {IAuthUser} from 'loopback4-authentication';
import * as GoogleStrategy from 'passport-google-oauth20';

import {GooglePreVerifyFn} from './types';

export class GooglePreVerifyProvider implements Provider<GooglePreVerifyFn> {
  constructor() {}

  value(): GooglePreVerifyFn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: GoogleStrategy.Profile,
      user: IAuthUser | null,
    ) => user;
  }
}
