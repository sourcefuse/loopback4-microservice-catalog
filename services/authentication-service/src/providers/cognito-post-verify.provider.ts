// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {Cognito, IAuthUser} from 'loopback4-authentication';
import {CognitoPostVerifyFn} from './types';

export class CognitoPostVerifyProvider
  implements Provider<CognitoPostVerifyFn>
{
  value(): CognitoPostVerifyFn {
    return async (profile: Cognito.Profile, user: IAuthUser | null) => user;
  }
}
