import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {GoogleSignUpFn} from './types';
import {AuthErrorKeys} from 'loopback4-authentication/index';

export class GoogleOauth2SignupProvider implements Provider<GoogleSignUpFn> {
  constructor() {}

  value(): GoogleSignUpFn {
    return async profile => {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    };
  }
}
