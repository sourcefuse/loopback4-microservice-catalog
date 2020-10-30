import * as GoogleStrategy from 'passport-google-oauth20';
import {User, UserRelations} from '../models';
import {KeycloakProfile} from 'loopback4-authentication';

export interface GoogleSignUpFn {
  (profile: GoogleStrategy.Profile): Promise<(User & UserRelations) | null>;
}

export interface KeyCloakSignUpFn {
  (profile: KeycloakProfile): Promise<(User & UserRelations) | null>;
}
