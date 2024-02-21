// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {OtpSenderFn, User} from '@sourceloop/authentication-service';

export class OtpSenderProvider implements Provider<OtpSenderFn> {
  value(): OtpSenderFn {
    return async (_otp: string, _user: User) => {};
  }
}
