// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import * as fs from 'fs/promises';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';
import {IAuthUserWithPermissions} from '../keys';
export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn>
{
  value(): VerifyFunction.BearerFn {
    return async (token: string) => {
      /*
        Implementing a basic JWT token decryption here
        Leaving the additional security to the consumer of this application

        Suggestion: to revoke these tokens put them in redis or some in-memory
        database.
        Use global interceptor over this to apply that check on each api.
      */
      const publicKey = await fs.readFile(process.env.JWT_PRIVATE_KEY ?? '');
      return verify(token, publicKey, {
        issuer: process.env.JWT_ISSUER,
        algorithms: ['RS256'],
      }) as IAuthUserWithPermissions;
    };
  }
}
