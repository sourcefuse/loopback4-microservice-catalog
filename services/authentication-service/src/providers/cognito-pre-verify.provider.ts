// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {Cognito, IAuthUser} from 'loopback4-authentication';
import {CognitoPreVerifyFn} from './types';

export class CognitoPreVerifyProvider implements Provider<CognitoPreVerifyFn> {
  value(): CognitoPreVerifyFn {
    return async (
      accessToken: string,
      refreshToken: string,
      profile: Cognito.Profile,
      user: IAuthUser | null,
    ) => user;
  }
}
