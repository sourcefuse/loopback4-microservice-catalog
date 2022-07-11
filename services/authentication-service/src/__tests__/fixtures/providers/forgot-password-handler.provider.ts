// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider, service} from '@loopback/core';
import {ForgotPasswordHandlerFn} from '../../../providers/types';
import {TestHelperService} from '../services';

export class TestForgotPasswordTokenHandlerProvider
  implements Provider<ForgotPasswordHandlerFn>
{
  constructor(
    @service(TestHelperService)
    private readonly helper: TestHelperService,
  ) {}
  value(): ForgotPasswordHandlerFn {
    return async dto => {
      this.helper.set('TOKEN', dto.code);
      this.helper.set('EMAIL', dto.email);
    };
  }
}
