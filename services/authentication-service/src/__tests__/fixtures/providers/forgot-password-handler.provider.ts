import {Provider, service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {AuthenticateErrorKeys, AuthProvider} from '@sourceloop/core';
import {ForgotPasswordHandlerFn} from '../../../providers/types';
import {TestHelperService} from '../services';

export class TestForgotPasswordTokenHandlerProvider
  implements Provider<ForgotPasswordHandlerFn>
{
  constructor(
    @service(TestHelperService)
    private helper: TestHelperService,
  ) {}
  value(): ForgotPasswordHandlerFn {
    return async dto => {
      if (dto.user?.credentials?.authProvider !== AuthProvider.INTERNAL) {
        throw new HttpErrors.BadRequest(
          AuthenticateErrorKeys.PasswordCannotBeChanged,
        );
      }
      this.helper.set('TOKEN', dto.code);
      this.helper.set('EMAIL', dto.email);
    };
  }
}
