// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {KeyCloakSignUpFn} from './types';

export class KeyCloakSignupProvider implements Provider<KeyCloakSignUpFn> {
  value(): KeyCloakSignUpFn {
    return async profile => {
      throw new HttpErrors.NotImplemented(
        `KeyCloakSignupProvider not implemented`,
      );
    };
  }
}
