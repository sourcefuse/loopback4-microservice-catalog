// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/core';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';
import {IAuthUserWithPermissions} from '@sourceloop/core';
process.env.JWT_SECRET = 'kdskssdkdfs';
export class BearerTokenVerifyProvider implements Provider<VerifyFunction.BearerFn> {
  value(): VerifyFunction.BearerFn {
    return async (token: string) => {
      return verify(token, process.env.JWT_SECRET ?? 'default_secret', {
        issuer: 'sf',
      }) as IAuthUserWithPermissions;
    };
  }
}
