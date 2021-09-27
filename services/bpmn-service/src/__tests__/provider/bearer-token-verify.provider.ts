import {Provider} from '@loopback/context';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';

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
