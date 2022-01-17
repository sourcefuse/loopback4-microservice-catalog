import {Provider, service} from '@loopback/core';
import {SignupTokenHandlerFn} from '../../../providers/types';
import {TestHelperService} from '../services';

export class TestSignupTokenHandlerProvider
  implements Provider<SignupTokenHandlerFn>
{
  constructor(
    @service(TestHelperService)
    private helper: TestHelperService,
  ) {}
  value(): SignupTokenHandlerFn {
    return async dto => {
      this.helper.set('TOKEN', dto.code);
      this.helper.set('EMAIL', dto.email);
    };
  }
}
