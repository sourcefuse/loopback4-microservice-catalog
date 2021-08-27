import {Provider} from '@loopback/core';
import {VerifyFunction} from 'loopback4-authentication';

export class TestResourceOwnerVerifyProvider
  implements Provider<VerifyFunction.ResourceOwnerPasswordFn>
{
  constructor() {}

  value(): VerifyFunction.ResourceOwnerPasswordFn {
    return async (
      clientId: string,
      clientSecret: string,
      username: string,
      password: string,
    ) => {
      return {
        client: {
          clientId: 'web',
          clientSecret: 'test',
          refreshTokenExpiration: 1800,
          accessTokenExpiration: 1800,
        },
        user: {
          id: 1,
          username: 'test_user',
          password: 'temp123!@',
          authClientIds: '{1}',
        },
      };
    };
  }
}
