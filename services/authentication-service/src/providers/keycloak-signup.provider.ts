import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {KeyCloakSignUpFn} from './types';

export class KeyCloakSignupProvider implements Provider<KeyCloakSignUpFn> {
  constructor() {}

  value(): KeyCloakSignUpFn {
    return async profile => {
      throw new HttpErrors.NotImplemented(
        `KeyCloakSignupProvider not implemented`,
      );
    };
  }
}
