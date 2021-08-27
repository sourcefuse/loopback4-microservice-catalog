import {Provider} from '@loopback/core';
import {VerifyFunction} from 'loopback4-authentication';

export class TestPasswordVerifyProvider
  implements Provider<VerifyFunction.LocalPasswordFn>
{
  constructor() {}

  value(): VerifyFunction.LocalPasswordFn {
    return async (username: string, password: string) => {
      return {id: 1, username: 'test_user', password: 'temp123!@'};
    };
  }
}
