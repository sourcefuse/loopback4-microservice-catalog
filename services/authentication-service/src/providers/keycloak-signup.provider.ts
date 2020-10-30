import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {KeyCloakSignUpFn} from './types';
import {AuthErrorKeys} from 'loopback4-authentication/index';

export class KeyCloakSignupProvider implements Provider<KeyCloakSignUpFn> {
  constructor() {}

  value(): KeyCloakSignUpFn {
    return async profile => {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    };
  }
}
