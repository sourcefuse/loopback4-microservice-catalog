import {Provider} from '@loopback/context';
import {OtpFn} from './types';
import qrcode from 'qrcode';
import {authenticator} from 'otplib';

export class GoogleAuthenticatorProvider implements Provider<OtpFn> {
  constructor() {}

  value(): OtpFn {
    return async (username: string) => {
      const secret = authenticator.generateSecret();
      const otpauth = authenticator.keyuri(
        username,
        process.env.SERVICE_NAME!,
        secret,
      );
      const qrCode = await qrcode.toDataURL(otpauth);
      return {
        key: secret,
        qrCode,
      };
    };
  }
}
