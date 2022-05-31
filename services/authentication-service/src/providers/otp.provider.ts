import {inject, Provider} from '@loopback/context';
import {OtpFn} from './types';
import {OtpGenerateFn, OtpSenderFn, VerifyBindings} from '../providers';
import {authenticator} from 'otplib';
import {User} from '../models';

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
      await this.sendOtp(otp, user.username);
      return {
        key: secret,
      };
    };
  }
}
