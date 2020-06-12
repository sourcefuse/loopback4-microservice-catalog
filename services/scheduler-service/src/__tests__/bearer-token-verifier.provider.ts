import {Provider} from '@loopback/context';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';
import {IAuthUserWithPermissions} from './keys';

export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn> {
  constructor() {}

  value(): VerifyFunction.BearerFn {
    return async token => {
      /*
        Implementing a basic JWT token decryption here
        Leaving the additional security to the consumer of this application

        Suggestion: to revoke these tokens put them in redis or some in-memory
        database.
        Use global interceptor over this to apply that check on each api.
      */
      const user = verify(token, process.env.JWT_SECRET as string, {
        issuer: process.env.JWT_ISSUER,
      }) as IAuthUserWithPermissions;
      return user;
    };
  }
}
