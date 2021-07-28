import {Provider} from '@loopback/context';
import {IAuthUser} from 'loopback4-authentication';
import * as GoogleStrategy from 'passport-google-oauth20';

import {GooglePostVerifyFn} from './types';

export class GooglePostVerifyProvider implements Provider<GooglePostVerifyFn> {
  constructor() {}

  value(): GooglePostVerifyFn {
    return async (profile: GoogleStrategy.Profile, user: IAuthUser | null) =>
      user;
  }
}
