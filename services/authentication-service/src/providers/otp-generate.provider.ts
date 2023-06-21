// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, Provider} from '@loopback/context';
import {ILogger, LOGGER} from '@sourceloop/core';
import {OtpGenerateFn} from './types';
import {HttpErrors} from '@loopback/rest';
import {AuthErrorKeys} from 'loopback4-authentication';
import {totp} from 'otplib';

const otpStep = 300;
const otpWindow = 0;

export class OtpGenerateProvider implements Provider<OtpGenerateFn> {
  constructor(@inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger) {}
  value(): OtpGenerateFn {
    return async (secret: string) => {
      if (!secret) {
        this.logger.error('Invalid OTP secret');
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
      totp.options = {
        step: +(process.env.OTP_STEP ?? otpStep),
        window: +(process.env.OTP_WINDOW ?? otpWindow),
      };
      return totp.generate(secret);
    };
  }
}
