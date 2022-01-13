import {Provider} from '@loopback/core';
import {VerifyFunction} from 'loopback4-authentication';

export class TestPasswordVerifyProvider
  implements Provider<VerifyFunction.LocalPasswordFn>
{
  value(): VerifyFunction.LocalPasswordFn {
    return async (username: string, password: string) => {
      if (username === 'test_user') {
        return {id: 1, username: 'test_user', password: 'temp123!@'};
      } else {
        return {id: 2, username: 'test_teacher', password: 'temp123!@'};
      }
    };
  }
}
