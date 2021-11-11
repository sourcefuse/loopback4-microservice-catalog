import {Provider} from '@loopback/core';
import {VerifyFunction} from 'loopback4-authentication';

export class TestOauthPasswordVerifyProvider
  implements Provider<VerifyFunction.OauthClientPasswordFn>
{
  value(): VerifyFunction.OauthClientPasswordFn {
    return async (clientId: string, clientSecret: string) => {
      return {
        clientId: 'web',
        clientSecret: 'test',
        secret: 'poiuytrewq',
        authCodeExpiration: 1800,
        refreshTokenExpiration: 1800,
        accessTokenExpiration: 1800,
      };
    };
  }
}
