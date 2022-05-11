import {inject, Provider} from '@loopback/context';
import {OtpFn} from './types';
import {OtpGenerateFn, OtpSenderFn, VerifyBindings} from '../providers';

export class OtpProvider implements Provider<OtpFn> {
  constructor(
    @inject(VerifyBindings.OTP_GENERATE_PROVIDER)
    private readonly generateOtp: OtpGenerateFn,
    @inject(VerifyBindings.OTP_SENDER_PROVIDER)
    private readonly sendOtp: OtpSenderFn,
  ) {}

  value(): OtpFn {
    return async (username: string) => {
      const otp = await this.generateOtp();
      await this.sendOtp(otp, username);
      return {
        key: process.env.OTP_SECRET,
      };
    };
  }
}
