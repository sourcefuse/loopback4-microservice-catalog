import {Provider, service} from '@loopback/core';
import {UserSignupFn} from '@sourceloop/authentication-service';
import {UserDto} from '../models/user.dto';
import {UserOpsService} from '../services';

export class LocalSignupProvider
  implements Provider<UserSignupFn<UserDto, UserDto>>
{
  constructor(
    @service(UserOpsService)
    private readonly userOps: UserOpsService,
  ) {}

  value(): UserSignupFn<UserDto, UserDto> {
    return async (model, token) => this.userOps.createUser(model, {});
  }
}
