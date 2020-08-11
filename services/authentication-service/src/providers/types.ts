import * as GoogleStrategy from 'passport-google-oauth20';
import {User, UserRelations} from '../models';

export interface GoogleSignUpFn {
  (profile: GoogleStrategy.Profile): Promise<(User & UserRelations) | null>;
}
