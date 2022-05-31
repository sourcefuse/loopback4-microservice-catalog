import {inject, Provider} from '@loopback/context';
import {ClientAuthCode} from 'loopback4-authentication';
import {AuthClient, User} from '../models';
import {AuthCodeGeneratorFn, CodeWriterFn, MfaCheckFn} from './types';
import * as jwt from 'jsonwebtoken';
import {AuthUser} from '../modules/auth';
import {AuthCodeBindings, VerifyBindings} from './keys';
import {OtpService} from '../services';

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
        await this.otpService.sendOtp(client, user);
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
