import {inject} from '@loopback/context';
import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import {AuthErrorKeys} from 'loopback4-authentication';
import {AuthClient} from '../models';
import {AuthUser} from '../modules/auth/models/auth-user.model';
import {OtpGenerateFn, OtpSenderFn, VerifyBindings} from '../providers';
import {OtpCacheRepository} from '../repositories';

const otpCacheTtl = 60000;

@injectable({scope: BindingScope.TRANSIENT})
export class OtpSenderService {
  constructor(
    @repository(OtpCacheRepository)
    private readonly otpCacheRepo: OtpCacheRepository,
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
    @inject(VerifyBindings.OTP_GENERATE_PROVIDER)
    private readonly generateOtp: OtpGenerateFn,
    @inject(VerifyBindings.OTP_SENDER_PROVIDER)
    private readonly sendOtpToUser: OtpSenderFn,
  ) {}

  async sendOtp(client?: AuthClient, user?: AuthUser): Promise<string> {
    if (!client) {
      this.logger.error('Auth client not found or invalid');
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    }
    if (!user) {
      this.logger.error('Auth user not found or invalid');
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    }
    const email = user.email ?? user.username;
    const otp = await this.generateOtp();
    await this.sendOtpToUser(otp, user);

    await this.otpCacheRepo.set(
      email,
      {
        otp: otp,
        userId: user.id,
        clientId: client.clientId,
        clientSecret: client.secret,
      },
      {ttl: otpCacheTtl},
    );
    return email;
  }
}
