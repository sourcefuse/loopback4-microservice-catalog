// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';

export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn>
{
  value(): VerifyFunction.BearerFn {
    return async (token: string) => {
      // return bearer fn

      return verify(token, 'task-Service-Secret', {
        issuer: 'sf',
      }) as IAuthUserWithPermissions;
    };
  }
}
