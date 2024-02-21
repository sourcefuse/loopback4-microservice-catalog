// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, Provider} from '@loopback/context';
import {
  OtpFn,
  OtpGenerateFn,
  OtpSenderFn,
  User,
  VerifyBindings,
} from '@sourceloop/authentication-service';
import {authenticator} from 'otplib';

export class OtpProvider implements Provider<OtpFn> {
  constructor(
    @inject(VerifyBindings.OTP_GENERATE_PROVIDER)
    private readonly generateOtp: OtpGenerateFn,
    @inject(VerifyBindings.OTP_SENDER_PROVIDER)
    private readonly sendOtp: OtpSenderFn,
  ) {}

  value(): OtpFn {
    return async (user: User) => {
      const secret = authenticator.generateSecret();
      const otp = await this.generateOtp(secret);
      await this.sendOtp(otp, user);
      return {
        key: secret,
      };
    };
  }
}
