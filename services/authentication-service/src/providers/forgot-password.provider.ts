// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {ForgotPasswordHandlerFn} from './types';

export class ForgotPasswordProvider
  implements Provider<ForgotPasswordHandlerFn>
{
  value(): ForgotPasswordHandlerFn {
    return async dto => {
      throw new HttpErrors.NotImplemented(
        `ForgotPasswordProvider not implemented`,
      );
    };
  }
}
