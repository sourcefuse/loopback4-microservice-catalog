// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider, service} from '@loopback/core';
import {SignupTokenHandlerFn} from '@sourceloop/authentication-service';
import {UserOpsService} from '../services';

export class SignupTokenHandlerProvider
  implements Provider<SignupTokenHandlerFn>
{
  constructor(
    @service(UserOpsService)
    private readonly userOps: UserOpsService,
  ) {}
  value(): SignupTokenHandlerFn {
    return async dto => this.userOps.createUserToken(dto);
  }
}
