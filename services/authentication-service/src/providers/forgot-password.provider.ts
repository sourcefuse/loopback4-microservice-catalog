import {Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {AuthenticateErrorKeys, AuthProvider} from '@sourceloop/core';
import {ForgotPasswordHandlerFn} from './types';

export class ForgotPasswordProvider
  implements Provider<ForgotPasswordHandlerFn>
{
  value(): ForgotPasswordHandlerFn {
    return async dto => {
      if (dto.user?.credentials?.authProvider !== AuthProvider.INTERNAL) {
        throw new HttpErrors.BadRequest(
          AuthenticateErrorKeys.PasswordCannotBeChanged,
        );
      }
      throw new HttpErrors.NotImplemented(
        `ForgotPasswordProvider not implemented`,
      );
    };
  }
}
