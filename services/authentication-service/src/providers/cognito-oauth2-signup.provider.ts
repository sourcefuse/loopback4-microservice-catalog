// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {CognitoSignUpFn} from './types';

export class CognitoOauth2SignupProvider implements Provider<CognitoSignUpFn> {
  value(): CognitoSignUpFn {
    return async profile => {
      throw new HttpErrors.NotImplemented(
        `CognitoOauth2SignupProvider not implemented`,
      );
    };
  }
}
