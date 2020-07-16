import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {verify} from 'jsonwebtoken';
import {AuthErrorKeys, VerifyFunction} from 'loopback4-authentication';
import moment from 'moment-timezone';

import {IAuthUserWithPermissions} from '../keys';

export class ServicesBearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn> {
  constructor() {}

  value(): VerifyFunction.BearerFn {
    return async token => {
      let user: IAuthUserWithPermissions;

      try {
        user = verify(token, process.env.JWT_SECRET as string, {
          issuer: process.env.JWT_ISSUER,
        }) as IAuthUserWithPermissions;
      } catch (error) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
      }

      if (
        !user.passwordExpiryTime ||
        moment().isSameOrAfter(moment(user.passwordExpiryTime))
      ) {
        throw new HttpErrors.Unauthorized('PasswordExpiryError');
      }
      return user;
    };
  }
}
