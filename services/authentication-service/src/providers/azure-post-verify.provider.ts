// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {IAuthUser} from 'loopback4-authentication';
import * as AzureADStrategy from 'passport-azure-ad';
import {AzureAdPostVerifyFn} from './types';

export class AzurePostVerifyProvider implements Provider<AzureAdPostVerifyFn> {
  value(): AzureAdPostVerifyFn {
    // sonarignore:start
    return async (profile: AzureADStrategy.IProfile, user: IAuthUser | null) =>
      // sonarignore:end
      user;
  }
}
