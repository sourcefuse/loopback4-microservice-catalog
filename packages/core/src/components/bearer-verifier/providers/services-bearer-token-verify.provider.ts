import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {verify} from 'jsonwebtoken';
import {
  AuthErrorKeys,
  IAuthUser,
  VerifyFunction,
} from 'loopback4-authentication';

export class ServicesBearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn> {
  constructor() {}

  value(): VerifyFunction.BearerFn {
    return async token => {
      try {
        return verify(token, process.env.JWT_SECRET as string, {
          issuer: process.env.JWT_ISSUER,
        }) as IAuthUser;
      } catch (error) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
      }
    };
  }
}
