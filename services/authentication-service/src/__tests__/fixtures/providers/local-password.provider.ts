import {Provider} from '@loopback/core';
import {VerifyFunction} from 'loopback4-authentication';

export class TestPasswordVerifyProvider
  implements Provider<VerifyFunction.LocalPasswordFn>
{
  constructor() {}

  value(): VerifyFunction.LocalPasswordFn {
    return async (token: string) => {
      return {id: 1, username: 'mayank', password: 'pass'};
    };
  }
}
