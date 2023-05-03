// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {IAuthUser} from 'loopback4-authentication';
import * as AzureADStrategy from 'passport-azure-ad';
import {AzureAdPreVerifyFn} from './types';

export class AzurePreVerifyProvider implements Provider<AzureAdPreVerifyFn> {
  value(): AzureAdPreVerifyFn {
    return async (
      // sonarignore:start
      accessToken: string,
      refreshToken: string,
      profile: AzureADStrategy.IProfile,
      user: IAuthUser | null,
      // sonarignore:end
    ) => user;
  }
}
