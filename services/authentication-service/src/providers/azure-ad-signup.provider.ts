// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {AzureAdSignUpFn} from './types';

export class AzureAdSignupProvider implements Provider<AzureAdSignUpFn> {
  value(): AzureAdSignUpFn {
    return async profile => {
      throw new HttpErrors.NotImplemented(
        `AzureAdSignupProvider not implemented`,
      );
    };
  }
}
