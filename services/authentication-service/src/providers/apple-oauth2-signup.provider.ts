import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {AppleSignUpFn} from './types';
import {AuthErrorKeys} from 'loopback4-authentication/index';

export class AppleOauth2SignupProvider implements Provider<AppleSignUpFn> {
  value(): AppleSignUpFn {
    return async profile => {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    };
  }
}
