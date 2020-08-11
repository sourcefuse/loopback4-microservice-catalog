import {Request} from '@loopback/rest';
import {IAuthUser} from 'loopback4-authentication';
import * as GoogleStrategy from 'passport-google-oauth20';

export interface GoogleSignUpFn {
  (profile: GoogleStrategy.Profile, cb: GoogleStrategy.VerifyCallback, req?: Request): Promise<IAuthUser | null>;
}
