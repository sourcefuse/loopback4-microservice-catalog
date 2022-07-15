// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/core';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';
import {IAuthUserWithPermissions} from '@sourceloop/core';

export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn>
{
  value(): VerifyFunction.BearerFn {
    return async (token: string) => {
      return verify(token, 'kdskssdkdfs', {
        issuer: 'sf',
      }) as IAuthUserWithPermissions;
    };
  }
}
