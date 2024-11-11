import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {Auth0SignUpFn} from './types';

export class Auth0SignupProvider implements Provider<Auth0SignUpFn> {
  value(): Auth0SignUpFn {
    return async profile => {
      throw new HttpErrors.NotImplemented(
        `Auth0SignupProvider not implemented`,
      );
    };
  }
}
