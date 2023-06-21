// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, Provider} from '@loopback/context';
import {ClientAuthCode, STRATEGY} from 'loopback4-authentication';
import {AuthClient, User} from '../models';
import {AuthCodeGeneratorFn, CodeWriterFn, MfaCheckFn} from './types';
import * as jwt from 'jsonwebtoken';
import {AuthUser} from '../modules/auth';
import {AuthCodeBindings, VerifyBindings} from './keys';
import {OtpService} from '../services';
import {AuthServiceBindings} from '../keys';
import {IMfaConfig, IOtpConfig} from '../types';
import {OtpMethodType} from '../enums';

export class AuthCodeGeneratorProvider
  implements Provider<AuthCodeGeneratorFn>
{
  constructor(
    @inject('services.otpService')
    private readonly otpService: OtpService,
    @inject(VerifyBindings.MFA_PROVIDER)
    private readonly checkMfa: MfaCheckFn,
    @inject(AuthCodeBindings.CODEWRITER_PROVIDER)
    private readonly codeWriter: CodeWriterFn,
    @inject(AuthServiceBindings.MfaConfig, {optional: true})
    private readonly mfaConfig: IMfaConfig,
    @inject(AuthServiceBindings.OtpConfig, {optional: true})
    private readonly otpConfig: IOtpConfig,
  ) {}

  value(): AuthCodeGeneratorFn {
    return async (client: AuthClient, user: AuthUser) => {
      const codePayload: ClientAuthCode<User, typeof User.prototype.id> = {
        clientId: client.clientId,
        user: user,
      };
      const isMfaEnabled = await this.checkMfa(user);
      if (isMfaEnabled) {
        codePayload.mfa = true;
        if (
          this.mfaConfig.secondFactor === STRATEGY.OTP &&
          this.otpConfig.method === OtpMethodType.OTP
        ) {
          await this.otpService.sendOtp(user, client);
        }
      }
      return this.codeWriter(
        jwt.sign(codePayload, client.secret, {
          expiresIn: client.authCodeExpiration,
          audience: client.clientId,
          issuer: process.env.JWT_ISSUER,
          algorithm: 'HS256',
        }),
      );
    };
  }
}
