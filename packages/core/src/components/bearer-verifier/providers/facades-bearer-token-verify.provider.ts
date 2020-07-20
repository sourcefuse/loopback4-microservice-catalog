import {Provider, inject} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {AuthErrorKeys, VerifyFunction} from 'loopback4-authentication';

import {AuthenticationService} from '../services';

export class FacadesBearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn> {
  constructor(
    @inject('services.AuthenticationService')
    protected authService: AuthenticationService,
  ) {}

  value(): VerifyFunction.BearerFn {
    return async (token, req) => {
      try {
        if (!req || !req.headers) {
          throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
        }
        return await this.authService.getme(req.headers.authorization);
      } catch (error) {
        throw new HttpErrors.Unauthorized('TokenExpired');
      }
    };
  }
}
