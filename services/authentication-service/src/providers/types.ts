import * as GoogleStrategy from 'passport-google-oauth20';
import {IAuthUser} from 'loopback4-authentication/index';

export interface GoogleSignUpFn {
  (profile: GoogleStrategy.Profile): Promise<IAuthUser | null>;
}
