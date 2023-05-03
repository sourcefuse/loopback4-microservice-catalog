// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {InstagramSignUpFn} from './types';

export class InstagramOauth2SignupProvider
  implements Provider<InstagramSignUpFn>
{
  value(): InstagramSignUpFn {
    return async profile => {
      throw new HttpErrors.NotImplemented(
        `InstagramOauth2SignupProvider not implemented`,
      );
    };
  }
}
