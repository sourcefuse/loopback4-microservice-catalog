// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {FacebookSignUpFn} from './types';

export class FacebookOauth2SignupProvider
  implements Provider<FacebookSignUpFn>
{
  value(): FacebookSignUpFn {
    return async profile => {
      throw new HttpErrors.NotImplemented(
        `FacebookOauth2SignupProvider not implemented`,
      );
    };
  }
}
