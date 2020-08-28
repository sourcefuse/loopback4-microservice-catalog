import {Provider, inject} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';
import moment from 'moment-timezone';

import {IAuthUserWithPermissions} from '../keys';
import {AuthenticateErrorKeys} from '../../../enums';
import {ILogger, LOGGER} from '../../logger-extension';

export class ServicesBearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn> {
  constructor(@inject(LOGGER.LOGGER_INJECT) public logger: ILogger) {}

  value(): VerifyFunction.BearerFn {
    return async token => {
      let user: IAuthUserWithPermissions;

      try {
        user = verify(token, process.env.JWT_SECRET as string, {
          issuer: process.env.JWT_ISSUER,
        }) as IAuthUserWithPermissions;
      } catch (error) {
        this.logger.error(JSON.stringify(error));
        throw new HttpErrors.Unauthorized('TokenExpired');
      }

      if (
        user.passwordExpiryTime &&
        moment().isSameOrAfter(moment(user.passwordExpiryTime))
      ) {
        throw new HttpErrors.Unauthorized(
          AuthenticateErrorKeys.PasswordExpiryError,
        );
      }
      return user;
    };
  }
}
