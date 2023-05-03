// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {GoogleSignUpFn} from './types';

export class GoogleOauth2SignupProvider implements Provider<GoogleSignUpFn> {
  value(): GoogleSignUpFn {
    return async profile => {
      throw new HttpErrors.NotImplemented(
        `GoogleOauth2SignupProvider not implemented`,
      );
    };
  }
}
