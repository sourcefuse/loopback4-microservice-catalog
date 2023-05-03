// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {SignupTokenHandlerFn} from './types';

export class SignupTokenHandlerProvider
  implements Provider<SignupTokenHandlerFn>
{
  value(): SignupTokenHandlerFn {
    return async dto => {
      throw new HttpErrors.NotImplemented(
        `SignupTokenHandlerProvider not implemented`,
      );
    };
  }
}
