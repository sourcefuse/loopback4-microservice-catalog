// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, Provider} from '@loopback/context';
import {AnyObject} from '@loopback/repository';
import {ClientAuthCode, STRATEGY} from 'loopback4-authentication';
import {OtpMethodType} from '../enums';
import {AuthServiceBindings} from '../keys';
import {AuthClient, User} from '../models';
import {AuthUser} from '../modules/auth';
import {OtpService} from '../services';
import {IMfaConfig, IOtpConfig} from '../types';
import {AuthCodeBindings, VerifyBindings} from './keys';
import {
  AuthCodeGeneratorFn,
  CodeWriterFn,
  JWTSignerFn,
  MfaCheckFn,
} from './types';

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
    @inject(AuthCodeBindings.JWT_SIGNER.key)
    private readonly jwtSigner: JWTSignerFn<AnyObject>,
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
      const token = await this.jwtSigner(codePayload, {
        audience: client.clientId,
        expiresIn: client.authCodeExpiration,
      });
      return this.codeWriter(token);
    };
  }
}
