import {inject} from '@loopback/context';
import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import {AuthErrorKeys} from 'loopback4-authentication';
import {AuthClient} from '../models';
import {AuthUser} from '../modules/auth/models/auth-user.model';
import {OtpResponse} from '../modules/auth';
import {OtpFn, VerifyBindings} from '../providers';
import {OtpCacheRepository, UserRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class OtpSenderService {
  constructor(
    @repository(OtpCacheRepository)
    private readonly otpCacheRepo: OtpCacheRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
    @inject(VerifyBindings.OTP_PROVIDER)
    private readonly otpSender: OtpFn,
  ) {}

  async sendOtp(
    client: AuthClient,
    user: AuthUser,
  ): Promise<OtpResponse | void> {
    if (!client) {
      this.logger.error('Auth client not found or invalid');
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    }
    if (!user) {
      this.logger.error('User not found or invalid');
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    }

    const res: OtpResponse = await this.otpSender(user.username);

    await this.otpCacheRepo.delete(user.username);
    await this.otpCacheRepo.set(user.username, {
      otpSecret: res.key,
      clientId: client.clientId,
      clientSecret: client.secret,
    });

    if (res.qrCode) {
      return {
        qrCode: res.qrCode,
      };
    }
  }
}
