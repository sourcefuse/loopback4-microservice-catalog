import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {AuthErrorKeys} from 'loopback4-authentication/index';
import {FacebookSignUpFn} from './types';

export class FacebookOauth2SignupProvider
  implements Provider<FacebookSignUpFn>
{
  value(): FacebookSignUpFn {
    return async profile => {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    };
  }
}
