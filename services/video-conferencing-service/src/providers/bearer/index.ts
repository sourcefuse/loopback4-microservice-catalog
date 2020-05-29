import {Provider} from '@loopback/context';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';
import {IAuthUserWithPermissions} from '../../interfaces';

export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn> {
  constructor() {}

  value(): VerifyFunction.BearerFn {
    return async (token: string) => {
      const user = verify(token, 'secret') as IAuthUserWithPermissions;
      return user;
    };
  }
}
