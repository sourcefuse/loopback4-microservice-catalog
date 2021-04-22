import {Provider} from '@loopback/context';
import {service} from '@loopback/core';
import {UserSignupFn} from '@sourceloop/authentication-service';
import {UserDto} from '../models/user.dto';
import {UserOpsService} from '../services';

export class LocalSignupProvider implements Provider<UserSignupFn<UserDto>> {

  constructor(
    @service(UserOpsService)
    private readonly userOps: UserOpsService
  ) { }

  value(): UserSignupFn<UserDto> {
    return async (model, token) => {
      const user = this.userOps.createUser(model, {})
      return user;
    }
  }
}
