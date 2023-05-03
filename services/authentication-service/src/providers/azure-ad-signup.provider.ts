// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {AzureAdSignUpFn} from './types';

export class AzureAdSignupProvider implements Provider<AzureAdSignUpFn> {
  value(): AzureAdSignUpFn {
    // sonarignore:start
    return async profile => {
      // sonarignore:end
      throw new HttpErrors.NotImplemented(
        `AzureAdSignupProvider not implemented`,
      );
    };
  }
}
