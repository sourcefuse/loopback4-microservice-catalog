import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {InstagramSignUpFn} from './types';
import {AuthErrorKeys} from 'loopback4-authentication/index';

export class InstagramOauth2SignupProvider
  implements Provider<InstagramSignUpFn>
{
  value(): InstagramSignUpFn {
    return async profile => {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    };
  }
}
