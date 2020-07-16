import {Provider} from '@loopback/core';
import {VerifyFunction} from 'loopback4-authentication';

export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn> {
  constructor() {}

  value(): VerifyFunction.BearerFn {
    return async token => {
      return {id: 1, username: 'mayank'};
    };
  }
}
